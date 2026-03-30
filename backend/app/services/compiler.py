# app/services/compiler.py
import httpx
from app.core.config import settings

# Maps your language strings to OnlineCompiler.io compiler names
COMPILER_IDS: dict[str, str] = {
    "python3":    "python-3.9.7",
    "cpp":        "cpp-17",
    "java":       "java-17",
    "javascript": "nodejs-18",
}

STATUS_MAP = {
    "success": "Accepted",
    "error":   "Runtime Error",
}


class OnlineCompilerService:
    """
    Wraps OnlineCompiler.io API v2.
    Single endpoint: POST https://api.onlinecompiler.io/api/run-code/
    Auth: Authorization header (not query param like Sphere Engine).
    Response is SYNCHRONOUS — no polling needed.
    """

    def __init__(self):
        self.base_url = "https://api.onlinecompiler.io/api/run-code/"
        self.client = httpx.AsyncClient(timeout=30.0)

    def _headers(self) -> dict:
        return {
            "Authorization": settings.online_compiler_api_key,
            "Content-Type":  "application/json",
        }

    async def test_connection(self) -> bool:
        """Quick connectivity check — used by /health endpoint."""
        try:
            resp = await self.client.post(
                self.base_url,
                headers=self._headers(),
                json={
                    "compiler": "python-3.9.7",
                    "code": "print('ok')",
                    "input": "",
                },
            )
            return resp.status_code == 200
        except Exception:
            return False

    async def _execute(
        self,
        source_code: str,
        language: str,
        stdin_input: str = "",
    ) -> dict:
        """
        Single POST → immediate result. No polling required.
        Returns the raw API response dict.
        """
        compiler = COMPILER_IDS.get(language.lower())
        if compiler is None:
            raise ValueError(
                f"Unsupported language: {language}. "
                f"Supported: {list(COMPILER_IDS.keys())}"
            )

        resp = await self.client.post(
            self.base_url,
            headers=self._headers(),
            json={
                "compiler": compiler,
                "code":     source_code,
                "input":    stdin_input,
            },
        )

        if resp.status_code == 401:
            raise PermissionError("Invalid OnlineCompiler.io API key")
        if resp.status_code != 200:
            raise RuntimeError(
                f"OnlineCompiler.io error: {resp.status_code} — {resp.text}"
            )

        return resp.json()

    async def run_code(
        self,
        source_code: str,
        language: str,
        stdin_input: str = "",
    ) -> dict:
        """
        RUN button flow. Returns same shape as the old Sphere Engine method
        so challenges.py needs zero changes.
        """
        data = await self._execute(source_code, language, stdin_input)

        status = data.get("status", "error")
        return {
            "status_code":  0 if status == "success" else 1,
            "status_name":  STATUS_MAP.get(status, "Unknown"),
            "output":       data.get("output", ""),
            "error":        data.get("error", ""),
            "compile_info": data.get("error", ""),   # OC.io puts compile errors in "error"
            "time_seconds": float(data.get("time", 0)),
            "memory_kb":    int(data.get("memory", 0)),
        }

    async def run_against_test_cases(
        self,
        source_code: str,
        language: str,
        test_cases: list[dict],
    ) -> dict:
        """
        SUBMIT button flow. Runs each test case and compares output.
        Returns same shape as old Sphere Engine method.
        """
        results = []

        for i, tc in enumerate(test_cases, start=1):
            tc_input    = tc.get("input", "")
            tc_expected = tc.get("expected", "").strip()

            data = await self._execute(source_code, language, tc_input)

            status       = data.get("status", "error")
            actual_output = data.get("output", "").strip()
            passed = (status == "success") and (actual_output == tc_expected)

            results.append({
                "test_case":    i,
                "input":        tc_input,
                "expected":     tc_expected,
                "actual":       actual_output,
                "passed":       passed,
                "time_seconds": float(data.get("time", 0)),
                "memory_kb":    int(data.get("memory", 0)),
                "status_name":  STATUS_MAP.get(status, "Unknown"),
            })

        passed_count = sum(1 for r in results if r["passed"])

        return {
            "passed":       passed_count == len(test_cases),
            "total":        len(test_cases),
            "passed_count": passed_count,
            "results":      results,
        }

    async def close(self):
        await self.client.aclose()


# Singleton — same name so nothing else needs to change
sphere_engine = OnlineCompilerService()