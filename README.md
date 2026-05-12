# Truth Probability Analyzer · 谎言概率分析器

AI-powered linguistic deception detection combining **DeepSeek-R1 deep reasoning** with **6-category linguistic feature analysis**.

基于 **DeepSeek-R1 深度推理** 与 **6 类语言学特征分析** 的 AI 谎言检测工具。

Integrated with [NewsNow](https://github.com/ourongxing/newsnow) for real-time news aggregation and truth analysis.

融合 [NewsNow](https://github.com/ourongxing/newsnow) 实时新闻聚合，一键分析新闻真实性。

---

## Features · 功能

- **Linguistic Analysis · 语言学分析**: Detects hedging, overemphasis, distancing language, unnecessary details, avoidance patterns, and emotional manipulation / 检测模糊限定词、过度强调词、距离化语言、过度细节、回避模式和情感操控
- **Multi-Model Support · 多模型支持**: Local Ollama (DeepSeek-R1 7B), DeepSeek API, OpenAI API / 本地 Ollama + DeepSeek API + OpenAI API
- **Glassmorphism UI · 液态玻璃界面**: White + lime green theme with liquid glass design / 白 + 青提绿主题，液态玻璃质感
- **News Integration · 新闻集成**: Browse trending news from 40+ sources, analyze truth probability with one click / 浏览 40+ 新闻源，一键分析真实性
- **Encrypted Key Storage · 密钥加密存储**: API keys encrypted at rest via Fernet / API Key 本地加密存储

---

## Quick Start · 快速开始

### Prerequisites · 环境要求

- Docker Desktop（Ollama 容器已拉取 `deepseek-r1:7b`）
- Python 3.11+
- Node.js 20+（前端开发）

### One-Click Deploy · 一键部署

```bash
docker compose up -d
```

启动 4 个服务：

| 服务 | 说明 | 端口 |
|------|------|------|
| ollama | 本地大模型推理 | 11434 |
| backend | Python FastAPI 分析后端 | 8000 |
| newsnow | 新闻聚合服务 | 4444 |
| frontend | React 前端页面 | 80 → 5173 |

浏览器打开 http://localhost:5173

### Development · 开发模式

**Backend · 后端：**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

**Frontend · 前端：**
```bash
cd frontend
npm install
npm run dev
```

---

## API Endpoints · 接口

| Method | Path | Description · 说明 |
|--------|------|-------------------|
| POST | /api/analyze | Run truth-probability analysis · 执行谎言概率分析 |
| GET | /api/llm/status | Check LLM backend status · 检查模型状态 |
| GET | /api/config/keys | Get masked API keys · 获取已配置的密钥（脱敏） |
| PUT | /api/config/keys | Save API key · 保存 API 密钥 |
| DELETE | /api/config/keys/{provider} | Remove API key · 删除 API 密钥 |
| GET | /api/news/feed | Aggregated news feed · 聚合新闻流 |
| GET | /api/health | Health check · 健康检查 |

---

## Architecture · 架构

```
浏览器 (:5173) → Python FastAPI (:8000) → Ollama / DeepSeek API / OpenAI
                                       └──→ NewsNow Nitro (:4444) → 40+ 新闻源
```

---

## License · 许可证

MIT
