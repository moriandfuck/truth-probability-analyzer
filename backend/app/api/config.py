import subprocess
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.key_manager import key_manager

router = APIRouter()


class SetKeyRequest(BaseModel):
    provider: str
    key: str


@router.get("/config/keys")
async def get_keys():
    masked = await key_manager.get_all_masked()
    env_keys = key_manager.get_env_keys()
    for p in ("deepseek", "openai"):
        if p not in masked and p in env_keys:
            k = env_keys[p]
            masked[p] = k[:3] + "****" + k[-4:] if len(k) > 7 else "***"
    return {"keys": masked}


@router.put("/config/keys")
async def set_key(req: SetKeyRequest):
    if req.provider not in ("deepseek", "openai"):
        raise HTTPException(400, "provider 只支持 deepseek 或 openai")
    await key_manager.set_key(req.provider, req.key)
    return {"status": "ok", "provider": req.provider}


@router.delete("/config/keys/{provider}")
async def delete_key(provider: str):
    if provider not in ("deepseek", "openai"):
        raise HTTPException(400, "provider 只支持 deepseek 或 openai")
    await key_manager.delete_key(provider)
    return {"status": "ok", "provider": provider}
