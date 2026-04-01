import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import BookCover from "./BookCover";
import { localizeBook } from "../../utils/localizeBook";
import { translateErrorMessage } from "../../utils/translateErrorMessage";

export default function CartDrawer() {
  const { items, total, isCartOpen, setIsCartOpen, removeItem, checkout } = useCart();
  const { isAuthenticated } = useAuth();
  const { t, language } = useLanguage();
  const [message, setMessage] = useState("");

  async function handleCheckout() {
    try {
      await checkout();
      setMessage(t.orderSuccess);
    } catch (error) {
      setMessage(translateErrorMessage(error.message, language));
    }
  }

  return (
    <aside className={`cart-drawer ${isCartOpen ? "is-open" : ""}`}>
      <div className="cart-drawer__header">
        <h3>{t.cartTitle}</h3>
        <button type="button" onClick={() => setIsCartOpen(false)}>
          x
        </button>
      </div>

      {!isAuthenticated ? (
        <p className="muted">{t.cartLoginHint}</p>
      ) : items.length === 0 ? (
        <p className="muted">{t.cartEmpty}</p>
      ) : (
        <div className="cart-list">
          {items.map((item) => {
            const localized = localizeBook(item, language);
            return (
              <article key={item.book_id} className="cart-item">
                <BookCover book={localized} compact />
                <div>
                  <h4>{localized.title}</h4>
                  <p>{localized.author}</p>
                  <p>{Number(item.price_kzt).toLocaleString()} KZT</p>
                </div>
                <button type="button" onClick={() => removeItem(item.book_id)}>
                  x
                </button>
              </article>
            );
          })}
        </div>
      )}

      <div className="cart-drawer__footer">
        <strong>{total.toLocaleString()} KZT</strong>
        <button type="button" className="primary-button" onClick={handleCheckout}>
          {t.cartCheckout}
        </button>
        {message && <p className="form-message">{message}</p>}
      </div>
    </aside>
  );
}
