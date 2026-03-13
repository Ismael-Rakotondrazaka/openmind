# Openmind

> Unleash Your Thoughts, Explore Every Topic.

**Live:** https://openmind.ismaelrakoto.com
**Contact:** contact@ismaelrakoto.com

A full-stack social blogging platform where users can write posts, react to content, comment, follow other authors, and explore topics via tags.

## Tech Stack

- **[Nuxt 4](https://nuxt.com)** — SSR-enabled full-stack Vue framework
- **[Supabase](https://supabase.com)** — PostgreSQL database, auth, realtime, and storage
- **[TanStack Query](https://tanstack.com/query)** — Server state management
- **[EditorJS](https://editorjs.io)** — Block-based rich text editor
- **[shadcn-nuxt](https://www.shadcn-vue.com) + [reka-ui](https://reka-ui.com)** — Headless UI components
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first styling
- **[vee-validate](https://vee-validate.logaretm.com) + [Zod](https://zod.dev)** — Form validation
- **TypeScript** (strict mode)

## Features

- **Auth** — Register, login, password reset/update, email confirmation
- **Posts** — Rich text editor (paragraphs, headings, lists, images), cover images, slugged URLs
- **Feed** — Filterable by tags with pagination
- **Tags** — Attach tags to posts; filter the feed by topic
- **Reactions** — React to posts and comments; view who reacted
- **Comments** — Threaded replies on posts with real-time updates
- **Follows** — Follow/unfollow other authors
- **Profiles** — Public user pages (`/u/:userKey`) with posts and bio
- **Settings** — Account settings (email, password, profile info)
- **Social sharing** — Share posts via built-in share popover
- **SEO** — Open Graph and Twitter card meta per page and post

## Getting Started

### Prerequisites

- Node.js 20+
- [Supabase CLI](https://supabase.com/docs/guides/cli)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                   | Description                          |
| -------------------------- | ------------------------------------ |
| `NUXT_PUBLIC_APP_URL`      | Public frontend URL                  |
| `NUXT_PUBLIC_SITE_URL`     | SEO site URL                         |
| `NUXT_PUBLIC_SUPABASE_URL` | Supabase project URL                 |
| `NUXT_PUBLIC_SUPABASE_KEY` | Supabase publishable (anon) key      |
| `NUXT_SUPABASE_SECRET_KEY` | Supabase service role key            |
| `BREVO_API_KEY`            | Brevo API key (transactional emails) |

### Local Database

```bash
supabase start          # Start local Supabase
npm run db:reset:local  # Apply migrations and seed data
```

## Development

```bash
npm run dev             # Start dev server at http://localhost:3000
npm run typecheck       # TypeScript type checking
npm run lint:fix        # Lint and auto-fix all files
```

## Database

```bash
# Migrations
supabase migration new <description>    # Create a new migration
npm run db:reset:local                  # Reset and re-apply all migrations

# Types
npm run db:generate-types:local         # Regenerate shared/types/database.ts
npm run db:generate-types:remote        # Regenerate from remote DB

# Edge Functions
npm run functions:serve:local           # Serve edge functions locally
```

## Production Build

```bash
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Project Structure

```
app/
├── features/            # Feature-first modules
│   ├── auth/            # Auth forms, composables, pages
│   ├── users/           # User profiles and utilities
│   └── shared/          # Cross-feature domains
│       ├── posts/       # Posts, feed, editor
│       ├── comments/    # Threaded comments + realtime
│       ├── reactions/   # Reactions on posts and comments
│       ├── follows/     # Follow relationships
│       ├── tags/        # Tag management
│       └── post-tags/   # Post ↔ tag relationships
├── components/          # Global reusable UI components
├── composables/         # Global composables
├── pages/               # File-based routing
└── server/api/          # Nitro API routes (one file per HTTP method)

shared/
└── types/
    └── database.ts      # Auto-generated from Supabase schema — do not edit

supabase/
├── migrations/          # SQL migrations
├── seeds/               # Seed data
└── functions/           # Edge functions
```
