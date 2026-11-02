# Vincenzo – Book Website (Semantic HTML + Tailwind CSS)

Web Technologies – Assignment 01

Vincenzo is a five-page responsive website about books, written in semantic HTML5 and styled with Tailwind CSS.

## Pages
- Home – `index.html`
- About – `src/pages/about.html`
- Contact – `src/pages/contact.html`
- Sign In – `src/pages/signin.html`
- Sign Up – `src/pages/signup.html`

## Folder Structure
```
vincenzo/
├── index.html
├── README.md
├── assets/
│   ├── favicon.svg
│   └── js/ (main.js, storage.js, library.js, discover.js)
└── src/
    └── pages/
        ├── about.html
        ├── contact.html
        ├── signin.html
        ├── signup.html
        ├── library.html
        └── discover.html
```

## Semantic HTML used
header, nav (with aria-label), main, section (with aria-labelledby), article, aside, figure / figcaption,
blockquote / cite, address, time, data, dl / dt / dd, details / summary, fieldset / legend, label, meter, ol / ul, small, mark.

## New additions (Evaluation 2)
- **Task 1 – Library (`src/pages/library.html`)**: CRUD app using an array of objects saved in `localStorage`.
  Search/filter/sort uses `filter`, `includes`, `some`, `sort`, `map`, `reduce`, `find`, `findIndex`, `every`.
- **Task 2 – Discover (`src/pages/discover.html`)**: data from the free Open Library JSON API using `axios.get()`.
- Shared helper: `assets/js/storage.js`.

## Contact Form (Formspree)
1. Create a form at https://formspree.io and copy its ID.
2. In `src/pages/contact.html` replace `YOUR_FORM_ID` in the form `action`.

## Deploy
Push to GitHub, then Settings > Pages > Deploy from branch (main, / root).
