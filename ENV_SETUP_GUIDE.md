# 🔐 Environment Variables Setup Guide

Complete guide to obtaining every API key and secret required to run **InstaFlow AI**.

---

## Table of Contents

- [Quick Overview](#quick-overview)
- [1. Database (PostgreSQL)](#1-database-postgresql)
- [2. Authentication (NextAuth)](#2-authentication-nextauth)
- [3. Google OAuth](#3-google-oauth)
- [4. GitHub OAuth](#4-github-oauth)
- [5. Google Gemini API](#5-google-gemini-api)
- [6. OpenAI API (Optional Fallback)](#6-openai-api-optional-fallback)
- [7. Cloudinary](#7-cloudinary)
- [8. Instagram Graph API](#8-instagram-graph-api)
- [9. Cron Secret](#9-cron-secret)
- [10. App URL](#10-app-url)

---

## Quick Overview

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Auth
NEXTAUTH_SECRET=<random-32-char-string>

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# OAuth Providers
AUTH_GOOGLE_ID=<google-client-id>
AUTH_GOOGLE_SECRET=<google-client-secret>
AUTH_GITHUB_ID=<github-client-id>
AUTH_GITHUB_SECRET=<github-client-secret>

# AI
GEMINI_API_KEY=<gemini-api-key>
OPENAI_API_KEY=<openai-api-key>          # Optional

# Storage
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>

# Instagram
INSTAGRAM_APP_ID=<meta-app-id>
INSTAGRAM_APP_SECRET=<meta-app-secret>

# Background Jobs
CRON_SECRET=<random-secret>
```

---

## 1. Database (PostgreSQL)

**Variable:** `DATABASE_URL`

**Format:**
```
postgresql://USERNAME:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Option A: Local with Docker (Recommended for Dev)

Just run the included docker-compose:
```bash
docker-compose up db -d
```
Your `DATABASE_URL` will be:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/instaflow?schema=public
```

### Option B: Hosted Providers (Production)

| Provider | Free Tier | Link |
|----------|-----------|------|
| **Neon** | 0.5 GB free | [neon.tech](https://neon.tech) |
| **Supabase** | 500 MB free | [supabase.com](https://supabase.com) |
| **Railway** | $5 credit | [railway.app](https://railway.app) |
| **Render** | 1 GB free | [render.com](https://render.com) |
| **Aiven** | Free plan | [aiven.io](https://aiven.io) |

**Steps (example with Neon):**
1. Go to [neon.tech](https://neon.tech) → Sign up
2. Click **"New Project"** → Name it `instaflow`
3. Copy the connection string from the dashboard
4. Paste it as `DATABASE_URL`

After setting it, run:
```bash
npx prisma migrate dev --name init
```

---

## 2. Authentication (NextAuth)

**Variable:** `NEXTAUTH_SECRET`

This is a random secret used to encrypt session tokens. **Never share it.**

### How to Generate

**Option 1 — OpenSSL (Linux/Mac):**
```bash
openssl rand -base64 32
```

**Option 2 — Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3 — PowerShell (Windows):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }) -as [byte[]])
```

**Option 4 — Online:**
Visit [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

Copy the output and paste it as your `NEXTAUTH_SECRET`.

---

## 3. Google OAuth

**Variables:** `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`

These let users sign in with their Google account.

### Step-by-Step

1. **Go to** [Google Cloud Console](https://console.cloud.google.com/)
2. **Create a new project** (or select an existing one)
   - Click the project dropdown → **"New Project"** → Name it `InstaFlow AI`
3. **Enable the Google+ API:**
   - Go to **APIs & Services** → **Library**
   - Search **"Google+ API"** → Click **Enable**
4. **Create OAuth Credentials:**
   - Go to **APIs & Services** → **Credentials**
   - Click **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
   - If prompted, configure the **OAuth consent screen** first:
     - User type: **External**
     - App name: `InstaFlow AI`
     - Support email: your email
     - Authorized domains: `localhost` (for dev)
     - Click **Save and Continue** through all steps
5. **Create the OAuth Client:**
   - Application type: **Web application**
   - Name: `InstaFlow AI`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
   - Click **Create**
6. **Copy the values:**
   - `Client ID` → `AUTH_GOOGLE_ID`
   - `Client Secret` → `AUTH_GOOGLE_SECRET`

> ⚠️ For production, add your real domain to the authorized origins and redirect URIs.

---

## 4. GitHub OAuth

**Variables:** `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`

These let users sign in with their GitHub account.

### Step-by-Step

1. **Go to** [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"OAuth Apps"** → **"New OAuth App"**
3. Fill in:
   | Field | Value |
   |-------|-------|
   | Application name | `InstaFlow AI` |
   | Homepage URL | `http://localhost:3000` |
   | Authorization callback URL | `http://localhost:3000/api/auth/callback/github` |
4. Click **"Register application"**
5. On the app page:
   - `Client ID` → `AUTH_GITHUB_ID`
   - Click **"Generate a new client secret"**
   - `Client Secret` → `AUTH_GITHUB_SECRET`

> ⚠️ The client secret is shown only once — save it immediately.

---

## 5. Google Gemini API

**Variable:** `GEMINI_API_KEY`

This powers all AI features — captions, hashtags, carousel content, music, and the AI agent.

### Step-by-Step

1. **Go to** [Google AI Studio](https://aistudio.google.com/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Select your Google Cloud project (or create one)
5. Copy the generated key → `GEMINI_API_KEY`

**Free tier:** 60 requests/minute, 1500 requests/day (Gemini 2.5 Flash)

> 💡 You can test your key:
> ```bash
> curl "https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY"
> ```

---

## 6. OpenAI API (Optional Fallback)

**Variable:** `OPENAI_API_KEY`

Optional fallback if Gemini is unavailable. Used for caption/hashtag generation.

### Step-by-Step

1. **Go to** [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click **"Create new secret key"**
4. Name it `InstaFlow AI`
5. Copy the key → `OPENAI_API_KEY`

**Pricing:** Pay-as-you-go. GPT-4o-mini is ~$0.15/1M input tokens.

> ⚠️ This is **optional**. The app works with just `GEMINI_API_KEY`.

---

## 7. Cloudinary

**Variables:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

Cloudinary stores all AI-generated images and serves them to Instagram.

### Step-by-Step

1. **Go to** [Cloudinary](https://cloudinary.com/) → **Sign up free**
2. After sign-up, you'll land on the **Dashboard**
3. Under **"Product Environment Credentials"**, you'll see:

   | Dashboard Label | Env Variable |
   |----------------|-------------|
   | Cloud Name | `CLOUDINARY_CLOUD_NAME` |
   | API Key | `CLOUDINARY_API_KEY` |
   | API Secret (click to reveal) | `CLOUDINARY_API_SECRET` |

4. Copy all three values

**Free tier:** 25 monthly credits (~25,000 transformations or 25 GB storage)

> 💡 Optionally, create an **upload preset** named `instaflow` in:
> **Settings → Upload → Upload presets → Add upload preset**
> Set it to **Unsigned** for development.

---

## 8. Instagram Graph API

**Variables:** `INSTAGRAM_APP_ID`, `INSTAGRAM_APP_SECRET`

Required for publishing posts directly to Instagram.

### Prerequisites
- An **Instagram Business** or **Creator** account
- A **Facebook Page** linked to that Instagram account

### Step-by-Step

1. **Go to** [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Select:
   - App type: **Business**
   - App name: `InstaFlow AI`
   - Click **Create App**
4. In your app dashboard, go to **"App Settings"** → **"Basic"**:
   - `App ID` → `INSTAGRAM_APP_ID`
   - `App Secret` (click Show) → `INSTAGRAM_APP_SECRET`
5. **Add Instagram Product:**
   - In the left sidebar, click **"Add Product"**
   - Find **"Instagram"** → Click **"Set Up"**
   - Choose **"Instagram Graph API"**
6. **Configure OAuth:**
   - Go to **Instagram → Basic Display** (or Instagram Graph API settings)
   - Add OAuth Redirect URI:
     ```
     https://your-domain.com/api/integrations/instagram/callback
     ```
   - For local dev:
     ```
     https://localhost:3000/api/integrations/instagram/callback
     ```
7. **Required Permissions** (request in App Review for production):
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_insights`
   - `pages_show_list`
   - `pages_read_engagement`

> ⚠️ **Important Notes:**
> - Instagram Graph API requires **HTTPS** — use `ngrok` for local testing
> - You need **App Review** from Meta before going live with real users
> - During development, you can add yourself as a test user

### Testing Locally with ngrok

```bash
# Install ngrok
npm install -g ngrok

# Start tunnel
ngrok http 3000

# Use the https URL as your redirect URI
# Example: https://abc123.ngrok.io/api/integrations/instagram/callback
```

---

## 9. Cron Secret

**Variable:** `CRON_SECRET`

A secret token that authenticates GitHub Actions cron requests to your API endpoints. Prevents unauthorized access.

### How to Generate

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or just create any strong random string.

### GitHub Actions Setup

After generating, add it to your GitHub repository:

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add these secrets:

   | Secret Name | Value |
   |------------|-------|
   | `CRON_SECRET` | Your generated secret |
   | `APP_URL` | Your deployed app URL (e.g., `https://instaflow.vercel.app`) |

---

## 10. App URL

**Variable:** `NEXT_PUBLIC_APP_URL`

The base URL of your application.

| Environment | Value |
|-------------|-------|
| Development | `http://localhost:3000` |
| Production (Vercel) | `https://your-app.vercel.app` |
| Production (Custom) | `https://your-domain.com` |

---

## Complete `.env.local` Example

```env
# ── App ──────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ── Auth ─────────────────────────────────────────────
NEXTAUTH_SECRET=your-generated-secret-here

# ── Database ─────────────────────────────────────────
DATABASE_URL=postgresql://postgres:password@localhost:5432/instaflow?schema=public

# ── Google OAuth ─────────────────────────────────────
AUTH_GOOGLE_ID=123456789.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=GOCSPX-xxxxxxxxxxxx

# ── GitHub OAuth ─────────────────────────────────────
AUTH_GITHUB_ID=Iv1.xxxxxxxxxxxx
AUTH_GITHUB_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── AI Services ──────────────────────────────────────
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxx        # Optional

# ── Cloudinary ───────────────────────────────────────
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Instagram Graph API ──────────────────────────────
INSTAGRAM_APP_ID=123456789012345
INSTAGRAM_APP_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ── Background Jobs ──────────────────────────────────
CRON_SECRET=your-cron-secret-here
```

---

## Checklist

Use this checklist to track which variables you've configured:

- [ ] `NEXT_PUBLIC_APP_URL`
- [ ] `NEXTAUTH_SECRET`
- [ ] `DATABASE_URL`
- [ ] `AUTH_GOOGLE_ID` + `AUTH_GOOGLE_SECRET`
- [ ] `AUTH_GITHUB_ID` + `AUTH_GITHUB_SECRET`
- [ ] `GEMINI_API_KEY`
- [ ] `OPENAI_API_KEY` *(optional)*
- [ ] `CLOUDINARY_CLOUD_NAME` + `CLOUDINARY_API_KEY` + `CLOUDINARY_API_SECRET`
- [ ] `INSTAGRAM_APP_ID` + `INSTAGRAM_APP_SECRET`
- [ ] `CRON_SECRET`

> 💡 **Minimum to run locally:** You need `DATABASE_URL`, `NEXTAUTH_SECRET`, `GEMINI_API_KEY`, and at least one OAuth provider (`AUTH_GOOGLE_*` or `AUTH_GITHUB_*`). Everything else can be configured later.
