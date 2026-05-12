from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.analyze import router as analyze_router
from app.api.config import router as config_router
from app.api.llm_status import router as llm_status_router
from app.api.news import router as news_router
from app.services.key_manager import key_manager


@asynccontextmanager
async def lifespan(app: FastAPI):
    await key_manager.initialize()
    yield


app = FastAPI(
    title="Truth Probability Analyzer",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")
app.include_router(config_router, prefix="/api")
app.include_router(llm_status_router, prefix="/api")
app.include_router(news_router, prefix="/api")


@app.get("/api/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}
