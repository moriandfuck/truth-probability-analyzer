"""
Ollama API 客户端 —— 调用本地 DeepSeek-R1 做推理
"""
import requests
import json


class OllamaClient:
    """本地 Ollama 模型调用客户端"""

    def __init__(self, base_url: str = "http://localhost:11434", model: str = "deepseek-r1:7b"):
        self.base_url = base_url
        self.model = model

    def chat(self, prompt: str, system_prompt: str = None) -> str:
        """发送对话请求，返回模型回复"""
        url = f"{self.base_url}/api/generate"

        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        if system_prompt:
            payload["system"] = system_prompt

        try:
            response = requests.post(url, json=payload, timeout=120)
            response.raise_for_status()
            result = response.json()
            return result.get("response", "")
        except requests.exceptions.ConnectionError:
            return "[错误] 无法连接到 Ollama 服务，请确保容器已启动: docker start ollama"
        except Exception as e:
            return f"[错误] API 调用失败: {str(e)}"

    def analyze_deception(self, prompt: str) -> str:
        """专门用于谎言分析的调用"""
        system_prompt = "你是一位专业的语言行为分析师。请严格按要求的格式输出分析结果。"
        return self.chat(prompt, system_prompt)


if __name__ == "__main__":
    client = OllamaClient()
    test_prompt = "请分析以下陈述的真实性：'说实话，我真的没有拿你的东西，我发誓。'"
    print("🤖 正在调用本地 DeepSeek-R1 7B...")
    result = client.analyze_deception(test_prompt)
    print(f"📝 模型回复:\n{result}")