# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

ARG NUXT_SITE_URL
ARG NUXT_PUBLIC_SITE_URL
ARG NUXT_PUBLIC_APP_VERSION
ENV NUXT_SITE_URL=$NUXT_SITE_URL
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_APP_VERSION=$NUXT_PUBLIC_APP_VERSION

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

ARG APP_VERSION
ENV APP_VERSION=$APP_VERSION
ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

WORKDIR /app

COPY --from=builder /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
