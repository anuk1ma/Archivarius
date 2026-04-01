import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { createError } from "../utils/errors.js";

export function requireAuth(request, _response, next) {
  const header = request.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(createError(401, "Требуется авторизация."));
  }

  try {
    request.user = jwt.verify(header.replace("Bearer ", ""), env.jwtSecret);
    return next();
  } catch {
    return next(createError(401, "Токен недействителен."));
  }
}

export function requireAdmin(request, _response, next) {
  if (request.user?.role !== "admin") {
    return next(createError(403, "Доступ только для администратора."));
  }

  return next();
}
