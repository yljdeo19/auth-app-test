FROM node:20

WORKDIR /app

# Устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Генерация Prisma Client и сборка Nest.js
RUN npx prisma generate
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# При старте контейнера прогоняем миграции и запускаем сервер
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
