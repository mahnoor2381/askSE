# AskSE – Department Help Desk Chatbot

**Competition:** CodeQuest 2026 · Vibe Jam – AI Sprint
**Entry ID:** `YOUR-ENTRY-ID`  **Team:** `Your Team Name`
**Members:** Member One, Member Two

AskSE answers student questions **only** from the department FAQ knowledge base, cites the FAQ IDs it used (e.g. `[FAQ-03]`), says clearly when it does not know, replies in English or Roman Urdu, and lets the office add new FAQs that the bot uses immediately.

## How to run
```bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
# open .env and paste your API key, then:
npm run dev
```
Open the URL shown in the terminal (http://localhost:5173). **Restart `npm run dev` after any change to `.env`.**

## API and model
- LLM API: Google Gemini (`generateContent`, JSON output mode) – default model `gemini-2.5-flash`.
- Also works with any OpenAI-compatible API (Groq, OpenAI) via `VITE_LLM_PROVIDER=openai` in `.env`.
- The key lives only in `.env` (listed in `.gitignore`). To test failure handling, set `VITE_LLM_API_KEY=INVALID-KEY-123` and restart.

## Tools used to build it
Claude (code generation and debugging) – edit in `src/config.js` if you used others.

## Where things are
| File | Purpose |
|---|---|
| `src/llm.js` | **The app's AI prompt**, API call, 30 s timeout, JSON parsing, ID verification, injection guard |
| `src/Chat.jsx` | Chat screen, 1–300 validation, typing indicator, history, clear chat, feedback buttons |
| `src/FaqList.jsx` | FAQ list in ID order, search, category filter, **Reset to starter data** |
| `src/Admin.jsx` | PIN screen and Add-FAQ form with per-field validation, auto IDs |
| `src/Stats.jsx`, `src/About.jsx` | Stats and About screens |
| `src/config.js` | Team details, PIN, categories, exact messages |
| `src/faqs.js` | The 8 starter FAQs |

## Features
Must-haves M1–M9, plus level-ups: Stats screen, Helpful / Not helpful buttons, suggested-question chips, Urdu-script reply switch, dark mode.

## How grounding and safety work
1. All FAQs and the question are sent to the model, which must return `{"found", "answer", "ids"}`.
2. Code checks every returned ID exists. `found: true` with an empty or unknown ID list becomes "not found".
3. Prompt-injection: rules in the system prompt plus a code-side filter; such requests get the not-found reply.
4. AI failure (offline, bad key, 30 s timeout): "AI service unavailable…" – typed text and chat stay intact.
