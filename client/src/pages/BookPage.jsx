import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import BookCover from "../components/common/BookCover";

export default function BookPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}`).then((data) => setBook(data.book)).catch(() => setBook(null));
  }, [id]);

  if (!book) {
    return <div className="page-state">{t.loading}</div>;
  }

  const paragraphs = String(book.description).split("\n\n");

  return (
    <section className="section">
      <div className="container book-view">
        <BookCover book={book} className="book-view__image" />
        <div className="book-view__content">
          <p className="eyebrow">{book.genre}</p>
          <h1>{book.title}</h1>
          <h2>{book.author}</h2>

          <div className="quote-panel">
            <span>Archivarius Note</span>
            <p>
              Издание подобрано как часть коллекции мировой классики: книги, которые не просто
              читают, а обсуждают, цитируют и выносят в презентации.
            </p>
          </div>

          <div className="book-info-grid">
            <div>
              <span>{t.year}</span>
              <strong>{book.publish_year}</strong>
            </div>
            <div>
              <span>{t.publisher}</span>
              <strong>{book.publisher}</strong>
            </div>
            <div>
              <span>{t.language}</span>
              <strong>{book.book_language}</strong>
            </div>
            <div>
              <span>{t.rating}</span>
              <strong>{book.rating}</strong>
            </div>
          </div>

          <div className="book-view__actions">
            <strong>{Number(book.price_kzt).toLocaleString()} KZT</strong>
            <button className="primary-button" type="button" onClick={() => addToCart(book.id)}>
              {t.addToCart}
            </button>
          </div>

          <div className="book-description-panel">
            <h3>Краткое описание</h3>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
