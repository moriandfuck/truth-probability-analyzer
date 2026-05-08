"""
通过命令行调用 Ollama（不走 API，直接用 ollama run）
"""
import subprocess


def query_ollama(prompt: str, model: str = "deepseek-r1:7b") -> str:
    """通过 docker exec 调用 ollama run，返回模型输出"""
    cmd = ["docker", "exec", "-i", "ollama", "ollama", "run", model]
    try:
        result = subprocess.run(
            cmd,
            input=prompt,
            capture_output=True,
            encoding="utf-8",
            errors="ignore",
            text=True,
            timeout=120
        )
        if result.returncode == 0:
            return result.stdout
        else:
            return f"[错误] {result.stderr}"
    except subprocess.TimeoutExpired:
        return "[错误] 请求超时"
    except FileNotFoundError:
        return "[错误] 找不到 docker 命令，请确认 Docker Desktop 在运行"


if __name__ == "__main__":
    prompt = """你是一位语言行为分析师。请分析以下陈述的真实性。
输出格式：
【谎言概率】: XX/100
【推理过程】: ...
【结论】: ...

陈述："说实话，我真的没有拿你的东西，我发誓，这件事完全与我无关"
"""
    print("🤖 正在调用本地 DeepSeek-R1 7B...")
    reply = query_ollama(prompt)
    print(f"📝 模型回复:\n{reply}")