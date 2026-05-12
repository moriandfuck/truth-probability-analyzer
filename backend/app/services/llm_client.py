import asyncio
import os
import re
from abc import ABC, abstractmethod
from typing import Optional

import httpx


class BaseLLMClient(ABC):
    @abstractmethod
    async def query(self, prompt: str, model: str = "", **kwargs) -> str: ...

    @abstractmethod
    def is_available(self) -> bool: ...


class OllamaClient(BaseLLMClient):
    def __init__(self, host: str = None, port: str = None):
        self.host = host or os.getenv("OLLAMA_HOST", "localhost")
        self.port = port or os.getenv("OLLAMA_PORT", "11434")
        self.base_url = f"http://{self.host}:{self.port}"

    def is_available(self) -> bool:
        return True

    async def query(self, prompt: str, model: str = "deepseek-r1:7b", **kwargs) -> str:
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                resp = await client.post(
                    f"{self.base_url}/api/generate",
                    json={
                        "model": model,
                        "prompt": prompt,
                        "stream": False,
                    },
                )
                if resp.status_code == 200:
                    return resp.json().get("response", "")
                return f"[错误] Ollama API: {resp.status_code}"
            except httpx.ConnectError:
                return "[错误] 无法连接 Ollama，请确认 Docker ollama 容器在运行"
            except Exception as e:
                return f"[错误] {e}"


class DeepSeekClient(BaseLLMClient):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("DEEPSEEK_API_KEY", "")
        self.base_url = "https://api.deepseek.com/v1/chat/completions"

    def is_available(self) -> bool:
        return bool(self.api_key)

    async def query(self, prompt: str, model: str = "deepseek-reasoner", **kwargs) -> str:
        if not self.api_key:
            return "[错误] 未配置 DeepSeek API Key"
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                resp = await client.post(
                    self.base_url,
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
                return f"[错误] DeepSeek API: {resp.status_code} {resp.text}"
            except Exception as e:
                return f"[错误] {e}"


class OpenAIClient(BaseLLMClient):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY", "")

    def is_available(self) -> bool:
        return bool(self.api_key)

    async def query(self, prompt: str, model: str = "gpt-4o", **kwargs) -> str:
        if not self.api_key:
            return "[错误] 未配置 OpenAI API Key"
        async with httpx.AsyncClient(timeout=120.0) as client:
            try:
                resp = await client.post(
                    "https://api.openai.com/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": model,
                        "messages": [{"role": "user", "content": prompt}],
                    },
                )
                if resp.status_code == 200:
                    data = resp.json()
                    return data["choices"][0]["message"]["content"]
                return f"[错误] OpenAI API: {resp.status_code} {resp.text}"
            except Exception as e:
                return f"[错误] {e}"


async def get_llm_client(
    provider: str = "local",
    api_key: Optional[str] = None,
) -> BaseLLMClient:
    if provider == "deepseek":
        key = api_key or os.getenv("DEEPSEEK_API_KEY", "")
        return DeepSeekClient(key)
    elif provider == "openai":
        key = api_key or os.getenv("OPENAI_API_KEY", "")
        return OpenAIClient(key)
    else:
        return OllamaClient()
