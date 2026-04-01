import { Router } from "express";
import { pool } from "../db/pool.js";
import { fetchBooks } from "../services/books.js";
import { createError } from "../utils/errors.js";

const router = Router();

router.get("/", async (request, response, next) => {
  try {
    response.json({ books: await fetchBooks(request.query) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (request, response, next) => {
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [request.params.id]);
    if (result.rowCount === 0) throw createError(404, "Книга не найдена.");
    response.json({ book: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
