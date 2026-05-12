# -*- coding: utf-8 -*-
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..'))

from app.models.deception_analyzer import DeceptionAnalyzer
from app.utils.ollama_cli import query_ollama


def demo(text: str):
    print("=" * 60)
    print("Truth Probability Analyzer v0.1")
    print("=" * 60)

    print("\n[1/3] 语言学特征提取...")
    analyzer = DeceptionAnalyzer()
    features = analyzer.extract_features(text)
    prompt, score, reasons = analyzer.build_prompt(features)

    print(f"  -> 基础评分: {score:.1f}/100")
    if reasons:
        for r in reasons:
            print(f"     {r}")

    print("\n[2/3] DeepSeek-R1 7B 深度推理...")
    reply = query_ollama(prompt)

    print("\n[3/3] 分析结果:")
    print("-" * 60)
    reply = reply.replace("Thinking...", "").replace("done thinking.", "").strip()
    print(reply or "(模型返回为空)")

    # 综合评分
    print()
    if "【倾向】: 撒谎" in reply or "【倾向】:撒" in reply:
        final_score = min(score + 35, 95)
        print(f"  >>> 综合判定：倾向撒谎 | 最终评分: {final_score:.0f}/100")
    elif "【倾向】: 诚实" in reply or "【倾向】:诚" in reply:
        final_score = max(score - 10, 5)
        print(f"  >>> 综合判定：倾向诚实 | 最终评分: {final_score:.0f}/100")
    else:
        # 兜底：在回复末尾找
        if reply.rfind("撒谎") > reply.rfind("诚实"):
            final_score = min(score + 35, 95)
            print(f"  >>> 综合判定：倾向撒谎 | 最终评分: {final_score:.0f}/100")
        elif reply.rfind("诚实") > reply.rfind("撒谎"):
            final_score = max(score - 10, 5)
            print(f"  >>> 综合判定：倾向诚实 | 最终评分: {final_score:.0f}/100")
        else:
            print(f"  >>> 综合判定：无法判断 | 参考评分: {score:.0f}/100")
    print("-" * 60)


if __name__ == "__main__":
    text = sys.argv[1] if len(sys.argv) > 1 else input("请输入要分析的话: ")
    if not text.strip():
        print("请输入有效文本")
        sys.exit(1)
    demo(text)