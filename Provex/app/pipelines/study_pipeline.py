# app/pipelines/study_pipeline.py
import json
import asyncio
from app.core.config import settings

from llama_index.core import VectorStoreIndex, Document, Settings as LISettings
from llama_index.core.node_parser import SentenceSplitter
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.llms.ollama import Ollama
from llama_index.vector_stores.qdrant import QdrantVectorStore
import qdrant_client


# ── LlamaIndex global settings ───────────────────────────────────────────────
LISettings.llm = Ollama(
    model=settings.llama_model,      # picks up ibm/granite4:micro from .env
    base_url=settings.ollama_base_url,
    request_timeout=300.0,
)
LISettings.embed_model = HuggingFaceEmbedding(
    model_name="BAAI/bge-small-en-v1.5"
)
LISettings.node_parser = SentenceSplitter(chunk_size=512, chunk_overlap=50)


# ── Qdrant client ────────────────────────────────────────────────────────────
qdrant = qdrant_client.QdrantClient(url=settings.qdrant_url)


# ── Prompts ──────────────────────────────────────────────────────────────────
LESSON_PROMPT = """
You are an expert computer science tutor.
Generate a detailed lesson on the topic: "{topic}"

Return ONLY valid JSON in this exact format:
{{
  "sections": [
    {{"heading": "Introduction", "content": "..."}},
    {{"heading": "Core Concepts", "content": "..."}},
    {{"heading": "Examples", "content": "..."}},
    {{"heading": "Summary", "content": "..."}}
  ],
  "qa_pairs": [
    {{"question": "What is ...?", "answer": "..."}},
    {{"question": "How does ...?", "answer": "..."}}
  ],
  "quiz": [
    {{
      "question": "Which of the following ...?",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "hints": [
        {{"cost": 5,  "text": "Think about ..."}},
        {{"cost": 10, "text": "The answer relates to ..."}}
      ]
    }}
  ]
}}

Generate 4 sections, 5 Q&A pairs, and exactly 5 quiz questions.
Return ONLY the JSON object, no extra text.
"""

UPLOAD_PROMPT = """
You are an expert tutor. Based on the following study material, 
generate a structured lesson.

Material:
\"\"\"
{text}
\"\"\"

Return ONLY valid JSON in this exact format:
{{
  "sections": [
    {{"heading": "...", "content": "..."}}
  ],
  "qa_pairs": [
    {{"question": "...", "answer": "..."}}
  ],
  "quiz": [
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_index": 0,
      "hints": [
        {{"cost": 5,  "text": "..."}},
        {{"cost": 10, "text": "..."}}
      ]
    }}
  ]
}}

Generate 4 sections, 5 Q&A pairs, and exactly 5 quiz questions.
Return ONLY the JSON object, no extra text.
"""


class StudyPipeline:

    def _build_index(self, user_id: int, topic: str, documents: list[Document]):
        """
        Embeds documents and stores them in Qdrant under
        a collection named by user_id + topic.
        """
        collection_name = f"user_{user_id}_{topic.replace(' ', '_').lower()}"

        vector_store = QdrantVectorStore(
            client=qdrant,
            collection_name=collection_name,
        )
        index = VectorStoreIndex.from_documents(
            documents,
            vector_store=vector_store,
        )
        return index

    def _parse_response(self, raw: str) -> dict:
        """
        Strips markdown fences if present and parses JSON.
        """
        cleaned = raw.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.split("```")[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        return json.loads(cleaned.strip())

    async def generate_from_topic(self, user_id: int, topic: str) -> dict:
        """
        Generates a lesson purely from a topic string.
        Uses LLM directly (no vector retrieval needed for topic-based generation).
        """
        prompt = LESSON_PROMPT.format(topic=topic)

        # Run blocking LLM call in thread pool
        loop = asyncio.get_event_loop()
        response = await loop.run_in_executor(
            None,
            lambda: LISettings.llm.complete(prompt)
        )

        return self._parse_response(str(response))

    async def generate_from_text(
        self,
        user_id: int,
        topic: str,
        raw_text: str,
    ) -> dict:
        """
        Ingests raw uploaded text into Qdrant, then
        generates a lesson from that content.
        """
        # 1. Build document and index it
        doc = Document(text=raw_text, metadata={"topic": topic})

        loop = asyncio.get_event_loop()
        await loop.run_in_executor(
            None,
            lambda: self._build_index(user_id, topic, [doc])
        )

        # 2. Generate lesson from the uploaded content
        # Truncate to avoid token limit issues
        truncated = raw_text[:3000]
        prompt = UPLOAD_PROMPT.format(text=truncated)

        response = await loop.run_in_executor(
            None,
            lambda: LISettings.llm.complete(prompt)
        )

        return self._parse_response(str(response))


# Singleton
study_pipeline = StudyPipeline()