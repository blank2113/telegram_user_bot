# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Отдача через Caddy (без Nginx)
FROM caddy:2-alpine
COPY --from=build /app/dist /srv
EXPOSE 80
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
