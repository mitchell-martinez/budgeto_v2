FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN rm package-lock.json && npm install

FROM node:22-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN rm package-lock.json && npm install --omit=dev

FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
