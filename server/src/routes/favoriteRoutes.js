import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (request, response, next) => {
  try {
    const result = await pool.query(
      `
        SELECT books.*
        FROM favorites
        JOIN books ON books.id = favorites.book_id
        WHERE favorites.user_id = $1
        ORDER BY favorites.id DESC
      `,
      [request.user.id]
    );
    response.json({ items: result.rows });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    await pool.query(
      `
        INSERT INTO favorites (user_id, book_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, book_id) DO NOTHING
      `,
      [request.user.id, request.body.bookId]
    );
    response.status(201).json({ message: "Книга добавлена в избранное." });
  } catch (error) {
    next(error);
  }
});

router.delete("/:bookId", async (request, response, next) => {
  try {
    await pool.query("DELETE FROM favorites WHERE user_id = $1 AND book_id = $2", [
      request.user.id,
      request.params.bookId
    ]);
    response.json({ message: "Книга удалена из избранного." });
  } catch (error) {
    next(error);
  }
});

export default router;
