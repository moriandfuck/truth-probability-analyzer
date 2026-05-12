import os
import httpx
from fastapi import APIRouter

router = APIRouter()

NEWS_SERVER = os.getenv("NEWS_SERVER_URL", "http://localhost:4444")

POPULAR_SOURCES = [
    "zhihu", "weibo", "hackernews", "v2ex", "36kr", "ithome",
]


@router.get("/news/feed")
async def news_feed():
    all_items = []
    async with httpx.AsyncClient(timeout=30.0, trust_env=False) as client:
        for source in POPULAR_SOURCES:
            try:
                resp = await client.get(f"{NEWS_SERVER}/api/s", params={"id": source})
                if resp.status_code == 200:
                    data = resp.json()
                    items = data.get("items", [])
                    for item in items[:5]:
                        item["source"] = source
                        all_items.append(item)
            except Exception:
                pass

    return all_items[:50]


@router.get("/news/source/{source_id}")
async def news_by_source(source_id: str):
    async with httpx.AsyncClient(timeout=15.0, trust_env=False) as client:
        try:
            resp = await client.get(f"{NEWS_SERVER}/api/s", params={"id": source_id})
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("items", [])
                for item in items:
                    item["source"] = source_id
                return items[:50]
        except Exception:
            pass
    return []
