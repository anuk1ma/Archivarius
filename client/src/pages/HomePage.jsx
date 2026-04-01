import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import { useLanguage } from "../contexts/LanguageContext";
import BookCard from "../components/catalog/BookCard";

export default function HomePage() {
  const { t } = useLanguage();
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
            <p>1913 Archive Selection</p>
            <ul>
              <li>Русская и европейская классика</li>
              <li>Антиутопии и интеллектуальная проза</li>
              <li>Редкие издания и культовые авторы</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-grid">
            <article className="paper-card feature-card">
              <p className="eyebrow">Curated Archive</p>
              <h3>Классика, собранная как галерея эпох</h3>
              <p>
                В Архивариусе каталог подан как витрина культовых книг: от русской классики до
                антиутопий и философской прозы XX века.
              </p>
            </article>
            <article className="paper-card feature-card">
              <p className="eyebrow">Reader Flow</p>
              <h3>Поиск и заказ без лишнего шума</h3>
              <p>
                Интерфейс построен так, чтобы преподавателю было легко увидеть критерии, а
                пользователю легко пройти путь от поиска книги до оформления заказа.
              </p>
            </article>
          </div>
          <div className="section-heading">
            <h2>{t.sectionFeatured}</h2>
          </div>
          <div className="book-grid">
            {books.map((book) => (
              <BookCard key={book.id} book={book} isFavorite={false} onFavoriteChange={() => {}} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
