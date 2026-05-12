import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

CATEGORY_KEYS = [
    "hedging_words",
    "overemphasis_words",
    "distancing_language",
    "unnecessary_details",
    "avoidance_patterns",
    "emotional_manipulation",
]

CATEGORY_LABELS = {
    "hedging_words": "模糊限定词",
    "overemphasis_words": "过度强调词",
    "distancing_language": "距离化语言",
    "unnecessary_details": "过度细节",
    "avoidance_patterns": "回避模式",
    "emotional_manipulation": "情感操控",
}


class DeceptionAnalyzer:

    def __init__(self, indicators_path: str = None):
        if indicators_path is None:
            indicators_path = Path(__file__).parent.parent.parent / "data" / "deception_indicators.json"
            if not indicators_path.exists():
                indicators_path = Path(__file__).parent.parent.parent.parent / "data" / "deception_indicators.json"
        with open(indicators_path, "r", encoding="utf-8") as f:
            self.indicators = json.load(f)

    def extract_features(self, text: str) -> Dict:
        text_lower = text.lower()
        matched = {k: [] for k in CATEGORY_KEYS}

        for cat_key in CATEGORY_KEYS:
            cat = self.indicators[cat_key]

            # word list matching
            for word in cat.get("words", []):
                if word.lower() in text_lower or word in text:
                    if word not in matched[cat_key]:
                        matched[cat_key].append(word)

            # regex matching
            for pattern in cat.get("regex", []):
                try:
                    if re.search(pattern, text):
                        captured = re.findall(pattern, text)
                        for c in captured[:3]:
                            short = str(c)[:20]
                            if short not in matched[cat_key]:
                                matched[cat_key].append(short)
                except re.error:
                    pass

        chinese_chars = len([c for c in text if '一' <= c <= '鿿'])
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
        matched = features["matched_patterns"]
        reasons = []
        score = 0.0

        for cat_key in CATEGORY_KEYS:
            weight = self.indicators[cat_key]["weight"]
            label = CATEGORY_LABELS[cat_key]
            if matched[cat_key]:
                n = len(matched[cat_key])
                s = min(n * weight * 30, 25)
                score += s
                reasons.append(f"[{label}]: {', '.join(matched[cat_key])} (+{s:.1f}分)")

        density = features["match_density"]
        if density > 0.05:
            bonus = min(density * 50, 15)
            score += bonus
            reasons.append(f"[高密度] 可疑词汇占比 {density:.1%} (+{bonus:.1f}分)")

        return min(score, 100), reasons

    def build_prompt(self, features: Dict) -> Tuple[str, float, List[str]]:
        score, reasons = self.compute_linguistic_score(features)
        m = features["matched_patterns"]

        cat_summary_lines = []
        for cat_key in CATEGORY_KEYS:
            label = CATEGORY_LABELS[cat_key]
            val = ", ".join(m[cat_key]) if m[cat_key] else "无"
            cat_summary_lines.append(f"{label}: {val}")

        cat_block = "\n".join(cat_summary_lines)

        prompt = f"""你是一位谎言检测分析师。请分析以下陈述，判断说话者是否可能在撒谎。

语言行为学研究表明：
- "说实话""我发誓""相信我""肯定""绝对"等过度强调词往往是撒谎信号
- 堆砌无关细节（如精确时间、人名地名）常被用来让虚假故事听起来可信
- 反问代替回答、转移话题是典型的回避模式
- 博取同情、扮演受害者是情感操控的常见手法

请按以下格式输出：
【分析】: 对陈述的语言模式和可信度进行简要分析
【倾向】: 只输出一个词——"诚实"或"撒谎"

陈述："{features["text"]}"
语言学预检：评分{score:.0f}/100
{cat_block}
"""
        return prompt, score, reasons
