# Render environment variables (Web Service → Environment)

Set these in the Render dashboard for **hiresmart-9x5i**:

| Key | Value |
|---|---|
| `COGNODB_URI` | `bolt+s://db-c363edce.databases.cognodb.com` |
| `COGNODB_USERNAME` | `cognodb` |
| `COGNODB_PASSWORD` | *(your CognoDB password — never commit this)* |
| `CLIENT_URL` | `https://hire-smart-sigma.vercel.app` |
| `NODE_ENV` | `production` |

**Render service settings:**

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install` |
| Start Command | `npm start` |

After first deploy, seed the database once from your machine:

```bash
# .env must contain the same CognoDB credentials
npm run seed
```

**Verify:**

```bash
curl https://hiresmart-9x5i.onrender.com/api/health
curl https://hire-smart-sigma.vercel.app/api/health
```

Both should return `"database": "connected"`.

# Vercel (frontend)

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

`frontend/vercel.json` proxies `/api/*` → Render, so the browser never hits CORS.

No Vercel environment variables required for the API.
