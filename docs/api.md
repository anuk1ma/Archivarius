# API Notes

## Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

## Books

- `GET /api/books`
- `GET /api/books/:id`

Параметры списка:

- `search`
- `genre`
- `sort=popular|cheap|expensive|rating`
- `limit`

## Favorites

- `GET /api/favorites`
- `POST /api/favorites`
- `DELETE /api/favorites/:bookId`

## Cart

- `GET /api/cart`
- `POST /api/cart`
- `DELETE /api/cart/:bookId`

## Orders

- `GET /api/orders`
- `POST /api/orders`
- `PATCH /api/orders/:id/cancel`

## Admin

- `GET /api/admin/books`
- `POST /api/admin/books`
- `DELETE /api/admin/books/:id`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id`
- `GET /api/admin/orders`
- `PATCH /api/admin/orders/:id`
