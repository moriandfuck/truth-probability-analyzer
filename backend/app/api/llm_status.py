import subprocess
import httpx
import os
from fastapi import APIRouter

router = APIRouter()


@router.get("/llm/status")
async def llm_status():
    host = os.getenv("OLLAMA_HOST", "localhost")
    port = os.getenv("OLLAMA_PORT", "11434")

    ollama_available = False
    models = []
    docker_running = False

    # Check Docker
    try:
        result = subprocess.run(["docker", "ps"], capture_output=True, text=True, timeout=5)
        docker_running = result.returncode == 0
    except Exception:
        pass

    # Check Ollama
    async with httpx.AsyncClient(timeout=5.0) as client:
        try:
            resp = await client.get(f"http://{host}:{port}/api/tags")
            if resp.status_code == 200:
                ollama_available = True
                models = [m["name"] for m in resp.json().get("models", [])]
        except Exception:
            pass

    return {
        "ollama": {
            "available": ollama_available,
            "models": models,
            "docker_running": docker_running,
        },
        "deepseek_api": {
            "configured": bool(os.getenv("DEEPSEEK_API_KEY")),
        },
        "openai_api": {
            "configured": bool(os.getenv("OPENAI_API_KEY")),
        },
    }
