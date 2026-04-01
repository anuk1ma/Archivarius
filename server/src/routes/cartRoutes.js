import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { fetchCartItems } from "../services/books.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (request, response, next) => {
  try {
    response.json({ items: await fetchCartItems(request.user.id) });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  try {
    const { bookId, quantity = 1 } = request.body;
    await pool.query(
      `
        INSERT INTO cart_items (user_id, book_id, quantity)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, book_id)
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      `,
      [request.user.id, bookId, quantity]
    );
    response.status(201).json({ items: await fetchCartItems(request.user.id) });
  } catch (error) {
    next(error);
  }
});

router.delete("/:bookId", async (request, response, next) => {
  try {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1 AND book_id = $2", [
      request.user.id,
      request.params.bookId
    ]);
    response.json({ items: await fetchCartItems(request.user.id) });
  } catch (error) {
    next(error);
  }
});

export default router;
