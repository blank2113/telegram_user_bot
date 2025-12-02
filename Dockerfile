# Stage 1: Build
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22-alpine
WORKDIR /app

# Устанавливаем serve для отдачи статики
RUN npm install -g serve

# Копируем билд
COPY --from=build /app/dist ./dist

# Expose порт для внутреннего Docker-сети (Nginx может проксировать сюда)
EXPOSE 4000

# Запускаем сервер отдачи статики
CMD ["serve", "-s", "dist", "-l", "80"]
