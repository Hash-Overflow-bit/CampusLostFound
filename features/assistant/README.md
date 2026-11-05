# Campus Assistant

Campus Assistant answers app questions and suggests possible matches from the 48 most recent active public reports in the signed-in student's verified campus. It supports English, Roman Urdu and Urdu. It guides students to browse or report items; it cannot create, edit, delete, claim or message on their behalf.

## Free-tier setup

1. Create a key at https://aistudio.google.com/apikey using a Google project on the **Free** tier, without billing enabled. Google may require project verification. An API key is required even on the free tier.
2. In this project's Vercel environment variables, add `GEMINI_API_KEY` as a Secret for Preview and Production. Never use a `VITE_` prefix. Do not paste the key in chat or commit it.
3. The default is `gemini-3.8-flash`; `gemini-3.5-flash-lite` is the single alternate for quota/unavailability errors before streaming begins. Both are documented as free-tier eligible. Optional overrides are `GEMINI_MODEL` and `GEMINI_FALLBACK_MODEL`, restricted to these two IDs. Set both to the same ID to use only one model.
4. Redeploy the `redesign/v2` branch after adding the key. In a verified campus account, test an app-help question, a lost-item question, and an Urdu follow-up.

Free eligibility is a property of the Google project's billing tier, not an API request flag. These same models can incur charges with a billing-enabled project. This integration never calls AI Gateway, never purchases credits, and never switches keys or upgrades plans. On free-quota exhaustion it returns a retry delay, not a paid fallback. Free-tier limits can change and may be small; no unlimited availability is promised.

Google's free tier may use prompts and responses to improve its products. The chat explains this before use. Only user messages, short conversation history and redacted public report fields are sent; private report tables, contacts, ownership evidence, user IDs and authentication tokens are excluded. Students should not type sensitive details. Chat history stays in component memory and resets when the user or campus changes.

References: https://ai.google.dev/gemini-api/docs/pricing and https://ai.google.dev/gemini-api/docs/api-key

## Local development and checks

Copy `.env.example` to `.env.local`, fill in the existing Supabase public configuration and the server-only Gemini key, then run `npm install` and `npm run dev`. The Vite development middleware serves the same `/api/chat` handler as Vercel. `vite preview` serves static build output only; test the API using the dev server or a Vercel deployment.

Run `npm run test:assistant` and `npm run build`. Tests use mocked Google and Supabase responses and make no billable AI calls. They cover auth/campus boundaries, privacy, model restrictions, quota fallback, stream completion/errors, cancellation, multilingual matching and follow-ups. A real Google reply still requires the configured key and a verified campus login.

The API validates bearer sessions against Supabase, checks email confirmation and campus membership, and queries public items with the student's JWT so RLS remains active. It uses a 25-second request timeout and a best-effort limit of 10 questions per user per minute in each server instance. This is not a shared fleet-wide limiter; Google's project quota remains the upstream limit. The model prompt never treats a possible match as proof of ownership.
