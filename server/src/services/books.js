import { pool } from "../db/pool.js";

export async function fetchBooks({ search = "", genre = "", sort = "popular", limit }) {
  const conditions = [];
  const values = [];

  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    conditions.push(
      `(
        LOWER(title) LIKE $${values.length}
        OR LOWER(COALESCE(title_en, '')) LIKE $${values.length}
        OR LOWER(author) LIKE $${values.length}
        OR LOWER(COALESCE(author_en, '')) LIKE $${values.length}
        OR LOWER(genre) LIKE $${values.length}
        OR LOWER(COALESCE(genre_en, '')) LIKE $${values.length}
      )`
    );
  }

  if (genre) {
    values.push(genre);
    conditions.push(`(genre = $${values.length} OR genre_en = $${values.length})`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const orderBy =
    sort === "cheap"
      ? "price_kzt ASC"
      : sort === "expensive"
        ? "price_kzt DESC"
        : sort === "rating"
          ? "rating DESC"
          : "popularity DESC";

  const limitSql = limit ? `LIMIT ${Number(limit)}` : "";
  const result = await pool.query(`SELECT * FROM books ${where} ORDER BY ${orderBy} ${limitSql}`, values);
  return result.rows;
}

export async function fetchCartItems(userId) {
  const result = await pool.query(
    `
      SELECT
        cart_items.book_id,
        cart_items.quantity,
        books.title,
        books.title_en,
        books.author,
        books.author_en,
        books.cover_url,
        books.price_kzt
      FROM cart_items
      JOIN books ON books.id = cart_items.book_id
      WHERE cart_items.user_id = $1
      ORDER BY cart_items.id DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function fetchOrdersForUser(userId) {
  const result = await pool.query(
    `
      SELECT id, status, delivery_city, delivery_address, payment_method, card_last4, total_price, created_at
      FROM orders
      WHERE user_id = $1
      ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}
