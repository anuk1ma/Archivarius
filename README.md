# Архивариус

Full-stack курсовой проект на тему разработки системы поиска и заказа книг в библиотеке. В реализации проект оформлен как атмосферный онлайн-маркет мировой классики с каталогом, избранным, корзиной, заказами, авторизацией и админ-панелью.

## Стек

- Frontend: React, Vite, React Router, CSS
- Backend: Node.js, Express, JWT, bcrypt
- Database: PostgreSQL
- Deploy: Vercel + Render + Neon

## Структура проекта

- `client` — фронтенд на React
- `server` — API и работа с PostgreSQL
- `docs` — инструкции и материалы для сдачи

## Быстрый запуск локально

1. Установить зависимости:
   - `cd client && npm install`
   - `cd server && npm install`
2. Скопировать `server/.env.example` в `server/.env`.
3. Указать рабочий `DATABASE_URL` и `JWT_SECRET`.
4. Выполнить инициализацию БД:
   - `cd server`
   - `npm run db:seed`
5. Запустить сервер:
   - `npm run dev`
6. В отдельном терминале запустить клиент:
   - `cd client`
   - `npm run dev`

## Что уже реализовано

- Каталог книг с поиском, фильтрами и сортировкой
- Карточка книги
- Регистрация и вход
- Профиль с избранным и историей заказов
- Корзина и оформление условного заказа
- Админ-панель с базовым управлением книгами, пользователями и заказами
- 404 и страница контактов
- Двуязычный интерфейс RU/EN

## Дефолтный администратор после сида

- Email: `admin@archivarius.local`
- Password: `admin12345`

## Важно

Для ручных шагов по `Neon`, деплою и переменным окружения смотри:

- [setup.md](/C:/Users/Anuk1ma/Documents/HTML/BookProject/docs/setup.md)
- [api.md](/C:/Users/Anuk1ma/Documents/HTML/BookProject/docs/api.md)
- [database.md](/C:/Users/Anuk1ma/Documents/HTML/BookProject/docs/database.md)
- [deploy.md](/C:/Users/Anuk1ma/Documents/HTML/BookProject/docs/deploy.md)
- [report-notes.md](/C:/Users/Anuk1ma/Documents/HTML/BookProject/docs/report-notes.md)
