import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useLanguage } from "../contexts/LanguageContext";
import BookCard from "../components/catalog/BookCard";
import { localizeBook } from "../utils/localizeBook";

export default function HomePage() {
  const { t, language } = useLanguage();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    api.get("/books?limit=3").then((data) => setBooks(data.books)).catch(() => setBooks([]));
  }, []);

  return (
    <div>
      <section className="hero-section">
        <div className="hero-overlay" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">{t.heroEyebrow}</p>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="hero-actions">
              <Link className="primary-button" to="/catalog">
                {t.heroAction}
              </Link>
              <Link className="ghost-button" to="/contacts">
                {t.heroSecondary}
              </Link>
            </div>
          </div>
          <div className="hero-panel">
            <p>{t.archiveSelectionLabel}</p>
            <ul>
              <li>{t.homeSelectionItem1}</li>
              <li>{t.homeSelectionItem2}</li>
              <li>{t.homeSelectionItem3}</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-grid">
            <article className="paper-card feature-card">
              <p className="eyebrow">{t.homeArchiveEyebrow}</p>
              <h3>{t.homeArchiveTitle}</h3>
              <p>{t.homeArchiveText}</p>
            </article>
            <article className="paper-card feature-card">
              <p className="eyebrow">{t.homeFlowEyebrow}</p>
              <h3>{t.homeFlowTitle}</h3>
              <p>{t.homeFlowText}</p>
            </article>
          </div>
          <div className="section-heading">
            <h2>{t.sectionFeatured}</h2>
          </div>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={localizeBook(book, language)}
                isFavorite={false}
                onFavoriteChange={() => {}}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
