(function () {
  'use strict';

  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progBar = document.getElementById('prog');
  const progressContainer = document.querySelector('.progress');
  const navMenu = document.getElementById('navMenu');
  const mobileToggle = document.getElementById('mobileToggle');
  const logo = document.querySelector('.logo');
  const navItems = document.querySelectorAll('.nav-item');
  const appbar = document.querySelector('.appbar');
  const sections = {
    gallery: document.getElementById('gallery'),
    plans: document.getElementById('plans'),
    contact: document.getElementById('contact')
  };
  const adForm = document.getElementById('adForm');
  const messageTA = document.getElementById('message');
  const charCount = document.getElementById('charCount');
  const currentYearSpan = document.getElementById('currentYear');

  let slides = [];
  let currentIndex = 0;
  let autoInterval = null;
  let progInterval = null;
  const DELAY = 4800;

  async function loadPostersFromXML() {
    try {
      const response = await fetch('posters.xml');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'application/xml');
      const parseError = xmlDoc.querySelector('parsererror');
      if (parseError) throw new Error('XML inválido');
      const posterNodes = xmlDoc.querySelectorAll('poster');
      if (posterNodes.length === 0) throw new Error('No se encontraron posters');
      const extracted = [];
      posterNodes.forEach(node => {
        const src = node.getAttribute('src');
        if (src && src.trim()) {
          extracted.push({ src: src.trim() });
        }
      });
      if (extracted.length === 0) throw new Error('Sin URLs válidas');
      return extracted;
    } catch (err) {
      console.error('Error al cargar posters desde XML:', err.message);
      carousel.innerHTML = '<div class="carousel-error">Error al cargar los pósters</div>';
      return [];
    }
  }

  function renderCarousel() {
    if (!carousel || slides.length === 0) return;
    carousel.innerHTML = '';
    slides.forEach((slide, i) => {
      const div = document.createElement('div');
      div.className = 'poster';
      div.setAttribute('role', 'group');
      div.setAttribute('aria-roledescription', 'slide');
      div.setAttribute('aria-label', `Póster ${i + 1} de ${slides.length}`);
      div.innerHTML = `<img src="${slide.src}" alt="Póster promocional ${i + 1}" loading="${i === 0 ? 'eager' : 'lazy'}" onerror="this.parentElement.style.display='none'">`;
      carousel.appendChild(div);
    });
    updateClasses();
  }

  function getPosters() {
    return document.querySelectorAll('.poster');
  }

  function updateClasses() {
    const posters = getPosters();
    const len = slides.length;
    if (len === 0) return;
    posters.forEach((p, i) => {
      p.classList.remove('active', 'prev', 'next');
      if (i === currentIndex) p.classList.add('active');
      else if (i === (currentIndex - 1 + len) % len) p.classList.add('prev');
      else if (i === (currentIndex + 1) % len) p.classList.add('next');
    });
    if (progressContainer) {
      progressContainer.setAttribute('aria-valuenow', Math.round((currentIndex / len) * 100));
    }
  }

  function goToNext() {
    if (slides.length === 0) return;
    currentIndex = (currentIndex + 1) % slides.length;
    updateClasses();
    resetAuto();
  }

  function goToPrev() {
    if (slides.length === 0) return;
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateClasses();
    resetAuto();
  }

  function startAuto() {
    if (!progBar || slides.length === 0) return;
    stopAuto();
    let progress = 0;
    progBar.style.width = '0%';
    progInterval = setInterval(() => {
      progress += 100 / (DELAY / 100);
      progBar.style.width = Math.min(progress, 100) + '%';
    }, 100);
    autoInterval = setInterval(goToNext, DELAY);
  }

  function stopAuto() {
    if (autoInterval) clearInterval(autoInterval);
    if (progInterval) clearInterval(progInterval);
    if (progBar) progBar.style.width = '0%';
    autoInterval = null;
    progInterval = null;
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  function openInNewTab(url) {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function enableFullscreenOnClick() {
    if (!carousel) return;
    carousel.addEventListener('click', (e) => {
      const activePoster = carousel.querySelector('.poster.active');
      if (!activePoster) return;
      const img = activePoster.querySelector('img');
      if (!img) return;
      const clickedInsidePoster = e.target.closest('.poster');
      if (!clickedInsidePoster) return;
      if (img.requestFullscreen) {
        img.requestFullscreen().catch(() => openInNewTab(img.src));
      } else if (img.webkitRequestFullscreen) {
        img.webkitRequestFullscreen();
      } else if (img.msRequestFullscreen) {
        img.msRequestFullscreen();
      } else {
        openInNewTab(img.src);
      }
    });
  }

  function showSection(id) {
    Object.values(sections).forEach(s => s.classList.remove('active'));
    if (sections[id]) {
      sections[id].classList.add('active');
      sections[id].style.animation = 'none';
      sections[id].offsetHeight;
      sections[id].style.animation = '';
    }
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === id);
    });
    navMenu.classList.remove('open');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
    if (id === 'gallery') {
      startAuto();
    } else {
      stopAuto();
    }
    if (sections[id]) {
      sections[id].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function updateCharCount() {
    if (charCount && messageTA) {
      const remaining = 1500 - messageTA.value.length;
      charCount.textContent = messageTA.value.length;
      if (remaining < 100) {
        charCount.style.color = '#dc2626';
      } else if (remaining < 300) {
        charCount.style.color = '#f97316';
      } else {
        charCount.style.color = '';
      }
    }
  }

  function initCarouselListeners() {
    if (prevBtn) prevBtn.addEventListener('click', goToPrev);
    if (nextBtn) nextBtn.addEventListener('click', goToNext);
    document.addEventListener('keydown', (e) => {
      const galleryActive = sections.gallery.classList.contains('active');
      if (!galleryActive) return;
      if (e.key === 'ArrowLeft') { e.preventDefault(); goToPrev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); goToNext(); }
    });
    carousel.addEventListener('pointerenter', stopAuto);
    carousel.addEventListener('pointerleave', () => {
      if (sections.gallery.classList.contains('active')) startAuto();
    });
    let touchStartX = 0;
    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      stopAuto();
    }, { passive: true });
    carousel.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToNext();
        else goToPrev();
      }
      if (sections.gallery.classList.contains('active')) startAuto();
    });
  }

  function initNavigation() {
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const sectionId = item.dataset.section;
        if (sectionId) showSection(sectionId);
      });
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const sectionId = item.dataset.section;
          if (sectionId) showSection(sectionId);
        }
      });
    });

    if (logo) {
      logo.addEventListener('click', () => showSection('gallery'));
      logo.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showSection('gallery');
        }
      });
    }

    if (mobileToggle) {
      mobileToggle.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
      });
    }

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.appbar') && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        if (mobileToggle) mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
      }
    });
  }

  function initPlans() {
    document.querySelectorAll('.plan-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const plan = btn.dataset.plan;
        if (plan) {
          showSection('contact');
          if (messageTA) {
            messageTA.value = `Hola, estoy interesado en el plan "${plan}". Me gustaría recibir más información.`;
            updateCharCount();
            setTimeout(() => {
              messageTA.focus();
              messageTA.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 400);
          }
        }
      });
    });
  }

  function initContactForm() {
    if (!adForm || !messageTA) return;
    messageTA.addEventListener('input', updateCharCount);
    updateCharCount();
    adForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const message = messageTA.value.trim();
      if (!message) {
        messageTA.style.borderColor = '#dc2626';
        messageTA.style.boxShadow = '0 0 0 5px rgba(220,38,38,0.1)';
        messageTA.focus();
        setTimeout(() => {
          messageTA.style.borderColor = '';
          messageTA.style.boxShadow = '';
        }, 2000);
        alert('Por favor, describe tu anuncio antes de enviar.');
        return;
      }
      const subject = encodeURIComponent('Nueva solicitud de anuncio');
      const body = `Solicitud de publicación YOTEPUBLICO%0A%0AMensaje:%0A${encodeURIComponent(message)}%0A%0A--- Yo te publico ---`;
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=agencia.yotepublico@gmail.com&su=${subject}&body=${body}`,
        '_blank',
        'noopener,noreferrer'
      );
      alert('Se abrirá Gmail con tu mensaje. Gracias por confiar en YOTEPUBLICO.');
      adForm.reset();
      updateCharCount();
    });
  }

  function initFooter() {
    if (currentYearSpan) {
      currentYearSpan.textContent = new Date().getFullYear();
    }
  }

  function initAppbarScroll() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        appbar.classList.add('scrolled');
      } else {
        appbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  async function init() {
    initFooter();
    initPlans();
    initContactForm();
    initAppbarScroll();
    slides = await loadPostersFromXML();
    renderCarousel();
    initCarouselListeners();
    enableFullscreenOnClick();
    initNavigation();
    if (slides.length > 0) {
      startAuto();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();