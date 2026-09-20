document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav__toggle');
  const right = document.querySelector('.nav__right');
  if (toggle && right) {
    toggle.addEventListener('click', () => {
      const open = right.classList.toggle('nav__right--open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach((link) => {
    if (link.getAttribute('href') === current) {
      link.classList.add('nav__link--active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // Theme toggle. Uses the same "lightMode" key the original site used.
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    const root = document.documentElement;
    const sync = () => themeBtn.setAttribute('aria-pressed', String(root.dataset.theme === 'light'));
    sync();
    themeBtn.addEventListener('click', () => {
      const next = root.dataset.theme === 'light' ? 'dark' : 'light';
      root.dataset.theme = next;
      try { localStorage.setItem('lightMode', next); } catch (e) {}
      sync();
      window.dispatchEvent(new Event('themechange'));
    });
  }
});
