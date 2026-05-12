import base64
import json
import os
from pathlib import Path

from cryptography.fernet import Fernet


KEY_FILE = Path.home() / ".truth-analyzer" / ".secret"
DB_FILE = Path.home() / ".truth-analyzer" / "keys.db"


class KeyManager:
    def __init__(self):
        self._keys: dict[str, str] = {}
        self._fernet: Fernet | None = None

    async def initialize(self):
        KEY_FILE.parent.mkdir(parents=True, exist_ok=True)
        if not KEY_FILE.exists():
            KEY_FILE.write_bytes(Fernet.generate_key())
        self._fernet = Fernet(KEY_FILE.read_bytes())
        await self._load_keys()

    async def _load_keys(self):
        import aiosqlite

        DB_FILE.parent.mkdir(parents=True, exist_ok=True)
        async with aiosqlite.connect(str(DB_FILE)) as db:
            await db.execute(
                "CREATE TABLE IF NOT EXISTS api_keys (provider TEXT PRIMARY KEY, encrypted_key TEXT)"
            )
            await db.commit()
            cursor = await db.execute("SELECT provider, encrypted_key FROM api_keys")
            rows = await cursor.fetchall()
            for provider, encrypted in rows:
                try:
                    self._keys[provider] = self._fernet.decrypt(encrypted.encode()).decode()
                except Exception:
                    pass

    async def set_key(self, provider: str, key: str) -> None:
        import aiosqlite

        if not self._fernet:
            raise RuntimeError("KeyManager not initialized")
        encrypted = self._fernet.encrypt(key.encode()).decode()
        async with aiosqlite.connect(str(DB_FILE)) as db:
            await db.execute(
                "INSERT OR REPLACE INTO api_keys (provider, encrypted_key) VALUES (?, ?)",
                (provider, encrypted),
            )
            await db.commit()
        self._keys[provider] = key

    async def get_key(self, provider: str) -> str:
        return self._keys.get(provider, "")

    async def delete_key(self, provider: str) -> None:
        import aiosqlite

        async with aiosqlite.connect(str(DB_FILE)) as db:
            await db.execute("DELETE FROM api_keys WHERE provider = ?", (provider,))
            await db.commit()
        self._keys.pop(provider, None)

    async def get_all_masked(self) -> dict[str, str]:
        result = {}
        for provider, key in self._keys.items():
            if len(key) > 7:
                result[provider] = key[:3] + "****" + key[-4:]
            else:
                result[provider] = "***"
        return result

    def get_env_keys(self) -> dict[str, str]:
        keys = {}
        if v := os.getenv("DEEPSEEK_API_KEY"):
            keys["deepseek"] = v
        if v := os.getenv("OPENAI_API_KEY"):
            keys["openai"] = v
        return keys


key_manager = KeyManager()
