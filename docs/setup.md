# Setup Guide

## 1. PostgreSQL через Neon

`Neon` — это облачный хостинг для `PostgreSQL`. Тип БД не меняется: мы все равно используем именно PostgreSQL.

Что нужно сделать вручную:

1. Зарегистрироваться в `Neon`.
2. Создать новый проект `archivarius`.
3. Скопировать строку подключения `connection string`.
4. Создать файл `server/.env` на основе `server/.env.example`.
5. Вставить туда:

```env
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_here
CLIENT_URL=http://localhost:5173
```

## 2. Установка зависимостей

Если PowerShell ругается на `npm`, используй `npm.cmd`.

```powershell
cd C:\Users\Anuk1ma\Documents\HTML\BookProject\server
npm.cmd install
npm.cmd run db:seed
npm.cmd run dev
```

Во втором терминале:

```powershell
cd C:\Users\Anuk1ma\Documents\HTML\BookProject\client
npm.cmd install
npm.cmd run dev
```

## 3. Деплой

### Frontend: Vercel

1. Залить проект в GitHub.
2. Подключить `client` как отдельный проект в `Vercel`.
3. Добавить переменную:

```env
VITE_API_URL=https://your-render-api-url.onrender.com/api
```

### Backend: Render

1. Создать новый `Web Service`.
2. Указать корень сервиса: `server`.
3. Build command:

```bash
npm install
```

4. Start command:

```bash
npm start
```

5. Добавить переменные:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_here
CLIENT_URL=https://your-vercel-domain.vercel.app
```

## 4. Что можно улучшить потом

- отдельная страница избранного
- редактирование книг в админке
- более детальная карточка заказа
- ручные тест-кейсы для презентации
