import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth, requireAdmin);

router.get("/books", async (_request, response, next) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id DESC");
    response.json({ books: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/books", async (request, response, next) => {
  try {
    const {
      title,
      titleEn,
      author,
      authorEn,
      genre,
      genreEn,
      description,
      descriptionEn,
      publishYear,
      publisher,
      publisherEn,
      language,
      languageEn,
      rating,
      priceKzt,
      coverUrl,
      popularity
    } = request.body;

    await pool.query(
      `
        INSERT INTO books (
          title, title_en, author, author_en, genre, genre_en, description, description_en, publish_year,
          publisher, publisher_en, book_language, book_language_en, rating, price_kzt, cover_url, popularity
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      `,
      [
        title,
        titleEn,
        author,
        authorEn,
        genre,
        genreEn,
        description,
        descriptionEn,
        publishYear,
        publisher,
        publisherEn,
        language,
        languageEn,
        rating,
        priceKzt,
        coverUrl,
        popularity
      ]
    );

    response.status(201).json({ message: "Книга создана." });
  } catch (error) {
    next(error);
  }
});

router.put("/books/:id", async (request, response, next) => {
  try {
    const {
      title,
      titleEn,
      author,
      authorEn,
      genre,
      genreEn,
      description,
      descriptionEn,
      publishYear,
      publisher,
      publisherEn,
      language,
      languageEn,
      rating,
      priceKzt,
      coverUrl,
      popularity
    } = request.body;

    await pool.query(
      `
        UPDATE books
        SET
          title = $1,
          title_en = $2,
          author = $3,
          author_en = $4,
          genre = $5,
          genre_en = $6,
          description = $7,
          description_en = $8,
          publish_year = $9,
          publisher = $10,
          publisher_en = $11,
          book_language = $12,
          book_language_en = $13,
          rating = $14,
          price_kzt = $15,
          cover_url = $16,
          popularity = $17
        WHERE id = $18
      `,
      [
        title,
        titleEn,
        author,
        authorEn,
        genre,
        genreEn,
        description,
        descriptionEn,
        publishYear,
        publisher,
        publisherEn,
        language,
        languageEn,
        rating,
        priceKzt,
        coverUrl,
        popularity,
        request.params.id
      ]
    );

    response.json({ message: "Книга обновлена." });
  } catch (error) {
    next(error);
  }
});

router.delete("/books/:id", async (request, response, next) => {
  try {
    await pool.query("DELETE FROM books WHERE id = $1", [request.params.id]);
    response.json({ message: "Книга удалена." });
  } catch (error) {
    next(error);
  }
});

router.get("/users", async (_request, response, next) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, created_at FROM users ORDER BY id DESC");
    response.json({ users: result.rows });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id", async (request, response, next) => {
  try {
    await pool.query("UPDATE users SET role = $1 WHERE id = $2", [request.body.role, request.params.id]);
    response.json({ message: "Роль обновлена." });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (request, response, next) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1 AND role <> 'admin'", [request.params.id]);
    response.json({ message: "Пользователь удален." });
  } catch (error) {
    next(error);
  }
});

router.get("/orders", async (_request, response, next) => {
  try {
    const result = await pool.query(
      `
        SELECT orders.id, orders.status, orders.total_price, orders.created_at, users.name
        FROM orders
        JOIN users ON users.id = orders.user_id
        ORDER BY orders.created_at DESC
      `
    );
    response.json({ orders: result.rows });
  } catch (error) {
    next(error);
  }
});

router.patch("/orders/:id", async (request, response, next) => {
  try {
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [request.body.status, request.params.id]);
    response.json({ message: "Статус заказа обновлен." });
  } catch (error) {
    next(error);
  }
});

export default router;
