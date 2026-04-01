import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAuth } from "../middleware/auth.js";
import { createError } from "../utils/errors.js";
import { fetchCartItems, fetchOrdersForUser } from "../services/books.js";

const router = Router();
router.use(requireAuth);

router.get("/", async (request, response, next) => {
  try {
    response.json({ orders: await fetchOrdersForUser(request.user.id) });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (request, response, next) => {
  const client = await pool.connect();

  try {
    const {
      city = "",
      address = "",
      paymentMethod = "cash_on_delivery",
      cardNumber = "",
      cardHolder = "",
      cardExpiry = "",
      cardCvv = ""
    } = request.body;

    if (!city || !address) throw createError(400, "Заполните город и адрес доставки.");
    if (!["cash_on_delivery", "card"].includes(paymentMethod)) {
      throw createError(400, "Выберите корректный способ оплаты.");
    }

    if (paymentMethod === "card") {
      if (!cardNumber || !cardHolder || !cardExpiry || !cardCvv) {
        throw createError(400, "Заполните данные карты.");
      }
    }

    await client.query("BEGIN");
    const cartItems = await fetchCartItems(request.user.id);
    if (cartItems.length === 0) throw createError(400, "Корзина пуста.");

    const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price_kzt) * item.quantity, 0);
    const cardLast4 = paymentMethod === "card" ? String(cardNumber).replace(/\D/g, "").slice(-4) : null;

    const orderResult = await client.query(
      `
        INSERT INTO orders (
          user_id, status, delivery_city, delivery_address, payment_method, card_last4, total_price
        )
        VALUES ($1, 'in_transit', $2, $3, $4, $5, $6)
        RETURNING id
      `,
      [request.user.id, city, address, paymentMethod, cardLast4, totalPrice]
    );

    for (const item of cartItems) {
      await client.query(
        "INSERT INTO order_items (order_id, book_id, quantity, price_kzt) VALUES ($1, $2, $3, $4)",
        [orderResult.rows[0].id, item.book_id, item.quantity, item.price_kzt]
      );
    }

    await client.query("DELETE FROM cart_items WHERE user_id = $1", [request.user.id]);
    await client.query("COMMIT");
    response.status(201).json({
      message: "Заказ оформлен. Статус: В пути.",
      orders: await fetchOrdersForUser(request.user.id)
    });
  } catch (error) {
    await client.query("ROLLBACK");
    next(error);
  } finally {
    client.release();
  }
});

router.patch("/:id/cancel", async (request, response, next) => {
  try {
    await pool.query("UPDATE orders SET status = 'cancelled' WHERE id = $1 AND user_id = $2", [
      request.params.id,
      request.user.id
    ]);
    response.json({ orders: await fetchOrdersForUser(request.user.id) });
  } catch (error) {
    next(error);
  }
});

export default router;
