import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import { useCart } from "../../contexts/CartContext";
import { api } from "../../api/client";
import BookCover from "../common/BookCover";

export default function BookCard({ book, isFavorite, onFavoriteChange }) {
  const { t } = useLanguage();
  const { isAuthenticated, token } = useAuth();
  const { addToCart } = useCart();

  async function toggleFavorite() {
    if (!isAuthenticated) return;

    if (isFavorite) {
      await api.delete(`/favorites/${book.id}`, token);
      onFavoriteChange(book.id, false);
    } else {
      await api.post("/favorites", { bookId: book.id }, token);
      onFavoriteChange(book.id, true);
    }
  }

  return (
    <article className="book-card">
      <Link className="book-card__cover-link" to={`/books/${book.id}`}>
        <BookCover book={book} className="book-card__image" />
        <span className="book-card__cover-cta">{t.moreDetails}</span>
      </Link>
      <div className="book-card__body">
        <p className="book-card__genre">{book.genre}</p>
        <h3>{book.title}</h3>
        <p className="book-card__author">{book.author}</p>
        <p className="book-card__description">{book.description}</p>
        <div className="book-card__meta">
          <span>{Number(book.price_kzt).toLocaleString()} KZT</span>
          <span>{book.rating}</span>
        </div>
        <div className="book-card__actions">
          <Link className="ghost-button" to={`/books/${book.id}`}>
            {t.moreDetails}
          </Link>
          <button className="ghost-button" type="button" onClick={toggleFavorite}>
            {isFavorite ? t.removeFromFavorites : t.addToFavorites}
          </button>
          <button className="primary-button" type="button" onClick={() => addToCart(book.id)}>
            {t.addToCart}
          </button>
        </div>
      </div>
    </article>
  );
}
