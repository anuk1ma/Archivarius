export function localizeBook(book, language) {
  if (!book) return book;
  if (language !== "en") return book;

  return {
    ...book,
    title: book.title_en || book.title,
    author: book.author_en || book.author,
    genre: book.genre_en || book.genre,
    description: book.description_en || book.description,
    publisher: book.publisher_en || book.publisher,
    book_language: book.book_language_en || book.book_language
  };
}
