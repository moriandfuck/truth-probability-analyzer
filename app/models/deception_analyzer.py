"""
谎言概率分析引擎
结合语言学特征 + DeepSeek-R1 推理，输出谎言概率评分
"""
import json
import re
from pathlib import Path
from typing import Dict, List, Tuple


class DeceptionAnalyzer:
    """谎言检测分析器"""

    def __init__(self, indicators_path: str = None):
        """加载谎言指示词库"""
        if indicators_path is None:
            indicators_path = Path(__file__).parent.parent.parent / "data" / "deception_indicators.json"
        with open(indicators_path, "r", encoding="utf-8") as f:
            self.indicators = json.load(f)

    def extract_features(self, text: str) -> Dict:
        """从文本中提取语言学特征，支持中英文混合"""
        text_lower = text.lower()
        matched = {
            "hedging": [],
            "overemphasis": [],
            "distancing": [],
            "unnecessary_details": [],
            "avoidance": [],
            "emotional_manipulation": []
        }

        # 匹配各类指示词（中文直接用 in 匹配，因为中文不分词）
        for word in self.indicators["hedging_words"]["words"]:
            if word.lower() in text_lower or word in text:
                if word not in matched["hedging"]:
                    matched["hedging"].append(word)

        for word in self.indicators["overemphasis_words"]["words"]:
            if word.lower() in text_lower or word in text:
                if word not in matched["overemphasis"]:
                    matched["overemphasis"].append(word)

        for word in self.indicators["distancing_language"]["words"]:
            if word.lower() in text_lower or word in text:
                if word not in matched["distancing"]:
                    matched["distancing"].append(word)

        # 真正的中文词数统计：中文字符数 + 英文单词数
        chinese_chars = len([c for c in text if '\u4e00' <= c <= '\u9fff'])
        english_words = len(text.split())
        word_count = max(chinese_chars, english_words, 1)

        total_matches = sum(len(v) for v in matched.values())
        match_density = total_matches / max(word_count, 1)

        return {
            "matched_patterns": matched,
            "total_matches": total_matches,
            "word_count": word_count,
            "match_density": round(match_density, 4),
            "text": text
        }

    def compute_linguistic_score(self, features: Dict) -> Tuple[float, List[str]]:
        """基于语言学特征计算基础谎言概率评分 (0-100)"""
        matched = features["matched_patterns"]
        reasons = []
        score = 0.0

        category_names = {
            "hedging": ("模糊限定词", self.indicators["hedging_words"]["description"], 
                        self.indicators["hedging_words"]["weight"]),
            "overemphasis": ("过度强调词", self.indicators["overemphasis_words"]["description"], 
                             self.indicators["overemphasis_words"]["weight"]),
            "distancing": ("距离化语言", self.indicators["distancing_language"]["description"], 
                           self.indicators["distancing_language"]["weight"]),
        }

        for key, (cn_name, desc, weight) in category_names.items():
            if matched[key]:
                match_count = len(matched[key])
                category_score = min(match_count * weight * 30, 25)
                score += category_score
                reasons.append(
                    f"[{cn_name}] {desc}: 检测到 {', '.join(matched[key])} (+{category_score:.1f}分)"
                )

        # 匹配密度加分
        density = features["match_density"]
        if density > 0.05:
            bonus = min(density * 50, 15)
            score += bonus
            reasons.append(f"[高密度] 可疑词汇占比 {density:.1%} (+{bonus:.1f}分)")

        return min(score, 100), reasons

    def build_prompt(self, features: Dict) -> Tuple[str, float, List[str]]:
        """构建发给 DeepSeek-R1 的推理提示词"""
        linguistic_score, linguistic_reasons = self.compute_linguistic_score(features)
        matched = features["matched_patterns"]

        prompt = f"""你是一位专业的语言行为分析师，擅长通过语言模式判断陈述的真实性。

请分析以下文本的真实性。你的任务是：
1. 识别文本中是否存在撒谎的语言特征
2. 结合语言学检测结果，给出你的推理和判断
3. 输出一个 0-100 的谎言概率评分（0=完全诚实，100=完全撒谎）

【语言学预检测结果】
- 基础评分: {linguistic_score:.1f}/100
- 匹配到的可疑模式:
  模糊限定词: {matched["hedging"] if matched["hedging"] else "无"}
  过度强调词: {matched["overemphasis"] if matched["overemphasis"] else "无"}
  距离化语言: {matched["distancing"] if matched["distancing"] else "无"}
- 可疑词密度: {features["match_density"]:.1%}
- 原文词数: {features["word_count"]}

【待分析文本】
"{features["text"]}"

请按以下格式输出（用中文）：
【谎言概率】: XX/100
【推理过程】: 详细说明你的判断依据
【结论】: 一句话总结
"""
        return prompt, linguistic_score, linguistic_reasons


if __name__ == "__main__":
    # 快速测试
    analyzer = DeceptionAnalyzer()
    test_text = "说实话，我真的没有拿你的东西，我发誓，这件事完全与我无关"
    features = analyzer.extract_features(test_text)
    prompt, ling_score, reasons = analyzer.build_prompt(features)

    print("=" * 60)
    print("📝 测试文本:", test_text)
    print("-" * 60)
    print("📊 语言学预检结果:")
    if reasons:
        for r in reasons:
            print(f"  {r}")
    else:
        print("  (未匹配到明显特征)")
    print(f"  → 语言学基础评分: {ling_score:.1f}/100")
    print("-" * 60)
    print("🤖 发送给 DeepSeek-R1 的提示词:")
    print(prompt)