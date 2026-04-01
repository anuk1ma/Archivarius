# Deploy Guide

## Будет ли сайт работать как обычная ссылка?

Да. После деплоя сайт будет открываться обычным URL вида:

- `https://archivarius.vercel.app`

Это уже не `localhost`.

## Что куда деплоить

- `client` -> `Vercel`
- `server` -> `Render`
- PostgreSQL -> `Neon`

## 1. Deploy frontend on Vercel

1. Залить проект в GitHub.
2. В `Vercel` импортировать репозиторий.
3. В качестве Root Directory указать `client`.
4. Добавить переменную окружения:

```env
VITE_API_URL=https://your-render-service.onrender.com/api
```

5. Деплойнуть проект.

Файл [vercel.json](/C:/Users/Anuk1ma/Documents/HTML/BookProject/client/vercel.json) уже добавлен, чтобы маршруты React Router работали даже после обновления страницы.

## 2. Deploy backend on Render

1. Создать в `Render` новый `Web Service`.
2. Подключить тот же репозиторий.
3. Root Directory: `server`
4. Build Command:

```bash
npm install
```

5. Start Command:

```bash
npm start
```

6. Добавить переменные:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_here
CLIENT_URL=https://your-vercel-domain.vercel.app
PORT=5000
```

## 3. Что проверить после деплоя

- открывается главная страница
- работает каталог
- работает регистрация и вход
- админка открывается у администратора
- запросы уходят не на `localhost`, а на URL Render
