import { useLanguage } from "../../contexts/LanguageContext";

const genreOptions = [
  { ru: "Антиутопия", en: "Dystopia" },
  { ru: "Психологическая проза", en: "Psychological prose" },
  { ru: "Философский роман", en: "Philosophical novel" },
  { ru: "Русская классика", en: "Russian classics" },
  { ru: "Зарубежная классика", en: "World classics" }
];

export default function CatalogFilters({ filters, onChange }) {
  const { t, language } = useLanguage();

  return (
    <div className="catalog-controls">
      <label className="filter-group">
        <span>{t.searchLabel}</span>
        <input
          className="field"
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder={t.searchPlaceholder}
        />
      </label>

      <label className="filter-group">
        <span>{t.genreLabel}</span>
        <select className="field" value={filters.genre} onChange={(event) => onChange("genre", event.target.value)}>
          <option value="">{t.allGenres}</option>
          {genreOptions.map((genre) => {
            const label = language === "en" ? genre.en : genre.ru;
            return (
              <option key={genre.en} value={label}>
                {label}
              </option>
            );
          })}
        </select>
      </label>

      <label className="filter-group">
        <span>{t.sortLabel}</span>
        <select className="field" value={filters.sort} onChange={(event) => onChange("sort", event.target.value)}>
          <option value="popular">{t.sortPopular}</option>
          <option value="cheap">{t.sortCheap}</option>
          <option value="expensive">{t.sortExpensive}</option>
          <option value="rating">{t.sortRating}</option>
        </select>
      </label>
    </div>
  );
}
