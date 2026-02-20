/* DailyPrep Website — main.js */

const THEME_KEY = 'dp-theme';
const LANG_KEY  = 'dp-lang';

// ---- THEME ----
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  updateThemeImages(theme);
}

function updateThemeImages(theme) {
  document.querySelectorAll('[data-light][data-dark]').forEach(img => {
    img.src = theme === 'dark' ? img.dataset.dark : img.dataset.light;
  });
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || getSystemTheme();
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ---- LANGUAGE ----
function getCurrentLang() {
  const p = window.location.pathname;
  if (p.includes('/ru/') || /\/ru(\/|$)/.test(p)) return 'ru';
  return 'en';
}

function getCurrentPage() {
  const p = window.location.pathname;
  if (p.includes('support'))  return 'support';
  if (p.includes('privacy'))  return 'privacy';
  return 'index';
}

function switchLanguage(lang) {
  const page = getCurrentPage();
  const file = page === 'index' ? 'index.html' : `${page}.html`;
  localStorage.setItem(LANG_KEY, lang);
  window.location.href = `../${lang}/${file}`;
}

// ---- MOBILE MENU ----
function initMobileMenu() {
  const btn  = document.querySelector('.menu-btn');
  const menu = document.querySelector('.mobile-menu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
}

// ---- FAQ ACCORDION ----
function initFAQ() {
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

// ---- SCROLL REVEAL ----
function initReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

// ---- STICKY NAV SHADOW ----
function initNav() {
  const nav = document.querySelector('.nav-header');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10 ? 'var(--shadow-sm)' : 'none';
  }, { passive: true });
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Theme
  const savedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(savedTheme || getSystemTheme());

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
  });

  // Language selectors
  const currentLang = getCurrentLang();
  localStorage.setItem(LANG_KEY, currentLang);
  document.querySelectorAll('.lang-select').forEach(sel => {
    sel.value = currentLang;
    sel.addEventListener('change', e => switchLanguage(e.target.value));
  });

  // Modules
  initMobileMenu();
  initFAQ();
  initReveal();
  initNav();

  // Respond to OS theme changes (only when no explicit preference saved)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(THEME_KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });
});
