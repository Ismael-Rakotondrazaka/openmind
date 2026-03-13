# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

ARG NUXT_PUBLIC_APP_URL
ARG NUXT_PUBLIC_APP_VERSION
ARG NUXT_PUBLIC_SITE_URL
ARG NUXT_PUBLIC_SUPABASE_URL
ARG NUXT_PUBLIC_SUPABASE_KEY

ENV NUXT_PUBLIC_APP_URL=$NUXT_PUBLIC_APP_URL
ENV NUXT_PUBLIC_APP_VERSION=$NUXT_PUBLIC_APP_VERSION
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_KEY=$NUXT_PUBLIC_SUPABASE_KEY

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

ENV NODE_ENV=production
# @link https://nuxt.com/docs/getting-started/deployment#entry-point
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
