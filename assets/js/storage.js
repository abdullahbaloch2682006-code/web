// Shared localStorage helper for the Library (CRUD) and Discover (API) pages.
window.VincenzoStore = (() => {
  const KEY = 'vincenzo_books';

  // Array of objects used as the starting data
  const seed = [
    { id: 1, title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Classic', year: 1813, price: 9.99, status: 'Read' },
    { id: 2, title: '1984', author: 'George Orwell', genre: 'Fiction', year: 1949, price: 8.99, status: 'Read' },
    { id: 3, title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction', year: 1988, price: 10.49, status: 'Reading' },
    { id: 4, title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', year: 2011, price: 14.99, status: 'Want to read' },
    { id: 5, title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', year: 2018, price: 13.49, status: 'Want to read' },
    { id: 6, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic', year: 1925, price: 7.99, status: 'Reading' },
  ];

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw === null) return null;
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : null;
    } catch (e) {
      return null;
    }
  };

  const save = (books) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(books));
      return true;
    } catch (e) {
      return false;
    }
  };

  // Returns saved books, or seeds localStorage the first time
  const get = () => {
    const stored = load();
    if (stored !== null) return stored;
    const copy = seed.map((b) => ({ ...b }));
    save(copy);
    return copy;
  };

  return { KEY, seed, get, save };
})();
