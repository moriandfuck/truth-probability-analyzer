"""
Truth Probability Analyzer - 一键演示脚本
用法: python examples/demo.py "你要分析的话"
"""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.models.deception_analyzer import DeceptionAnalyzer
from app.utils.ollama_cli import query_ollama


def demo(text: str):
    print("=" * 60)
    print("🕵️  Truth Probability Analyzer v0.1")
    print("=" * 60)

    # 第一步：语言学预检
    print("\n📊 [1/3] 语言学特征提取...")
    analyzer = DeceptionAnalyzer()
    features = analyzer.extract_features(text)
    _, ling_score, reasons = analyzer.build_prompt(features)

    print(f"  → 语言学基础评分: {ling_score:.1f}/100")
    if reasons:
        print("  → 匹配到的可疑模式:")
        for r in reasons:
            print(f"     {r}")
    else:
        print("  → 未检测到明显可疑语言模式")

    # 第二步：DeepSeek-R1 深度推理
    print("\n🧠 [2/3] 调用本地 DeepSeek-R1 7B 深度推理...")
    prompt = f"""你是一位语言行为分析师。请分析以下陈述的真实性。
输出格式：
【谎言概率】: XX/100
【推理过程】: ...
【结论】: ...

陈述："{text}"
"""
    reply = query_ollama(prompt)

    # 第三步：输出结果
    print("\n📝 [3/3] 分析结果:")
    print("-" * 60)

    # 清理模型输出中的控制字符
    reply = reply.replace("Thinking...", "").replace("done thinking.", "").strip()
    print(reply if reply else "(模型返回为空，请检查 Ollama 容器是否运行)")
    print("-" * 60)


if __name__ == "__main__":
    if len(sys.argv) > 1:
        text = sys.argv[1]
    else:
        text = input("请输入要分析的话: ")

    if not text.strip():
        print("❌ 请输入有效的文本")
        sys.exit(1)

    demo(text)