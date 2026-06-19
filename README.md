# Openmind

> Unleash Your Thoughts, Explore Every Topic.

**Live:** https://openmind.ismaelrakoto.com
**Contact:** contact@ismaelrakoto.com

A full-stack social blogging platform where users can write posts, react to content, comment, follow other authors, and explore topics via tags.

## Tech Stack

- **[Nuxt 4](https://nuxt.com)** — SSR-enabled full-stack Vue framework (Nitro server)
- **[Prisma](https://www.prisma.io)** — ORM with PostgreSQL
- **[PostgreSQL](https://www.postgresql.org)** — Relational database
- **[nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils)** — HTTP-only cookie session auth
- **[Pinia Colada](https://pinia-colada.esm.dev)** — Server state management (queries & mutations)
- **[Pinia](https://pinia.vuejs.org)** — Local UI state management
- **[EditorJS](https://editorjs.io)** — Block-based rich text editor
- **[shadcn-nuxt](https://www.shadcn-vue.com) + [reka-ui](https://reka-ui.com)** — Headless UI components
- **[Tailwind CSS v4](https://tailwindcss.com)** — Utility-first styling
- **[vee-validate](https://vee-validate.logaretm.com) + [Zod](https://zod.dev)** — Form validation
- **[nuxt-authorization](https://github.com/barbapapazes/nuxt-authorization)** — Ability-based authorization
- **[@nuxtjs/i18n](https://i18n.nuxtjs.org)** — Internationalization
- **S3-compatible storage** (SeaweedFS) — Media uploads
- **TypeScript** (strict mode)

## Features

- **Auth** — Register, login, password reset/update, email confirmation
- **Posts** — Rich text editor (paragraphs, headings, lists, images), cover images, slugged URLs
- **Feed** — Filterable by tags with pagination
- **Tags** — Attach tags to posts; filter the feed by topic; user-followed tags
- **Reactions** — React to posts and comments; view who reacted
- **Comments** — Threaded replies on posts
- **Follows** — Follow/unfollow other authors
- **Saved Posts** — Bookmark posts to read later
- **Profiles** — Public user pages (`/u/:userKey`) with posts and bio
- **Notifications** — In-app notifications for activity on your content
- **Settings** — Account settings (email, password, profile info)
- **Views** — Post view tracking
- **Social sharing** — Share posts via built-in share popover
- **SEO** — Open Graph and Twitter card meta per page and post

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- S3-compatible storage (SeaweedFS or any S3-compatible service)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                  | Description                          |
| ------------------------- | ------------------------------------ |
| `NUXT_PUBLIC_APP_URL`     | Public frontend URL                  |
| `NUXT_PUBLIC_SITE_URL`    | SEO site URL                         |
| `NUXT_PUBLIC_APP_VERSION` | App version label                    |
| `DATABASE_URL`            | PostgreSQL connection string         |
| `NUXT_SESSION_PASSWORD`   | Cookie signing secret (≥32 chars)    |
| `NUXT_OG_IMAGE_SECRET`    | Secret for OG image generation       |
| `NUXT_S3_HOST`            | S3/SeaweedFS host URL                |
| `NUXT_S3_REGION`          | S3 region                            |
| `NUXT_S3_ACCESS_KEY`      | S3 access key                        |
| `NUXT_S3_SECRET_KEY`      | S3 secret key                        |
| `NUXT_BREVO_API_KEY`      | Brevo API key (transactional emails) |

### Local Database

```bash
npm run db:reset        # Reset DB + re-apply all migrations + seed
```

## Development

```bash
npm run dev             # Start dev server at http://localhost:3001
npm run typecheck       # TypeScript type checking
npm run lint:fix        # Lint and auto-fix all files
```

## Database

```bash
# Migrations
npm run db:migrate -- --name <description>   # Create & apply a migration
npm run db:migrate:deploy                    # Apply pending migrations (CI/prod)
npm run db:reset                             # Reset DB + re-apply all migrations + seed

# Client & Studio
npm run db:generate                          # Regenerate Prisma client
npm run db:seed                              # Run seed data only
npm run db:studio                            # Open Prisma Studio
```

## Production Build

```bash
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Project Structure

```
app/
├── features/
│   ├── auth/            # Auth forms and pages
│   ├── users/           # User profiles and utilities
│   └── shared/          # Cross-feature domains
│       ├── posts/       # Posts, feed, editor
│       ├── comments/    # Threaded comments
│       ├── reactions/   # Reactions on posts and comments
│       ├── follows/     # Follow relationships
│       ├── tags/        # Tag management
│       ├── post-tags/   # Post ↔ tag relationships
│       ├── user-tags/   # User ↔ tag subscriptions
│       ├── saved-posts/ # Bookmarked posts
│       ├── notifications/ # In-app notifications
│       ├── views/       # Post view tracking
│       └── paginations/ # Shared pagination utilities
├── components/          # Global reusable UI components
├── composables/         # Global composables
├── pages/               # File-based routing
└── middleware/          # Route guards

server/
├── api/                 # Nitro route files (one file per HTTP method)
├── core/                # Infrastructure (exceptions, validation, files, IDs, loggers)
├── features/            # Domain handler + repository functions
│   └── <domain>/
│       ├── <domain>.handler.ts       # EventHandlerFn implementations
│       └── <domain>.repository.ts    # Prisma queries only
└── utils/               # prisma.ts, s3.ts, brevo.ts (Nitro auto-imports)

shared/
└── features/
    └── <domain>/
        ├── <domain>.model.ts      # Types, enums, Prisma include helpers
        ├── <domain>.schema.ts     # Zod schemas
        ├── <domain>.requests.ts   # Request type definitions
        └── <domain>.ability.ts    # Authorization rules

prisma/
├── schema.prisma          # Database schema (source of truth)
├── migrations/            # Applied migrations (managed by Prisma CLI)
└── seeds/                 # Seed data
```
