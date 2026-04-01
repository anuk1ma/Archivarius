import { useState } from "react";

const genreThemes = {
  "Русская классика": ["#6a3e2c", "#d4b08a"],
  "Зарубежная классика": ["#2f4b4f", "#d9c6a0"],
  "Антиутопия": ["#3f2323", "#d09a69"],
  "Философский роман": ["#4c3f58", "#c9b38f"],
  "Психологическая проза": ["#2f3f30", "#d7c2a2"]
};

function getCoverTheme(genre) {
  return genreThemes[genre] || ["#4a3529", "#d4b08a"];
}

function getInitials(title) {
  return title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export default function BookCover({ book, className = "", compact = false, showStamp = true }) {
  const [toneStart, toneEnd] = getCoverTheme(book.genre);
  const publishYear = book.publish_year || book.publishYear;
  const stampText = publishYear ? String(publishYear) : getInitials(book.title);
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(book.cover_url) && !imageFailed;

  return (
    <div
      className={`book-cover ${compact ? "book-cover--compact" : ""} ${className}`.trim()}
      style={{
        "--cover-start": toneStart,
        "--cover-end": toneEnd
      }}
      aria-label={`${book.title} cover`}
    >
      {hasImage ? (
        <>
          <img
            src={book.cover_url}
            alt={book.title}
            className="book-cover__photo"
            onError={() => setImageFailed(true)}
          />
          <div className="book-cover__photo-overlay" />
        </>
      ) : (
        <>
          <div className="book-cover__grain" />
          <div className="book-cover__spine" />
          <div className="book-cover__content">
            <span className="book-cover__genre">{book.genre}</span>
            <strong className="book-cover__title">{book.title}</strong>
            <span className="book-cover__author">{book.author}</span>
          </div>
        </>
      )}
      {showStamp && <div className="book-cover__seal">{stampText}</div>}
    </div>
  );
}
