import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

const initialBook = {
  title: "",
  author: "",
  genre: "",
  description: "",
  publishYear: "",
  publisher: "",
  language: "",
  rating: "",
  priceKzt: "",
  coverUrl: "",
  popularity: ""
};

const formLabels = {
  title: "Название",
  author: "Автор",
  genre: "Жанр",
  description: "Описание",
  publishYear: "Год издания",
  publisher: "Издательство",
  language: "Язык",
  rating: "Рейтинг",
  priceKzt: "Цена в KZT",
  coverUrl: "Ссылка на обложку",
  popularity: "Популярность"
};

export default function AdminPage() {
  const { token } = useAuth();
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialBook);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    refreshAll();
  }, [token]);

  async function refreshAll() {
    const [booksData, usersData, ordersData] = await Promise.all([
      api.get("/admin/books", token),
      api.get("/admin/users", token),
      api.get("/admin/orders", token)
    ]);
    setBooks(booksData.books);
    setUsers(usersData.users);
    setOrders(ordersData.orders);
  }

  async function handleCreate(event) {
    event.preventDefault();
    const payload = {
      ...form,
      publishYear: Number(form.publishYear),
      rating: Number(form.rating),
      priceKzt: Number(form.priceKzt),
      popularity: Number(form.popularity)
    };

    if (editingId) {
      await api.put(`/admin/books/${editingId}`, payload, token);
      setStatusMessage("Книга обновлена.");
    } else {
      await api.post("/admin/books", payload, token);
      setStatusMessage("Книга создана.");
    }

    setForm(initialBook);
    setEditingId(null);
    await refreshAll();
  }

  async function deleteBook(id) {
    await api.delete(`/admin/books/${id}`, token);
    setStatusMessage("Книга удалена.");
    await refreshAll();
  }

  async function toggleRole(userId, role) {
    await api.patch(`/admin/users/${userId}`, { role }, token);
    setStatusMessage("Роль пользователя изменена.");
    await refreshAll();
  }

  async function updateOrderStatus(orderId, status) {
    await api.patch(`/admin/orders/${orderId}`, { status }, token);
    setStatusMessage("Статус заказа обновлен.");
    await refreshAll();
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      publishYear: book.publish_year,
      publisher: book.publisher,
      language: book.book_language,
      rating: book.rating,
      priceKzt: book.price_kzt,
      coverUrl: book.cover_url,
      popularity: book.popularity
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(initialBook);
  }

  return (
    <section className="section">
      <div className="container admin-layout">
        <div className="paper-card">
          <h1>{t.adminTitle}</h1>
          <p className="admin-subtitle">{t.adminCreateBook}</p>
          <form className="admin-form" onSubmit={handleCreate}>
            {Object.entries(form).map(([key, value]) => (
              <label key={key} className="field-group">
                <span>{formLabels[key]}</span>
                {key === "description" ? (
                  <textarea
                    className="field field-textarea"
                    placeholder={formLabels[key]}
                    value={value}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  />
                ) : (
                  <input
                    className="field"
                    placeholder={formLabels[key]}
                    value={value}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                  />
                )}
              </label>
            ))}
            <div className="admin-form-actions">
              <button className="primary-button" type="submit">
                {editingId ? t.update : t.create}
              </button>
              {editingId && (
                <button className="ghost-button" type="button" onClick={resetForm}>
                  {t.adminCancelEdit}
                </button>
              )}
            </div>
          </form>
          {statusMessage && <p className="form-message">{statusMessage}</p>}
        </div>

        <div className="paper-card">
          <h2>{t.adminBookList}</h2>
          {books.map((book) => (
            <article key={book.id} className="admin-item">
              <div className="admin-item__content">
                <strong>{book.title}</strong>
                <span>
                  {book.author} • {book.genre} • {Number(book.price_kzt).toLocaleString()} KZT
                </span>
              </div>
              <div className="admin-item__actions">
                <button className="ghost-button" type="button" onClick={() => startEdit(book)}>
                  {t.adminEdit}
                </button>
                <button className="ghost-button" type="button" onClick={() => deleteBook(book.id)}>
                  {t.delete}
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="paper-card">
          <h2>{t.adminUsers}</h2>
          {users.map((currentUser) => (
            <article key={currentUser.id} className="admin-item">
              <span>
                {currentUser.name} - {currentUser.role}
              </span>
              <button
                className="ghost-button"
                type="button"
                onClick={() => toggleRole(currentUser.id, currentUser.role === "admin" ? "user" : "admin")}
              >
                {t.adminRoleToggle}
              </button>
            </article>
          ))}
        </div>

        <div className="paper-card">
          <h2>{t.adminOrders}</h2>
          {orders.map((order) => (
            <article key={order.id} className="admin-item">
              <div className="admin-item__content">
                <strong>#{order.id}</strong>
                <span>
                  {order.name || "User"} • {Number(order.total_price).toLocaleString()} KZT
                </span>
              </div>
              <select
                className="field"
                value={order.status}
                onChange={(event) => updateOrderStatus(order.id, event.target.value)}
              >
                <option value="in_transit">in_transit</option>
                <option value="cancelled">cancelled</option>
              </select>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
