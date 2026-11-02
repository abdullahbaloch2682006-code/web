// Task 2: fetch data from a free JSON API (Open Library) using axios.get
document.addEventListener('DOMContentLoaded', () => {
  const store = window.VincenzoStore;
  const API_URL = 'https://openlibrary.org/search.json';

  const form = document.getElementById('search-form');
  const input = document.getElementById('q');
  const statusBox = document.getElementById('status');
  const results = document.getElementById('results');

  const el = (tag, cls, text) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const setStatus = (text, kind) => {
    const colors = { info: 'bg-stone-100 text-stone-700', error: 'bg-red-50 text-red-800', ok: 'bg-green-50 text-green-800' };
    statusBox.className = 'mt-6 rounded-lg p-4 text-sm ' + (colors[kind] || colors.info);
    statusBox.textContent = text;
  };

  const addToLibrary = (item, button) => {
    const books = store.get();
    // some(): do not add duplicates
    if (books.some((b) => b.title.toLowerCase() === item.title.toLowerCase())) {
      button.textContent = 'Already in library';
      button.disabled = true;
      return;
    }
    books.push({
      id: Date.now(),
      title: item.title,
      author: (item.author_name && item.author_name[0]) || 'Unknown',
      genre: 'Other',
      year: item.first_publish_year || new Date().getFullYear(),
      price: 0,
      status: 'Want to read',
    });
    store.save(books);
    button.textContent = 'Added ✓';
    button.disabled = true;
  };

  const renderBook = (item) => {
    const card = el('article', 'bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col');

    const figure = el('figure', 'h-56 bg-stone-100 flex items-center justify-center');
    if (item.cover_i) {
      const img = el('img', 'h-full w-full object-cover');
      img.src = `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`;
      img.alt = `Cover of ${item.title}`;
      img.loading = 'lazy';
      figure.appendChild(img);
    } else {
      figure.appendChild(el('span', 'px-4 text-center font-semibold text-stone-500', item.title));
    }
    card.appendChild(figure);

    const body = el('div', 'p-4 flex flex-col flex-1');
    body.appendChild(el('h3', 'font-semibold leading-snug', item.title));
    body.appendChild(el('p', 'text-sm text-stone-500', 'by ' + ((item.author_name && item.author_name.join(', ')) || 'Unknown author')));
    body.appendChild(el('p', 'mt-1 text-xs text-stone-500', 'First published: ' + (item.first_publish_year || 'n/a')));

    const btn = el('button', 'mt-4 text-sm font-medium px-3 py-1.5 rounded-lg border border-amber-700 text-amber-700 hover:bg-amber-50 disabled:opacity-60', 'Add to my library');
    btn.type = 'button';
    btn.addEventListener('click', () => addToLibrary(item, btn));
    const wrap = el('div', 'mt-auto');
    wrap.appendChild(btn);
    body.appendChild(wrap);

    card.appendChild(body);
    return card;
  };

  let latestRequest = 0;
  const search = async (query) => {
    const requestId = ++latestRequest; // ignore outdated responses
    results.innerHTML = '';
    setStatus('Loading books…', 'info');
    try {
      // axios.get request with query params
      const response = await axios.get(API_URL, {
        params: { q: query, limit: 12, fields: 'key,title,author_name,first_publish_year,cover_i' },
      });
      if (requestId !== latestRequest) return;
      const docs = response.data.docs;
      if (!docs.length) {
        setStatus(`No books found for "${query}". Try another search.`, 'error');
        return;
      }
      setStatus(`Found ${response.data.numFound.toLocaleString()} books for "${query}". Showing the first ${docs.length}.`, 'ok');
      docs.forEach((item) => results.appendChild(renderBook(item)));
    } catch (error) {
      if (requestId !== latestRequest) return;
      setStatus('Could not load data from the API. Please check your internet connection and try again.', 'error');
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return setStatus('Please type something to search.', 'error');
    search(q);
  });

  document.querySelectorAll('[data-query]').forEach((chip) => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.query;
      search(chip.dataset.query);
    });
  });

  // First load
  input.value = 'the lord of the rings';
  search(input.value);
});
