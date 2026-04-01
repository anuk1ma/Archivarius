import fs from "fs/promises";
import path from "path";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { pool } from "./pool.js";
import { seedBooks } from "../data/seedBooks.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seed() {
  const schema = await fs.readFile(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);

  const adminPassword = await bcrypt.hash("admin12345", 10);
  await pool.query(
    `
      INSERT INTO users (name, email, password_hash, role)
      VALUES ($1, $2, $3, 'admin')
      ON CONFLICT (email) DO NOTHING
    `,
    ["Admin Archivarius", "admin@archivarius.local", adminPassword]
  );

  for (const book of seedBooks) {
    const exists = await pool.query("SELECT id FROM books WHERE title = $1 AND author = $2", [
      book.title,
      book.author
    ]);

    if (exists.rowCount > 0) continue;

    await pool.query(
      `
        INSERT INTO books (
          title, author, genre, description, publish_year, publisher,
          book_language, rating, price_kzt, cover_url, popularity
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      `,
      [
        book.title,
        book.author,
        book.genre,
        book.description,
        book.publishYear,
        book.publisher,
        book.language,
        book.rating,
        book.priceKzt,
        book.coverUrl,
        book.popularity
      ]
    );
  }

  console.log("Database seeded successfully.");
  await pool.end();
}

seed().catch(async (error) => {
  console.error(error);
  await pool.end();
  process.exit(1);
});
