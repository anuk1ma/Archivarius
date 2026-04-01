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
      author,
      genre,
      description,
      publishYear,
      publisher,
      language,
      rating,
      priceKzt,
      coverUrl,
      popularity
    } = request.body;

    await pool.query(
      `
        INSERT INTO books (
          title, author, genre, description, publish_year,
          publisher, book_language, rating, price_kzt, cover_url, popularity
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [title, author, genre, description, publishYear, publisher, language, rating, priceKzt, coverUrl, popularity]
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
      author,
      genre,
      description,
      publishYear,
      publisher,
      language,
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
          author = $2,
          genre = $3,
          description = $4,
          publish_year = $5,
          publisher = $6,
          book_language = $7,
          rating = $8,
          price_kzt = $9,
          cover_url = $10,
          popularity = $11
        WHERE id = $12
      `,
      [
        title,
        author,
        genre,
        description,
        publishYear,
        publisher,
        language,
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
