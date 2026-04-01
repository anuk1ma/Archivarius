# Database Structure

## Где находится структура БД

Главная SQL-схема проекта хранится здесь:

- [schema.sql](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/db/schema.sql)

Именно в этом файле описаны все таблицы, поля, связи и ограничения.

## Где лежит подключение к БД

Настройки подключения берутся из файла:

- [server/.env](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/.env)

Ключевая переменная:

- `DATABASE_URL`

## Где создаются таблицы

При запуске команды:

```powershell
cd C:\Users\Anuk1ma\Documents\HTML\BookProject\server
npm.cmd run db:seed
```

запускается файл:

- [seed.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/db/seed.js)

Он делает две вещи:

1. Читает SQL из `schema.sql`
2. Создает таблицы и заполняет их стартовыми данными

## Какие таблицы есть сейчас

### `users`

Пользователи системы.

Поля:

- `id`
- `name`
- `email`
- `password_hash`
- `role`
- `created_at`

### `books`

Каталог книг.

Поля:

- `id`
- `title`
- `author`
- `genre`
- `description`
- `publish_year`
- `publisher`
- `book_language`
- `rating`
- `price_kzt`
- `cover_url`
- `popularity`
- `created_at`

### `favorites`

Избранные книги пользователя.

Поля:

- `id`
- `user_id`
- `book_id`

### `cart_items`

Корзина пользователя.

Поля:

- `id`
- `user_id`
- `book_id`
- `quantity`

### `orders`

Заказы пользователя.

Поля:

- `id`
- `user_id`
- `status`
- `total_price`
- `created_at`

### `order_items`

Состав каждого заказа.

Поля:

- `id`
- `order_id`
- `book_id`
- `quantity`
- `price_kzt`

## Где лежат стартовые книги

Стартовые книги для каталога лежат в:

- [seedBooks.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/data/seedBooks.js)

## Где в коде используются таблицы

Основные API-маршруты:

- [authRoutes.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/routes/authRoutes.js)
- [bookRoutes.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/routes/bookRoutes.js)
- [favoriteRoutes.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/routes/favoriteRoutes.js)
- [cartRoutes.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/routes/cartRoutes.js)
- [orderRoutes.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/routes/orderRoutes.js)
- [adminRoutes.js](/C:/Users/Anuk1ma/Documents/HTML/BookProject/server/src/routes/adminRoutes.js)

## Что физически хранит данные

Сами данные таблиц хранятся не в файлах проекта, а в твоей удаленной PostgreSQL-базе в Neon.

То есть:

- структура таблиц описана в проекте в `schema.sql`
- реальные данные находятся в Neon PostgreSQL
