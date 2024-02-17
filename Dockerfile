FROM node:18-alpine AS base

ENV DIR /project

WORKDIR $DIR

# ----
FROM base AS production

ENV NODE_ENV=production

COPY . $DIR
RUN npm ci

EXPOSE 3000
CMD ["node", "index.js"]

# ----
FROM base AS dev

ENV NODE_ENV=development

EXPOSE 3000
CMD ["npm", "run","start:dev"]

# ----

