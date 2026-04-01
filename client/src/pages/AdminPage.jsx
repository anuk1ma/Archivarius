import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import UserAvatar from "../components/common/UserAvatar";
import { localizeBook } from "../utils/localizeBook";

const initialBook = {
  title: "",
  titleEn: "",
  author: "",
  authorEn: "",
  genre: "",
  genreEn: "",
  description: "",
  descriptionEn: "",
  publishYear: "",
  publisher: "",
  publisherEn: "",
  language: "",
  languageEn: "",
  rating: "",
  priceKzt: "",
  coverUrl: "",
  popularity: ""
};

function getFormLabels(language) {
  if (language === "en") {
    return {
      title: "Title (RU)",
      titleEn: "Title (EN)",
      author: "Author (RU)",
      authorEn: "Author (EN)",
      genre: "Genre (RU)",
      genreEn: "Genre (EN)",
      description: "Description (RU)",
      descriptionEn: "Description (EN)",
      publishYear: "Publication year",
      publisher: "Publisher (RU)",
      publisherEn: "Publisher (EN)",
      language: "Language (RU)",
      languageEn: "Language (EN)",
      rating: "Rating",
      priceKzt: "Price in KZT",
      coverUrl: "Cover image URL",
      popularity: "Popularity"
    };
  }

  return {
    title: "Название (RU)",
    titleEn: "Название (EN)",
    author: "Автор (RU)",
    authorEn: "Автор (EN)",
    genre: "Жанр (RU)",
    genreEn: "Жанр (EN)",
    description: "Описание (RU)",
    descriptionEn: "Описание (EN)",
    publishYear: "Год издания",
    publisher: "Издательство (RU)",
    publisherEn: "Издательство (EN)",
    language: "Язык (RU)",
    languageEn: "Язык (EN)",
    rating: "Рейтинг",
    priceKzt: "Цена в KZT",
    coverUrl: "Ссылка на обложку",
    popularity: "Популярность"
  };
}

function getStatusLabel(status, t) {
  if (status === "cancelled") return t.statusCancelled;
  return t.statusInTransit;
}

function getRoleLabel(role, language) {
  if (language === "en") return role;
  return role === "admin" ? "администратор" : "пользователь";
}

export default function AdminPage() {
  const { token } = useAuth();
  const { t, language } = useLanguage();
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(initialBook);
  const [editingId, setEditingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const formLabels = useMemo(() => getFormLabels(language), [language]);

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
      setStatusMessage(t.adminBookUpdated);
    } else {
      await api.post("/admin/books", payload, token);
      setStatusMessage(t.adminBookCreated);
    }

    setForm(initialBook);
    setEditingId(null);
    await refreshAll();
  }

  async function deleteBook(id) {
    await api.delete(`/admin/books/${id}`, token);
    setStatusMessage(t.adminBookDeleted);
    await refreshAll();
  }

  async function toggleRole(userId, role) {
    await api.patch(`/admin/users/${userId}`, { role }, token);
    setStatusMessage(t.adminRoleUpdated);
    await refreshAll();
  }

  async function deleteUser(userId) {
    await api.delete(`/admin/users/${userId}`, token);
    setStatusMessage(t.adminUserDeleted);
    await refreshAll();
  }

  async function updateOrderStatus(orderId, status) {
    await api.patch(`/admin/orders/${orderId}`, { status }, token);
    setStatusMessage(t.adminOrderUpdated);
    await refreshAll();
  }

  function startEdit(book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      titleEn: book.title_en || "",
      author: book.author,
      authorEn: book.author_en || "",
      genre: book.genre,
      genreEn: book.genre_en || "",
      description: book.description,
      descriptionEn: book.description_en || "",
      publishYear: book.publish_year,
      publisher: book.publisher,
      publisherEn: book.publisher_en || "",
      language: book.book_language,
      languageEn: book.book_language_en || "",
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
                {key === "description" || key === "descriptionEn" ? (
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
          {books.map((book) => {
            const localizedBook = localizeBook(book, language);
            return (
              <article key={book.id} className="admin-item">
                <div className="admin-item__content">
                  <strong>{localizedBook.title}</strong>
                  <span>
                    {localizedBook.author} • {localizedBook.genre} • {Number(book.price_kzt).toLocaleString()} KZT
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
            );
          })}
        </div>

        <div className="paper-card">
          <h2>{t.adminUsers}</h2>
          {users.map((currentUser) => (
            <article key={currentUser.id} className="admin-item">
              <div className="admin-item__content">
                <div className="admin-user-meta">
                  <UserAvatar user={currentUser} size="sm" />
                  <strong>{currentUser.name}</strong>
                </div>
                <span>
                  {currentUser.email} • {getRoleLabel(currentUser.role, language)}
                </span>
              </div>
              <div className="admin-item__actions">
                <button
                  className="ghost-button"
                  type="button"
                  onClick={() => toggleRole(currentUser.id, currentUser.role === "admin" ? "user" : "admin")}
                >
                  {t.adminRoleToggle}
                </button>
                {currentUser.role !== "admin" && (
                  <button className="ghost-button" type="button" onClick={() => deleteUser(currentUser.id)}>
                    {t.adminDeleteUser}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="paper-card">
          <h2>{t.adminOrders}</h2>
          {orders.map((order) => (
            <article key={order.id} className="admin-item">
              <div className="admin-item__content">
                <strong>
                  {t.orderLabel} #{order.id}
                </strong>
                <span>
                  {order.name || t.adminUnknownUser} • {Number(order.total_price).toLocaleString()} KZT •{" "}
                  {getStatusLabel(order.status, t)}
                </span>
              </div>
              <select
                className="field"
                value={order.status}
                onChange={(event) => updateOrderStatus(order.id, event.target.value)}
              >
                <option value="in_transit">{t.statusInTransit}</option>
                <option value="cancelled">{t.statusCancelled}</option>
              </select>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
