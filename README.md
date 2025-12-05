# Auth App (Nest.js + React)

Тестовое задание: простое веб-приложение с аутентификацией через сессии.

- **Backend:** Nest.js + TypeScript + PostgreSQL + Prisma
- **Frontend:** React + Vite + TypeScript
- **Аутентификация:** сессионная cookie `sid` (httpOnly), хранение сессий в БД
- **Пароли:** хранятся только в захэшированном виде (bcrypt-алгоритм)

---

## 1. Требования

Для локального запуска:

- Node.js 20+
- npm / pnpm
- PostgreSQL 14+ (или использовать Docker)

Для запуска через Docker:

- Docker Desktop
- Docker Compose (`docker compose ...`)

---

## 2. Быстрый старт через Docker (backend + postgres)

В корне проекта (`auth-app/`) находится файл:

- `docker-compose.yml`

а в папке `backend/` — `Dockerfile`.

### 2.1. Запуск контейнеров

Выполните в корне:

`docker compose up --build`

## 2.2. Создание тестового пользователя в базе (через Docker)

в терминале папки auth_app выполните:

`docker exec -it auth-postgres psql -U postgres -d authdb`

и вставьте Sql

`
INSERT INTO "User" ("email", "passwordHash")
VALUES (
  'test@example.com',
  '$2b$12$ULQ/FlA/3AvqQHI27y6uf.ZUHlA6Sijb2tWOT4VvVeSDixMVZhkIC'
);
`

Этот запрос создаёт пользователя:

`
email: test@example.com
password: password123
`
Проверка, что запись появилась:
`
SELECT * FROM "User";
`

## 3.1 Запуск frontend (React + Vite) (Фронтенд не упакован в Docker — его нужно запускать локально.)

Перейдите в папку frontend:
`
cd auth-app/frontend
`
Установи зависимости:
`
npm install
`
Запустите dev-сервер:
`
npm run dev
`
Открой в браузере: 
`
http://localhost:5173/auth
`

## 4. Проверка работы приложения

### 4.1. Авторизация

На странице /auth введите:

`
email: test@example.com
password: password123
`

#### После успешного входа:

создаётся cookie sid (httpOnly),

происходит переход на /,

выполняется запрос GET /api/profile.

### 4.2. Домашняя страница (/)

На главной отображается:

приветствие,

таблица с последними логинами,

кнопка Logout.

### 4.3. Logout

Нажмите Logout → cookie удаляется → редирект на /auth.

### 4.4. Защищённые маршруты
Если открыть / без логина → frontend выполнит GET /api/profile, получит 401 → редиректит на /auth.
