import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAuth } from "../../contexts/AuthContext";
import BookCover from "./BookCover";

export default function CartDrawer() {
  const { items, total, isCartOpen, setIsCartOpen, removeItem, checkout } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [message, setMessage] = useState("");

  async function handleCheckout() {
    try {
      const data = await checkout();
      setMessage(data.message || t.orderSuccess);
    } catch (error) {
      setMessage(error.message);
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
        <p className="muted">Войдите, чтобы пользоваться корзиной.</p>
      ) : items.length === 0 ? (
        <p className="muted">{t.cartEmpty}</p>
      ) : (
        <div className="cart-list">
          {items.map((item) => (
            <article key={item.book_id} className="cart-item">
              <BookCover book={item} compact />
              <div>
                <h4>{item.title}</h4>
                <p>{item.author}</p>
                <p>{Number(item.price_kzt).toLocaleString()} KZT</p>
              </div>
              <button type="button" onClick={() => removeItem(item.book_id)}>
                x
              </button>
            </article>
          ))}
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
