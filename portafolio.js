const Portfolio = (function() {
  const slides = [
    {img:'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',title:'Estrategia Digital',desc:'Campañas que convierten en WhatsApp & Facebook'},
    {img:'https://images.pexels.com/photos/1181271/pexels-photo-1181271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',title:'WhatsApp Business API',desc:'Automatización y atención al cliente 24/7'},
    {img:'https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',title:'Facebook & Instagram Ads',desc:'Segmentación avanzada, remarketing y creatividad'},
    {img:'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',title:'Branding Premium',desc:'Identidad visual que destaca en redes sociales'},
    {img:'https://images.pexels.com/photos/3184419/pexels-photo-3184419.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',title:'Contenido Creativo',desc:'Videos y gráficos para Facebook e historias'},
    {img:'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',title:'Analítica Avanzada',desc:'Reportes en tiempo real y optimización de ROI'}
  ];

  let currentIndex = 0;
  let autoInterval = null;
  let progInterval = null;
  const DELAY = 4500;

  let carousel, prevBtn, nextBtn, progBar;

  function renderSlides() {
    if (!carousel) return;
    carousel.innerHTML = '';
    slides.forEach((s) => {
      const div = document.createElement('div');
      div.className = 'poster';
      div.innerHTML = `<img src="${s.img}" alt="${s.title}" onerror="this.src='https://placehold.co/1000x550/1a1a1a/D4AF37?text=${encodeURIComponent(s.title)}'">
        <div class="poster-info"><h2>${s.title}</h2><p>${s.desc}</p></div>`;
      carousel.appendChild(div);
    });
    updateClasses();
  }

  function updateClasses() {
    const posters = document.querySelectorAll('.poster');
    posters.forEach((p, i) => {
      p.classList.remove('active', 'prev', 'next');
      if (i === currentIndex) p.classList.add('active');
      else if (i === (currentIndex - 1 + slides.length) % slides.length) p.classList.add('prev');
      else if (i === (currentIndex + 1) % slides.length) p.classList.add('next');
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateClasses();
    resetAuto();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateClasses();
    resetAuto();
  }

  function startAuto() {
    if (!progBar) return;
    let progress = 0;
    progBar.style.width = '0%';
    progInterval = setInterval(() => {
      progress += 100 / (DELAY / 100);
      progBar.style.width = progress + '%';
      if (progress >= 100) progress = 0;
    }, 100);
    autoInterval = setInterval(() => {
      nextSlide();
    }, DELAY);
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

  function pause() {
    stopAuto();
  }

  function resume() {
    if (!autoInterval) {
      startAuto();
    }
  }

  function init() {
    carousel = document.getElementById('carousel');
    prevBtn = document.getElementById('prevBtn');
    nextBtn = document.getElementById('nextBtn');
    progBar = document.getElementById('prog');

    if (!carousel) return;

    renderSlides();
    startAuto();

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  }

  return {
    init,
    pause,
    resume,
    next: nextSlide,
    prev: prevSlide
  };
})();