FROM node:18-bullseye as build
RUN npm install -g pnpm
WORKDIR /build
COPY . .
RUN pnpm install
RUN pnpm --filter './packages/**' build
WORKDIR ./apps/api
RUN pnpm run build

FROM node:20.13.1-bullseye as production
# Install dependencies required to run puppeteer
RUN apt update && apt install -y  \
    libnss3 \
    libasound2 \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm-dev \
    xdg-utils
RUN npm install -g pnpm puppeteer
RUN npx puppeteer browsers install chrome

WORKDIR /out
# Monorepo root
COPY --from=build /build/package.json /out/package.json
COPY --from=build /build/pnpm-workspace.yaml /out/pnpm-workspace.yaml
# apps/api
COPY --from=build /build/apps/api/package.json /out/apps/api/package.json
COPY --from=build /build/apps/api/dist /out/apps/api/dist
# packages/db
COPY --from=build /build/packages/db/package.json /out/packages/db/package.json
COPY --from=build /build/packages/db/dist /out/packages/db/dist
# packages/permissions-enduser
COPY --from=build /build/packages/permissions-enduser/package.json /out/packages/permissions-enduser/package.json
COPY --from=build /build/packages/permissions-enduser/dist /out/packages/permissions-enduser/dist
# packages/superjson
COPY --from=build /build/packages/superjson/package.json /out/packages/superjson/package.json
COPY --from=build /build/packages/superjson/dist /out/packages/superjson/dist
# packages/validations
COPY --from=build /build/packages/validations/package.json /out/packages/validations/package.json
COPY --from=build /build/packages/validations/dist /out/packages/validations/dist
RUN pnpm install --prod
WORKDIR /out/apps/api

CMD ["node", "dist/main.js"]
