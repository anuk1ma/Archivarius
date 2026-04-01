import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const normalizedClientUrl = env.clientUrl.replace(/\/+$/, "");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");
      callback(null, normalizedOrigin === normalizedClientUrl);
    }
  })
);
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, service: "archivarius-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use((_request, _response, next) => next({ status: 404, message: "Маршрут API не найден." }));
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Archivarius API is running on port ${env.port}`);
});
