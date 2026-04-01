import { useLanguage } from "../../contexts/LanguageContext";

const genres = [
  "Все жанры",
  "Антиутопия",
  "Психологическая проза",
  "Философский роман",
  "Русская классика",
  "Зарубежная классика"
];

export default function CatalogFilters({ filters, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="catalog-controls">
      <label className="filter-group">
        <span>Поиск</span>
        <input
          className="field"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder={t.searchPlaceholder}
        />
      </label>

      <label className="filter-group">
        <span>Жанр</span>
        <select
          className="field"
          value={filters.genre}
          onChange={(event) => onChange("genre", event.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre === "Все жанры" ? "" : genre}>
              {genre}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-group">
        <span>Сортировка</span>
        <select
          className="field"
          value={filters.sort}
          onChange={(event) => onChange("sort", event.target.value)}
        >
          <option value="popular">{t.sortPopular}</option>
          <option value="cheap">{t.sortCheap}</option>
          <option value="expensive">{t.sortExpensive}</option>
          <option value="rating">{t.sortRating}</option>
        </select>
      </label>
    </div>
  );
}
