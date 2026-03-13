(function() {
  'use strict';

  const THEME_KEY = 'theme';
  const THEME_STYLE_KEY = 'themeStyle';
  const DEFAULT_THEME = 'light';
  const DEFAULT_THEME_STYLE = 'standard';

  const state = {
    theme: DEFAULT_THEME,
    themeStyle: DEFAULT_THEME_STYLE,
    mobileMenuOpen: false
  };

  const elements = {
    html: document.documentElement,
    body: document.body,
    themeToggle: document.getElementById('themeToggle'),
    themeToggleMobile: document.getElementById('themeToggleMobile'),
    themeStyle: document.getElementById('themeStyle'),
    themeStyleMobile: document.getElementById('themeStyleMobile'),
    menuToggle: document.getElementById('menuToggle'),
    mobileMenu: document.getElementById('mobileMenu'),
    navLinks: document.querySelectorAll('.mobile-nav-link'),
    serviceButtons: document.querySelectorAll('.service-card .btn-full'),
    ctaButtons: document.querySelectorAll('.cta-buttons .btn'),
    heroButtons: document.querySelectorAll('.hero-buttons .btn')
  };

  function loadPreferences() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const savedStyle = localStorage.getItem(THEME_STYLE_KEY);

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      state.theme = savedTheme;
    }

    if (savedStyle && (savedStyle === 'standard' || savedStyle === 'highcontrast')) {
      state.themeStyle = savedStyle;
    }

    applyTheme();
  }

  function applyTheme() {
    if (state.theme === 'dark') {
      elements.html.classList.add('dark');
    } else {
      elements.html.classList.remove('dark');
    }

    elements.html.classList.remove('theme-standard', 'theme-highcontrast');
    elements.html.classList.add(`theme-${state.themeStyle}`);

    localStorage.setItem(THEME_KEY, state.theme);
    localStorage.setItem(THEME_STYLE_KEY, state.themeStyle);

    updateMetaThemeColor();
  }

  function updateMetaThemeColor() {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      if (state.themeStyle === 'highcontrast') {
        metaThemeColor.setAttribute('content', state.theme === 'dark' ? '#FFFFFF' : '#000000');
      } else {
        metaThemeColor.setAttribute('content', state.theme === 'dark' ? '#1F2937' : '#E63946');
      }
    }
  }

  function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme();
  }

  function setThemeStyle(style) {
    if (style === 'standard' || style === 'highcontrast') {
      state.themeStyle = style;
      applyTheme();
      updateThemeStyleSelects();
    }
  }

  function updateThemeStyleSelects() {
    elements.themeStyle.value = state.themeStyle;
    elements.themeStyleMobile.value = state.themeStyle;
  }

  function toggleMobileMenu() {
    state.mobileMenuOpen = !state.mobileMenuOpen;
    if (state.mobileMenuOpen) {
      elements.mobileMenu.classList.remove('hidden');
      elements.menuToggle.classList.add('active');
    } else {
      elements.mobileMenu.classList.add('hidden');
      elements.menuToggle.classList.remove('active');
    }
  }

  function closeMobileMenu() {
    state.mobileMenuOpen = false;
    elements.mobileMenu.classList.add('hidden');
    elements.menuToggle.classList.remove('active');
  }

  function handleNavLinkClick() {
    closeMobileMenu();
  }

  function handleServiceClick(event) {
    const button = event.target.closest('.btn-full');
    if (!button) return;

    const card = button.closest('.service-card');
    const title = card.querySelector('.service-title').textContent;
    const price = card.querySelector('.service-price').textContent;

    showNotification(`Plan "${title}" seleccionado - ${price}`);
  }

  function handleCtaClick(event) {
    event.preventDefault();
    const href = event.target.getAttribute('href');
    if (href) {
      window.open(href, '_blank');
    }
  }

  function handleHeroButtonClick(event) {
    const button = event.target;
    if (button.textContent.includes('Ver Planes')) {
      document.getElementById('servicios').scrollIntoView({ behavior: 'smooth' });
    } else if (button.textContent.includes('Conocer Más')) {
      document.getElementById('ventajas').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      background: #1f2937;
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 0.75rem;
      box-shadow: 0 8px 25px rgba(0,0,0,0.4);
      z-index: 2000;
      max-width: 24rem;
      border-left: 4px solid #E63946;
      font-weight: 500;
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = 'slideOut 0.3s ease-out';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  function addNotificationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function setupEventListeners() {
    elements.themeToggle.addEventListener('click', toggleTheme);
    elements.themeToggleMobile.addEventListener('click', toggleTheme);
    elements.themeStyle.addEventListener('change', (e) => setThemeStyle(e.target.value));
    elements.themeStyleMobile.addEventListener('change', (e) => setThemeStyle(e.target.value));
    elements.menuToggle.addEventListener('click', toggleMobileMenu);

    elements.navLinks.forEach(link => {
      link.addEventListener('click', handleNavLinkClick);
    });

    elements.serviceButtons.forEach(button => {
      button.addEventListener('click', handleServiceClick);
    });

    elements.ctaButtons.forEach(button => {
      button.addEventListener('click', handleCtaClick);
    });

    elements.heroButtons.forEach(button => {
      button.addEventListener('click', handleHeroButtonClick);
    });

    document.addEventListener('click', (e) => {
      if (state.mobileMenuOpen && !e.target.closest('.header')) {
        closeMobileMenu();
      }
    });
  }

  function init() {
    addNotificationStyles();
    loadPreferences();
    setupEventListeners();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
