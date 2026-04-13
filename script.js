const sections = {
  gallery: document.getElementById('gallery'),
  plans: document.getElementById('plans'),
  contact: document.getElementById('contact')
};
const navItems = document.querySelectorAll('.nav-item');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');
const logo = document.querySelector('.logo');

function showSection(sectionId) {
  Object.values(sections).forEach(s => s.classList.remove('active'));
  sections[sectionId].classList.add('active');

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === sectionId);
  });

  navMenu.classList.remove('open');

  if (sectionId === 'gallery') {
    if (typeof Portfolio !== 'undefined' && Portfolio.resume) Portfolio.resume();
  } else {
    if (typeof Portfolio !== 'undefined' && Portfolio.pause) Portfolio.pause();
  }
}

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const section = item.dataset.section;
    if (section) showSection(section);
  });
});

logo.addEventListener('click', () => showSection('gallery'));

mobileToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.appbar') && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof Portfolio !== 'undefined' && Portfolio.init) {
    Portfolio.init();
  }
  if (typeof Planes !== 'undefined' && Planes.init) {
    Planes.init();
  }
  if (typeof Contacto !== 'undefined' && Contacto.init) {
    Contacto.init();
  }

  const activeSection = document.querySelector('.section.active')?.id;
  if (activeSection !== 'gallery' && typeof Portfolio !== 'undefined' && Portfolio.pause) {
    Portfolio.pause();
  }
});

window.showSection = showSection;