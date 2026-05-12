import os
import httpx
from fastapi import APIRouter, HTTPException

router = APIRouter()

NEWS_SERVER = os.getenv("NEWS_SERVER_URL", "http://localhost:4444")


@router.get("/news/feed")
async def news_feed():
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.post(
                f"{NEWS_SERVER}/api/s/entire",
                json={"sources": []},
            )
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("items", data) if isinstance(data, dict) else data
                if isinstance(items, list):
                    return items[:50]
                return []
            return []
        except Exception:
            return []


@router.get("/news/source/{source_id}")
async def news_by_source(source_id: str):
    async with httpx.AsyncClient(timeout=15.0) as client:
        try:
            resp = await client.get(f"{NEWS_SERVER}/api/s", params={"id": source_id})
            if resp.status_code == 200:
                data = resp.json()
                items = data.get("items", data) if isinstance(data, dict) else data
                if isinstance(items, list):
                    return items[:50]
                return []
            return []
        except Exception:
            return []
