# RecruitFlow AI™ — Vercel Deployment

## 1. Upload/deploy the repository

Deploy this project root to Vercel. The `api/[...path].js` catch-all function exposes the Express API under the same Vercel domain:

- `GET /api/health`
- `POST /api/screen-candidate`

The frontend uses the same-origin `/api/*` path on Vercel, so there is no hardcoded Vercel URL.

## 2. Add environment variables

In Vercel: **Project → Settings → Environment Variables** add:

```text
GEMINI_API_KEY=your_actual_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

Set them for the environment you are deploying (Production, and Preview if you want to test previews). Do not commit `.env` or expose the API key in frontend JavaScript.

After changing environment variables, redeploy the project.

## 3. Verify the deployment

Open:

```text
https://YOUR-VERCEL-DOMAIN/api/health
```

Expected:

```json
{"status":"ok","geminiKeyConfigured":true,"model":"gemini-2.5-flash"}
```

Then run the real candidate flow and confirm the screening response contains an actual Gemini score/status/rationale.

## 4. Local development

```bash
npm install
npm start
```

Local frontend served separately (for example with VS Code Live Server) uses `http://localhost:3001` for the API. Vercel uses same-origin `/api/*`.
