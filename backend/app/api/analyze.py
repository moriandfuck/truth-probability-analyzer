import time
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.models.deception_analyzer import DeceptionAnalyzer
from app.services.llm_client import get_llm_client
from app.services.key_manager import key_manager

router = APIRouter()
analyzer = DeceptionAnalyzer()


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=10000)
    model: str = Field(default="local", pattern="^(local|deepseek|openai)$")
    model_name_override: str | None = None


class LinguisticDetail(BaseModel):
    category: str
    matches: list[str]
    score_contribution: float


class LinguisticAnalysis(BaseModel):
    linguistic_score: float
    match_density: float
    matched_patterns: dict[str, list[str]]
    category_breakdown: list[LinguisticDetail]


class AnalyzeResponse(BaseModel):
    verdict: str
    final_score: float
    reasoning: str
    linguistic_analysis: LinguisticAnalysis
    model_used: str
    processing_time_ms: int


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze(req: AnalyzeRequest):
    start = time.time()

    features = analyzer.extract_features(req.text)
    prompt, linguistic_score, reasons = analyzer.build_prompt(features)

    model_name = req.model_name_override or {
        "local": "deepseek-r1:7b",
        "deepseek": "deepseek-reasoner",
        "openai": "gpt-4o",
    }.get(req.model, "deepseek-r1:7b")

    api_key = None
    if req.model in ("deepseek", "openai"):
        api_key = await key_manager.get_key(req.model)
        if not api_key:
            env_keys = key_manager.get_env_keys()
            api_key = env_keys.get(req.model, "")

    client = await get_llm_client(req.model, api_key)
    reply = await client.query(prompt, model=model_name)

    reply_clean = reply.replace("Thinking...", "").replace("done thinking.", "").strip()

    # Parse verdict
    if "【倾向】: 撒谎" in reply_clean or "【倾向】:撒" in reply_clean:
        verdict = "deceptive"
        final_score = min(linguistic_score + 35, 95)
    elif "【倾向】: 诚实" in reply_clean or "【倾向】:诚" in reply_clean:
        verdict = "honest"
        final_score = max(linguistic_score - 10, 5)
    else:
        if reply_clean.rfind("撒谎") > reply_clean.rfind("诚实"):
            verdict = "deceptive"
            final_score = min(linguistic_score + 35, 95)
        elif reply_clean.rfind("诚实") > reply_clean.rfind("撒谎"):
            verdict = "honest"
            final_score = max(linguistic_score - 10, 5)
        else:
            verdict = "uncertain"
            final_score = linguistic_score

    # Build category breakdown
    m = features["matched_patterns"]
    cat_weights = {
        "hedging": ("模糊限定词", analyzer.indicators["hedging_words"]["weight"]),
        "overemphasis": ("过度强调词", analyzer.indicators["overemphasis_words"]["weight"]),
        "distancing": ("距离化语言", analyzer.indicators["distancing_language"]["weight"]),
    }
    category_breakdown = []
    for key, (name, weight) in cat_weights.items():
        if m[key]:
            n = len(m[key])
            s = min(n * weight * 30, 25)
            category_breakdown.append(LinguisticDetail(
                category=name,
                matches=m[key],
                score_contribution=round(s, 1),
            ))

    elapsed = int((time.time() - start) * 1000)

    return AnalyzeResponse(
        verdict=verdict,
        final_score=round(final_score, 1),
        reasoning=reply_clean,
        linguistic_analysis=LinguisticAnalysis(
            linguistic_score=round(linguistic_score, 1),
            match_density=features["match_density"],
            matched_patterns=m,
            category_breakdown=category_breakdown,
        ),
        model_used=f"{model_name} ({req.model})",
        processing_time_ms=elapsed,
    )
