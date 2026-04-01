import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { useLanguage } from "../contexts/LanguageContext";
import { useCart } from "../contexts/CartContext";
import BookCover from "../components/common/BookCover";
import { localizeBook } from "../utils/localizeBook";

export default function BookPage() {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);

  useEffect(() => {
    api.get(`/books/${id}`).then((data) => setBook(data.book)).catch(() => setBook(null));
  }, [id]);

  const localizedBook = useMemo(() => localizeBook(book, language), [book, language]);

  if (!localizedBook) {
    return <div className="page-state">{t.loading}</div>;
  }

  const paragraphs = String(localizedBook.description || "").split("\n\n");

  return (
    <section className="section">
      <div className="container book-view">
        <BookCover book={localizedBook} className="book-view__image" />
        <div className="book-view__content">
          <p className="eyebrow">{localizedBook.genre}</p>
          <h1>{localizedBook.title}</h1>
          <h2>{localizedBook.author}</h2>

          <div className="quote-panel">
            <span>{t.archivariusNoteTitle}</span>
            <p>{t.archivariusNoteText}</p>
          </div>

          <div className="book-info-grid">
            <div>
              <span>{t.year}</span>
              <strong>{localizedBook.publish_year}</strong>
            </div>
            <div>
              <span>{t.publisher}</span>
              <strong>{localizedBook.publisher}</strong>
            </div>
            <div>
              <span>{t.language}</span>
              <strong>{localizedBook.book_language}</strong>
            </div>
            <div>
              <span>{t.rating}</span>
              <strong>{localizedBook.rating}</strong>
            </div>
          </div>

          <div className="book-view__actions">
            <strong>{Number(localizedBook.price_kzt).toLocaleString()} KZT</strong>
            <button className="primary-button" type="button" onClick={() => addToCart(localizedBook.id)}>
              {t.addToCart}
            </button>
          </div>

          <div className="book-description-panel">
            <h3>{t.briefDescription}</h3>
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
