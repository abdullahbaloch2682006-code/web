document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const btn = document.getElementById('menu-btn');
  const menu = document.getElementById('mobile-menu');
  if (btn && menu) {
    btn.addEventListener('click', () => {
      const open = menu.classList.toggle('hidden') === false;
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Password show/hide
  document.querySelectorAll('[data-toggle-password]').forEach((b) => {
    b.addEventListener('click', () => {
      const input = document.getElementById(b.dataset.togglePassword);
      input.type = input.type === 'password' ? 'text' : 'password';
      b.textContent = input.type === 'password' ? 'Show' : 'Hide';
    });
  });

  const setAlert = (box, ok, text) => {
    box.className = 'mt-4 rounded-lg p-4 text-sm ' + (ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800');
    box.textContent = text;
  };

  // Sign In / Sign Up (client-side demo validation)
  const validateForm = (formId, alertId, extra) => {
    const form = document.getElementById(formId);
    const box = document.getElementById(alertId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const error = extra ? extra(form) : null;
      if (!form.checkValidity() || error) {
        setAlert(box, false, error || 'Please fill in all required fields correctly.');
        return;
      }
      setAlert(box, true, 'Success! (Demo only: no backend is connected.)');
      form.reset();
    });
  };
  validateForm('signin-form', 'signin-alert');
  validateForm('signup-form', 'signup-alert', (f) =>
    f.password.value !== f.confirm.value ? 'Passwords do not match.' : null
  );

  // Newsletter (demo)
  const news = document.getElementById('newsletter-form');
  if (news) {
    const box = document.getElementById('newsletter-alert');
    news.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!news.checkValidity()) return setAlert(box, false, 'Please enter a valid email address.');
      setAlert(box, true, 'Thanks for subscribing to the Vincenzo newsletter!');
      news.reset();
    });
  }

  // Contact form -> Formspree
  const contact = document.getElementById('contact-form');
  if (contact) {
    const box = document.getElementById('contact-alert');
    contact.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!contact.checkValidity()) return setAlert(box, false, 'Please fill in all required fields correctly.');
      try {
        const res = await fetch(contact.action, {
          method: 'POST',
          body: new FormData(contact),
          headers: { Accept: 'application/json' },
        });
        if (!res.ok) throw new Error('Request failed');
        setAlert(box, true, 'Thank you! Your message has been sent.');
        contact.reset();
      } catch (err) {
        setAlert(box, false, 'Something went wrong. Please try again later.');
      }
    });
  }
});
