# base
# ----
FROM node:24-trixie-slim AS base

RUN npm install --global corepack

# We tried to make the Dockerfile as lean as possible. In some cases, that means we excluded a dependency your project needs.
# By far the most common is Python. If you're running into build errors because `python3` isn't available,
# add `python3 make gcc \` before the `openssl \` line below and in other stages as necessary:
RUN apt-get update && apt-get install -y \
  openssl \
  && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node package.json .
COPY --chown=node:node api/package.json api/
COPY --chown=node:node web/package.json web/
COPY --chown=node:node yarn.lock .

RUN mkdir -p /home/node/.yarn/berry/index
RUN mkdir -p /home/node/.cache

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
  --mount=type=cache,target=/home/node/.cache,uid=1000 \
  CI=1 yarn install

COPY --chown=node:node cedar.toml* redwood.toml* ./
COPY --chown=node:node graphql.config.cjs .
COPY --chown=node:node .env.defaults .env.defaults
COPY --chown=node:node api/prisma.config.cjs api/prisma.config.cjs
COPY --chown=node:node api/db api/db
COPY --chown=node:node api/src/lib/fieldDefinitions.js api/src/lib/fieldDefinitions.js
COPY --chown=node:node api/src/lib/dayjs.js api/src/lib/dayjs.js
COPY --chown=node:node api/src/config.js api/src/config.js
COPY --chown=node:node web/src/Routes.* web/src/



# api build
# ---------
FROM base AS api_build

# If your api side build relies on build-time environment variables,
# specify them here as ARGs. (But don't put secrets in your Dockerfile!)
#
# ARG MY_BUILD_TIME_ENV_VAR
COPY --chown=node:node api api
# COPY --chown=node:node cedar.toml* redwood.toml* ./

# RUN yarn cedar prisma generate
RUN yarn cedar build api

# web prerender build
# -------------------
FROM api_build AS web_build_with_prerender

ARG APP_VERSION
ARG BUILD_TIMESTAMP

COPY --chown=node:node web web
RUN yarn cedar build web

# web build
# ---------
FROM base AS web_build

ARG APP_VERSION
ARG BUILD_TIMESTAMP

COPY --chown=node:node web web
RUN yarn cedar build web --no-prerender

# api serve
# ---------
FROM node:24-trixie-slim AS api_serve

RUN npm install --global corepack

RUN apt-get update && apt-get install -y \
  openssl \
  && rm -rf /var/lib/apt/lists/*

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node package.json .
COPY --chown=node:node api/package.json api/
COPY --chown=node:node yarn.lock .

RUN mkdir -p /home/node/.yarn/berry/index
RUN mkdir -p /home/node/.cache

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
  --mount=type=cache,target=/home/node/.cache,uid=1000 \
  CI=1 yarn workspaces focus api --production

COPY --chown=node:node cedar.toml* redwood.toml* ./
COPY --chown=node:node graphql.config.cjs .
COPY --chown=node:node .env.defaults .env.defaults

COPY --chown=node:node --from=api_build /home/node/app/api/dist /home/node/app/api/dist
COPY --chown=node:node --from=api_build /home/node/app/api/db /home/node/app/api/db
COPY --chown=node:node --from=api_build /home/node/app/node_modules/.prisma /home/node/app/node_modules/.prisma

COPY --chown=node:node --from=web_build /home/node/app/web/dist /home/node/app/web/dist

ENV NODE_ENV=production

# default api serve command
# ---------
# If you are using a custom server file, you must use the following
# command to launch your server instead of the default api-server below.
# This is important if you intend to configure GraphQL to use Realtime.
#
CMD [ "./api/dist/server.js" , "serve api"]
# CMD [ "node_modules/.bin/cedarjs-server", "api" ]

# web serve
# ---------
FROM node:24-trixie-slim AS web_serve

RUN npm install --global corepack

USER node
WORKDIR /home/node/app

COPY --chown=node:node .yarnrc.yml .
COPY --chown=node:node package.json .
COPY --chown=node:node web/package.json web/
COPY --chown=node:node yarn.lock .

RUN mkdir -p /home/node/.yarn/berry/index
RUN mkdir -p /home/node/.cache

RUN --mount=type=cache,target=/home/node/.yarn/berry/cache,uid=1000 \
  --mount=type=cache,target=/home/node/.cache,uid=1000 \
  CI=1 yarn workspaces focus web --production

COPY --chown=node:node cedar.toml* redwood.toml* ./
COPY --chown=node:node graphql.config.cjs .
COPY --chown=node:node .env.defaults .env.defaults

ENV NODE_ENV=production \
  API_PROXY_TARGET=http://api:8911

# We use the shell form here for variable expansion.
CMD "node_modules/.bin/rw-web-server" "--api-proxy-target" "$API_PROXY_TARGET"


FROM caddy:latest AS caddy_serve

COPY --from=web_build /home/node/app/web/dist /var/www/html
COPY ./deployment/Caddyfile /etc/caddy/Caddyfile

# migrate
# -------
FROM api_build AS migrate

CMD ["yarn", "cedar", "prisma", "migrate", "deploy"]

# console
# -------
FROM base AS console

COPY --chown=node:node --from=api_build /home/node/app/node_modules/.prisma /home/node/app/node_modules/.prisma

# To add more packages:
#
# ```
# USER root
#
# RUN apt-get update && apt-get install -y \
#     curl
#
# USER node
# ```

COPY --chown=node:node api api
COPY --chown=node:node web web
COPY --chown=node:node scripts scripts
