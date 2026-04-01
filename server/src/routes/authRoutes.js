import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool.js";
import { createError } from "../utils/errors.js";
import { signToken } from "../utils/tokens.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/register", async (request, response, next) => {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password) throw createError(400, "Заполните имя, email и пароль.");

    const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
    if (existingUser.rowCount > 0) throw createError(409, "Пользователь с таким email уже существует.");

    const passwordHash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, role",
      [name, email, passwordHash]
    );

    const user = result.rows[0];
    response.status(201).json({ user, token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (request, response, next) => {
  try {
    const { email, password } = request.body;
    if (!email || !password) throw createError(400, "Введите email и пароль.");

    const result = await pool.query(
      "SELECT id, name, email, role, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) throw createError(404, "Такого пользователя не существует.");
    const user = result.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) throw createError(401, "Неверный пароль.");

    response.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token: signToken(user)
    });
  } catch (error) {
    next(error);
  }
});

router.get("/me", requireAuth, async (request, response, next) => {
  try {
    const result = await pool.query("SELECT id, name, email, role FROM users WHERE id = $1", [
      request.user.id
    ]);
    response.json({ user: result.rows[0] });
  } catch (error) {
    next(error);
  }
});

export default router;
