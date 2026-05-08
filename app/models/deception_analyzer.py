# -*- coding: utf-8 -*-
import json
from pathlib import Path
from typing import Dict, List, Tuple


class DeceptionAnalyzer:

    def __init__(self, indicators_path: str = None):
        if indicators_path is None:
            indicators_path = Path(__file__).parent.parent.parent / "data" / "deception_indicators.json"
        with open(indicators_path, "r", encoding="utf-8") as f:
            self.indicators = json.load(f)

    def extract_features(self, text: str) -> Dict:
        text_lower = text.lower()
        matched = {"hedging": [], "overemphasis": [], "distancing": []}

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
        matched = features["matched_patterns"]
        reasons = []
        score = 0.0

        cats = {
            "hedging": ("模糊限定词", self.indicators["hedging_words"]["weight"]),
            "overemphasis": ("过度强调词", self.indicators["overemphasis_words"]["weight"]),
            "distancing": ("距离化语言", self.indicators["distancing_language"]["weight"]),
        }

        for key, (name, weight) in cats.items():
            if matched[key]:
                n = len(matched[key])
                s = min(n * weight * 30, 25)
                score += s
                reasons.append(f"[{name}]: {', '.join(matched[key])} (+{s:.1f}分)")

        density = features["match_density"]
        if density > 0.05:
            bonus = min(density * 50, 15)
            score += bonus
            reasons.append(f"[高密度] 可疑词汇占比 {density:.1%} (+{bonus:.1f}分)")

        return min(score, 100), reasons

    def build_prompt(self, features: Dict) -> Tuple[str, float, List[str]]:
        score, reasons = self.compute_linguistic_score(features)
        m = features["matched_patterns"]
        hed = ", ".join(m["hedging"]) if m["hedging"] else "无"
        ove = ", ".join(m["overemphasis"]) if m["overemphasis"] else "无"
        dis = ", ".join(m["distancing"]) if m["distancing"] else "无"

        prompt = f"""你是一位谎言检测分析师。请分析以下陈述，判断说话者是否可能在撒谎。

注意：语言行为学研究表明，"说实话""我发誓""相信我""肯定""绝对"等过度强调词往往是撒谎信号。

请按以下格式输出：
【分析】: 对陈述的语言模式和可信度进行简要分析
【倾向】: 只输出一个词——"诚实"或"撒谎"

陈述："{features["text"]}"
语言学预检：评分{score:.0f}/100，模糊词:{hed}，强调词:{ove}，距离化:{dis}
"""
        return prompt, score, reasons