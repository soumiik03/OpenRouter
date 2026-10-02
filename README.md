# SETU — Unified AI Gateway

SETU is a high-performance, unified AI routing gateway. It provides an OpenAI-compatible endpoint that routes requests across frontier models with credit-based billing, token metering, and sub-second fallback cascades.

---

## Architecture

| Service | Port | Description |
| :--- | :--- | :--- |
| **`apps/primary-backend`** | `3000` | Express API handling authentication (30-min sessions), API keys, and credit billing. |
| **`apps/api-backend`** | `4000` | Gateway router for `/api/v1/chat/completions` with in-memory model caching & token metering. |
| **`apps/dashboard-frontend`** | `5173` | React 19 + Tailwind CSS developer console with Light/Dark mode and zero-radius geometry. |
| **`packages/db`** | — | Shared Prisma 7 client connected to PostgreSQL (Neon). |

---

## Quickstart

### 1. Install Dependencies
```bash
bun install
```

### 2. Environment Variables
Ensure `.env` files are configured:

- **`apps/api-backend/.env`**:
  ```env
  PORT=4000
  OPENROUTER_API_KEY=your_openrouter_key
  DATABASE_URL=your_neon_postgres_url
  ```
- **`apps/primary-backend/.env`**:
  ```env
  PORT=3000
  JWT_SECRET=your_jwt_secret
  DATABASE_URL=your_neon_postgres_url
  ```

### 3. Run Development Servers
```bash
# Start all apps simultaneously
bun run dev

# Or start services individually:
cd apps/primary-backend && bun --watch src/index.ts
cd apps/api-backend && bun --watch src/index.ts
cd apps/dashboard-frontend && bun --hot src/index.ts
```

---

## API Usage

Send requests using any OpenAI-compatible client or `curl`:

```bash
curl -X POST http://localhost:4000/api/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-or-v1-YOUR_API_KEY" \
  -d '{
    "model": "liquid/lfm-2.5-2.6b:free",
    "messages": [
      { "role": "user", "content": "Explain quantum computing in one sentence." }
    ]
  }'
```

### Response Format
```json
{
  "id": "chatcmpl-1790950890877",
  "object": "chat.completion",
  "created": 1790950890,
  "model": "liquid/lfm-2.5-2.6b:free",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing uses quantum mechanics to solve complex problems exponentially faster than classical computers."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 20,
    "total_tokens": 38
  },
  "credits_used": 5,
  "remaining_credits": 3202
}
```

---

## Core Capabilities

- **Intelligent Fallback Cascade**: Circuit breaker automatically redirects stalled or rate-limited requests to responsive high-speed fallback models.
- **In-Memory Model Caching**: Eliminates database roundtrips on repeated inference calls.
- **Atomic Credit Ledger**: Deducts credits based on input/output tokens in a single transaction with live dashboard updates.
- **30-Minute Security Timeout**: Hard-expiring JWT cookies on auth endpoints with automatic redirect upon session expiry.
- **Engineered UI**: Minimalist charcoal dark mode and off-white/grey light mode with sharp rectangular edges.
