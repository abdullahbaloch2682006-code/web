// CRUD app: array of objects + localStorage + search filters using array methods
document.addEventListener('DOMContentLoaded', () => {
  const store = window.VincenzoStore;
  let books = store.get(); // array of objects

  const $ = (id) => document.getElementById(id);
  const GENRES = ['Fiction', 'Classic', 'Mystery', 'Sci-Fi', 'History', 'Self-help', 'Children', 'Other'];
  const STATUS_STYLE = {
    'Read': 'bg-green-100 text-green-800',
    'Reading': 'bg-amber-100 text-amber-800',
    'Want to read': 'bg-stone-100 text-stone-700',
  };

  const form = $('book-form');
  const msg = $('form-msg');
  const rows = $('book-rows');

  const esc = (v) =>
    String(v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const persist = () => store.save(books);

  const showMsg = (text, ok) => {
    msg.className = 'mt-4 rounded-lg p-3 text-sm ' + (ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800');
    msg.textContent = text;
  };

  // ---------- fill the genre <select> using map() ----------
  $('genre').innerHTML = GENRES.map((g) => `<option>${g}</option>`).join('');

  // ---------- READ + FILTER (different array methods) ----------
  const getVisible = () => {
    const q = $('search').value.trim().toLowerCase();
    const genre = $('filter-genre').value;
    const status = $('filter-status').value;
    const sortBy = $('sort-by').value;

    // filter() + some() + includes(): text search on title OR author
    let list = books.filter((b) => [b.title, b.author].some((t) => t.toLowerCase().includes(q)));
    // filter(): dropdown filters
    if (genre !== 'all') list = list.filter((b) => b.genre === genre);
    if (status !== 'all') list = list.filter((b) => b.status === status);

    const sorters = {
      'title-asc': (a, b) => a.title.localeCompare(b.title),
      'title-desc': (a, b) => b.title.localeCompare(a.title),
      'year-new': (a, b) => b.year - a.year,
      'price-low': (a, b) => a.price - b.price,
      'price-high': (a, b) => b.price - a.price,
    };
    // sort() on a copy so the original array order is untouched
    return [...list].sort(sorters[sortBy]);
  };

  const renderGenreFilter = () => {
    const select = $('filter-genre');
    const current = select.value || 'all';
    // map() + Set: unique genres actually present in the data
    const genres = [...new Set(books.map((b) => b.genre))].sort();
    select.innerHTML =
      '<option value="all">All genres</option>' + genres.map((g) => `<option value="${esc(g)}">${esc(g)}</option>`).join('');
    select.value = genres.includes(current) ? current : 'all';
  };

  const renderStats = () => {
    $('stat-total').textContent = books.length;
    $('stat-read').textContent = books.filter((b) => b.status === 'Read').length; // filter()
    $('stat-value').textContent = '$' + books.reduce((sum, b) => sum + b.price, 0).toFixed(2); // reduce()
    $('stat-genres').textContent = new Set(books.map((b) => b.genre)).size; // map() + Set
  };

  const render = () => {
    const list = getVisible();
    rows.innerHTML = list
      .map(
        (b) => `
      <tr class="border-t border-stone-200">
        <th scope="row" class="px-4 py-3 text-left font-medium">${esc(b.title)}</th>
        <td class="px-4 py-3">${esc(b.author)}</td>
        <td class="px-4 py-3">${esc(b.genre)}</td>
        <td class="px-4 py-3">${esc(b.year)}</td>
        <td class="px-4 py-3">$${Number(b.price).toFixed(2)}</td>
        <td class="px-4 py-3"><span class="px-2.5 py-0.5 text-xs font-semibold rounded-full ${STATUS_STYLE[b.status] || ''}">${esc(b.status)}</span></td>
        <td class="px-4 py-3 whitespace-nowrap">
          <button type="button" data-action="edit" data-id="${b.id}" class="text-amber-700 font-medium hover:underline">Edit</button>
          <span aria-hidden="true" class="text-stone-300 mx-1">|</span>
          <button type="button" data-action="delete" data-id="${b.id}" class="text-red-600 font-medium hover:underline">Delete</button>
        </td>
      </tr>`
      )
      .join('');
    $('empty-msg').classList.toggle('hidden', list.length > 0);
    $('result-count').textContent = `Showing ${list.length} of ${books.length} books`;
    renderStats();
  };

  const refresh = () => {
    renderGenreFilter();
    render();
  };

  // ---------- CREATE / UPDATE ----------
  const resetForm = () => {
    form.reset();
    $('book-id').value = '';
    $('form-title').textContent = 'Add a new book';
    $('submit-btn').textContent = 'Add Book';
    $('cancel-btn').classList.add('hidden');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
      title: $('title').value.trim(),
      author: $('author').value.trim(),
      genre: $('genre').value,
      year: Number($('pub-year').value),
      price: Number($('price').value),
      status: $('status').value,
    };

    // every(): all fields must be filled
    const filled = [data.title, data.author, data.genre, $('pub-year').value, $('price').value, data.status].every(
      (v) => String(v).trim() !== ''
    );
    if (!filled) return showMsg('Please fill in all fields.', false);
    if (data.year < 1000 || data.year > new Date().getFullYear() + 1) return showMsg('Please enter a valid year.', false);
    if (Number.isNaN(data.price) || data.price < 0) return showMsg('Price must be 0 or more.', false);

    const editId = $('book-id').value ? Number($('book-id').value) : null;

    // some(): block duplicate titles
    if (books.some((b) => b.id !== editId && b.title.toLowerCase() === data.title.toLowerCase())) {
      return showMsg('This book is already in your library.', false);
    }

    if (editId !== null) {
      const index = books.findIndex((b) => b.id === editId); // findIndex()
      books[index] = { ...books[index], ...data }; // UPDATE
      showMsg('Book updated successfully.', true);
    } else {
      books.push({ id: Date.now(), ...data }); // CREATE
      showMsg('Book added successfully.', true);
    }
    persist();
    resetForm();
    refresh();
  });

  $('cancel-btn').addEventListener('click', () => {
    resetForm();
    msg.className = 'hidden';
  });

  // ---------- EDIT / DELETE (event delegation on the table) ----------
  rows.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = Number(btn.dataset.id);

    if (btn.dataset.action === 'edit') {
      const book = books.find((b) => b.id === id); // find()
      if (!book) return;
      $('book-id').value = book.id;
      $('title').value = book.title;
      $('author').value = book.author;
      $('genre').value = book.genre;
      $('pub-year').value = book.year;
      $('price').value = book.price;
      $('status').value = book.status;
      $('form-title').textContent = 'Edit book';
      $('submit-btn').textContent = 'Update Book';
      $('cancel-btn').classList.remove('hidden');
      msg.className = 'hidden';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
      $('title').focus();
    }

    if (btn.dataset.action === 'delete') {
      const book = books.find((b) => b.id === id);
      if (book && confirm(`Delete "${book.title}"?`)) {
        books = books.filter((b) => b.id !== id); // DELETE via filter()
        persist();
        refresh();
        showMsg('Book deleted.', true);
      }
    }
  });

  // ---------- filter controls ----------
  $('search').addEventListener('input', render);
  ['filter-genre', 'filter-status', 'sort-by'].forEach((id) => $(id).addEventListener('change', render));

  $('reset-filters').addEventListener('click', () => {
    $('search').value = '';
    $('filter-genre').value = 'all';
    $('filter-status').value = 'all';
    $('sort-by').value = 'title-asc';
    render();
  });

  $('restore-btn').addEventListener('click', () => {
    if (confirm('Replace all books with the sample data?')) {
      books = store.seed.map((b) => ({ ...b }));
      persist();
      refresh();
      showMsg('Sample data restored.', true);
    }
  });

  refresh();
});
