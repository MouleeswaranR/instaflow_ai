# InstaFlow AI 🚀

> AI-Powered Instagram Automation SaaS — Transform your ideas into stunning Instagram posts with one click.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)

## Features

- **🤖 AI Caption Generator** — 5 caption styles (short, professional, viral, story, LinkedIn)
- **# Smart Hashtags** — Trending, niche, and mixed hashtag sets
- **🎨 AI Image Generator** — 7 themes, multiple templates, Instagram-ready sizes
- **📱 Carousel Generator** — Auto-generate 5-slide educational carousels
- **🎵 Music Recommendations** — AI-curated music for your post category
- **📱 Post Preview** — Phone mockup with live preview
- **📤 One-Click Publish** — Publish directly to Instagram via Graph API
- **📅 Smart Scheduling** — Daily, weekly, monthly with timezone support
- **📊 Analytics Dashboard** — Likes, comments, reach, impressions, saves, shares
- **💻 LeetCode Integration** — Auto-post coding achievements
- **🐙 GitHub Integration** — Turn commits, PRs, releases into posts
- **🤖 AI Agent** — Personal AI social media manager

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | Tailwind CSS v4 + ShadCN UI |
| Auth | Auth.js v5 (Google, GitHub) |
| Database | PostgreSQL + Prisma ORM |
| AI | Gemini API + OpenAI (fallback) |
| Storage | Cloudinary |
| Instagram | Instagram Graph API |
| Background Jobs | GitHub Actions (cron) |
| State | Zustand |
| Charts | Recharts |
| Deployment | Docker |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL (local or hosted)
- Gemini API key
- Cloudinary account

### Setup

```bash
# Clone
git clone <repo-url>
cd insta

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your values

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### Docker (Recommended for production)

```bash
# Start all services
docker-compose up -d

# Run migrations
npx prisma migrate deploy
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | Auth.js secret (generate with `openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID/SECRET` | Google OAuth credentials |
| `AUTH_GITHUB_ID/SECRET` | GitHub OAuth credentials |
| `GEMINI_API_KEY` | Google Gemini API key |
| `CLOUDINARY_*` | Cloudinary credentials |
| `INSTAGRAM_APP_ID/SECRET` | Meta app for Instagram Graph API |
| `CRON_SECRET` | Secret for GitHub Actions cron endpoints |

## GitHub Actions Cron Jobs

| Workflow | Schedule | Description |
|----------|----------|-------------|
| `scheduled-posts.yml` | Every 15 min | Publishes due scheduled posts |
| `leetcode-sync.yml` | Every 6 hours | Syncs LeetCode stats |
| `github-sync.yml` | Every 6 hours | Syncs GitHub activity |
| `analytics-sync.yml` | Daily | Fetches Instagram analytics |

Add `APP_URL` and `CRON_SECRET` to your repository secrets.

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/          # Login/register pages
│   ├── (dashboard)/     # Dashboard pages
│   └── api/             # API routes
├── components/          # React components
│   ├── ui/              # ShadCN UI components
│   └── create/          # Post creation components
├── lib/                 # Client configurations
├── services/            # Business logic
├── store/               # Zustand stores
└── types/               # TypeScript types
```

## License

MIT
