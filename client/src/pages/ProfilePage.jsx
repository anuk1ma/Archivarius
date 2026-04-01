import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import BookCover from "../components/common/BookCover";
import { localizeBook } from "../utils/localizeBook";

function getStatusLabel(status, t) {
  if (status === "cancelled") return t.statusCancelled;
  return t.statusInTransit;
}

function getRoleLabel(role, language) {
  if (language === "en") return role;
  return role === "admin" ? "администратор" : "пользователь";
}

export default function ProfilePage() {
  const { token, user } = useAuth();
  const { t, language } = useLanguage();
  const [tab, setTab] = useState("account");
  const [favorites, setFavorites] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/favorites", token).then((data) => setFavorites(data.items)).catch(() => setFavorites([]));
    api.get("/orders", token).then((data) => setOrders(data.orders)).catch(() => setOrders([]));
  }, [token]);

  async function cancelOrder(orderId) {
    const data = await api.patch(`/orders/${orderId}/cancel`, {}, token);
    setOrders(data.orders);
  }

  return (
    <section className="section">
      <div className="container profile-layout">
        <aside className="profile-sidebar">
          <button type="button" onClick={() => setTab("account")}>
            {t.profileAccount}
          </button>
          <button type="button" onClick={() => setTab("favorites")}>
            {t.profileFavorites}
          </button>
          <button type="button" onClick={() => setTab("orders")}>
            {t.profileOrders}
          </button>
        </aside>
        <div className="profile-panel">
          {tab === "account" && (
            <div className="paper-card">
              <h1>{t.profileTitle}</h1>
              <div className="account-banner">
                <div>
                  <p className="eyebrow">{t.profileReaderType}</p>
                  <h2>{user?.name}</h2>
                </div>
                <span className="status-pill">{getRoleLabel(user?.role, language)}</span>
              </div>
              <p>
                <strong>{t.name}:</strong> {user?.name}
              </p>
              <p>
                <strong>{t.email}:</strong> {user?.email}
              </p>
              <p>
                <strong>{t.roleLabel}:</strong> {getRoleLabel(user?.role, language)}
              </p>
            </div>
          )}
          {tab === "favorites" && (
            <div className="paper-card">
              <h2>{t.profileFavorites}</h2>
              {favorites.length === 0 ? (
                <p>{t.profileEmptyFavorites}</p>
              ) : (
                favorites.map((book) => {
                  const localized = localizeBook(book, language);
                  return (
                    <article key={book.id} className="profile-item">
                      <BookCover book={localized} compact />
                      <div>
                        <h3>{localized.title}</h3>
                        <p>{localized.author}</p>
                        <p>{Number(book.price_kzt).toLocaleString()} KZT</p>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          )}
          {tab === "orders" && (
            <div className="paper-card">
              <h2>{t.profileOrders}</h2>
              {orders.length === 0 ? (
                <p>{t.profileEmptyOrders}</p>
              ) : (
                orders.map((order) => (
                  <article key={order.id} className="order-card">
                    <div>
                      <h3>
                        {t.orderLabel} #{order.id}
                      </h3>
                      <p className="status-pill">{getStatusLabel(order.status, t)}</p>
                      <p>{Number(order.total_price).toLocaleString()} KZT</p>
                    </div>
                    {order.status !== "cancelled" && (
                      <button className="ghost-button" type="button" onClick={() => cancelOrder(order.id)}>
                        {t.cancelOrder}
                      </button>
                    )}
                  </article>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
