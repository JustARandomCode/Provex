# app/pipelines/qwen.py
import json
import re
import httpx
from slugify import slugify
from app.core.config import settings


# Topics your coding arena supports — matches your design screenshots
VALID_TOPICS = [
    "Arrays", "Data Structures", "Algorithms",
    "Dynamic Programming", "SQL", "Python",
    "System Design", "Graph Theory", "Trees",
    "Sorting", "Binary Search", "Recursion",
]

VALID_DIFFICULTIES = ["easy", "medium", "hard"]

VALID_LANGUAGES = ["python3", "cpp", "java", "javascript"]

# XP rewards per difficulty
XP_MAP = {"easy": 30, "medium": 60, "hard": 100}


class QwenPipeline:
    """
    Handles all Qwen problem generation via Ollama local API.

    Ollama exposes a REST API at http://localhost:11434
    We call POST /api/generate with the model name and prompt.
    Response streams token by token — we wait for done=true.
    """

    def __init__(self):
        self.ollama_url = f"{settings.ollama_base_url}/api/generate"
        self.model = settings.qwen_model
        self.client = httpx.AsyncClient(timeout=120.0)  # generation takes time

    def _build_prompt(
        self,
        topic: str,
        difficulty: str,
        language: str,
    ) -> str:
        """
        The prompt is the most important part of this whole pipeline.
        We tell Qwen exactly what JSON structure to return so parsing
        is reliable. We ask for JSON only — no prose, no markdown fences.
        """
        return f"""You are an expert competitive programming problem setter.

Generate a {difficulty} level coding problem about {topic} for {language}.

Return ONLY a valid JSON object with this exact structure — no explanation, no markdown, no extra text:

{{
    "title": "Short descriptive problem title",
    "description": "Full problem statement explaining what the function should do. Be precise and unambiguous.",
    "constraints": "List constraints like: 1 <= n <= 10^5, array elements are integers",
    "difficulty": "{difficulty}",
    "topic": "{topic}",
    "language": "{language}",
    "examples": [
        {{
            "input": "exact input format",
            "output": "exact expected output",
            "explain": "brief explanation of why"
        }},
        {{
            "input": "second example input",
            "output": "second example output",
            "explain": "brief explanation"
        }}
    ],
    "test_cases": [
        {{"input": "test input 1", "expected": "expected output 1"}},
        {{"input": "test input 2", "expected": "expected output 2"}},
        {{"input": "test input 3", "expected": "expected output 3"}},
        {{"input": "edge case input", "expected": "edge case output"}},
        {{"input": "another edge case", "expected": "its output"}}
    ],
    "hints": [
        {{"cost": 10, "text": "Vague hint pointing toward the approach"}},
        {{"cost": 20, "text": "More specific hint about the algorithm"}},
        {{"cost": 30, "text": "Near-complete hint with the key insight"}}
    ],
    "solution_code": "def solution(...):\\n    # complete working solution in {language}\\n    pass"
}}

Rules:
- test_cases must have at least 5 entries including edge cases
- solution_code must be a complete working solution
- hints must go from vague to specific, costs 10/20/30
- Return ONLY the JSON object, nothing else
"""

    async def _call_ollama(self, prompt: str) -> str:
        """
        POST to Ollama's /api/generate endpoint.
        Ollama streams the response — we collect all chunks
        and join them into the full response text.
        """
        payload = {
            "model":  self.model,
            "prompt": prompt,
            "stream": False,   # wait for full response
            "options": {
                "temperature": 0.7,
                "top_p": 0.9,
                "num_predict": 2048,   # max tokens to generate
            },
        }

        response = await self.client.post(self.ollama_url, json=payload)

        if response.status_code != 200:
            raise RuntimeError(
                f"Ollama returned {response.status_code}: {response.text}"
            )

        data = response.json()
        return data.get("response", "")

    def _extract_json(self, raw_text: str) -> dict:
        """
        Parse the JSON from Qwen's response.
        Qwen sometimes wraps JSON in markdown fences even when
        told not to — we strip those before parsing.
        """
        text = raw_text.strip()

        # Strip markdown code fences if present
        text = re.sub(r"^```(?:json)?\n?", "", text)
        text = re.sub(r"\n?```$", "", text)
        text = text.strip()

        # Find the JSON object boundaries
        start = text.find("{")
        end   = text.rfind("}") + 1

        if start == -1 or end == 0:
            raise ValueError("No JSON object found in Qwen response")

        json_str = text[start:end]

        try:
            return json.loads(json_str)
        except json.JSONDecodeError as e:
            raise ValueError(f"Invalid JSON from Qwen: {e}")

    def _validate_problem(self, data: dict) -> dict:
        """
        Check the generated problem has all required fields
        and meets minimum quality standards.
        Raises ValueError with a clear message if anything is missing.
        """
        required_fields = [
            "title", "description", "constraints", "difficulty",
            "topic", "language", "examples", "test_cases",
            "hints", "solution_code",
        ]
        for field in required_fields:
            if field not in data or not data[field]:
                raise ValueError(f"Missing required field: {field}")

        if len(data["test_cases"]) < 3:
            raise ValueError("Need at least 3 test cases")

        if len(data["examples"]) < 1:
            raise ValueError("Need at least 1 example")

        if len(data["hints"]) < 1:
            raise ValueError("Need at least 1 hint")

        if len(data["solution_code"]) < 20:
            raise ValueError("Solution code is too short — likely incomplete")

        # Normalise difficulty and topic to match our DB enums
        data["difficulty"] = data["difficulty"].lower().strip()
        data["topic"]      = data.get("topic", "Algorithms").strip()
        data["language"]   = data.get("language", "python3").lower().strip()

        return data

    async def generate(
        self,
        topic: str,
        difficulty: str,
        language: str,
        max_retries: int = 2,
    ) -> dict:
        """
        Full generation pipeline:
        1. Build prompt
        2. Call Ollama/Qwen
        3. Parse JSON
        4. Validate structure
        5. Retry up to max_retries times on failure

        Returns a clean validated problem dict ready to save to DB.
        """
        if difficulty.lower() not in VALID_DIFFICULTIES:
            raise ValueError(f"Invalid difficulty. Choose from: {VALID_DIFFICULTIES}")

        if language.lower() not in VALID_LANGUAGES:
            raise ValueError(f"Invalid language. Choose from: {VALID_LANGUAGES}")

        last_error = None

        for attempt in range(max_retries + 1):
            try:
                prompt   = self._build_prompt(topic, difficulty, language)
                raw      = await self._call_ollama(prompt)
                data     = self._extract_json(raw)
                validated = self._validate_problem(data)

                # Add slug for URL-friendly problem ID
                validated["slug"] = slugify(validated["title"])
                validated["xp_reward"] = XP_MAP.get(difficulty.lower(), 30)

                return validated

            except (ValueError, RuntimeError) as e:
                last_error = e
                if attempt < max_retries:
                    continue   # retry

        raise RuntimeError(
            f"Qwen failed to generate a valid problem after "
            f"{max_retries + 1} attempts. Last error: {last_error}"
        )

    async def close(self):
        await self.client.aclose()


# Singleton
qwen_pipeline = QwenPipeline()