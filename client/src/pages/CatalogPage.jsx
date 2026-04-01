import { useEffect, useState } from "react";
import { api } from "../api/client";
import BookCard from "../components/catalog/BookCard";
import CatalogFilters from "../components/catalog/CatalogFilters";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function CatalogPage() {
  const { token, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [books, setBooks] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filters, setFilters] = useState({ search: "", genre: "", sort: "popular" });

  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.search) query.set("search", filters.search);
    if (filters.genre) query.set("genre", filters.genre);
    if (filters.sort) query.set("sort", filters.sort);

    api
      .get(`/books?${query.toString()}`)
      .then((data) => setBooks(data.books))
      .catch(() => setBooks([]));
  }, [filters]);

  useEffect(() => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      return;
    }

    api
      .get("/favorites", token)
      .then((data) => setFavoriteIds(data.items.map((item) => item.id)))
      .catch(() => setFavoriteIds([]));
  }, [isAuthenticated, token]);

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  function handleFavoriteChange(bookId, nextValue) {
    setFavoriteIds((current) =>
      nextValue ? [...new Set([...current, bookId])] : current.filter((id) => id !== bookId)
    );
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-heading">
          <h1>{t.sectionCatalog}</h1>
        </div>
        <CatalogFilters filters={filters} onChange={updateFilter} />
        {books.length === 0 ? (
          <div className="page-state">{t.emptyCatalog}</div>
        ) : (
          <div className="book-grid">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isFavorite={favoriteIds.includes(book.id)}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
