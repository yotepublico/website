// portfolio.js
(function(global){
  const slides=[
    {img:'https://i.ibb.co/5gF8Ps57/IMG-20260127-WA0039.jpg'},
    {img:'https://i.ibb.co/wNT0Scps/IMG-20260127-WA0038.jpg'},
    {img:'https://i.ibb.co/CK2wtGHd/image-1770834657256.jpg'},
    {img:'https://i.ibb.co/FLW1s4Y8/image-1770738205218.jpg'},
    {img:'https://i.ibb.co/9HpFkMq7/image-1769807257258.jpg'},
    {img:'https://i.ibb.co/NbvhVYq/20260128-122719.jpg'},
    {img:'#'},
  ];
  let carousel,prevBtn,nextBtn,progBar,currentIndex=0,autoInterval=null,progInterval=null;
  const DELAY=4500;
  function renderSlides(){
    if(!carousel)return;
    carousel.innerHTML='';
    slides.forEach(s=>{const d=document.createElement('div');d.className='poster';d.innerHTML=`<img src="${s.img}" alt="" onerror="this.src='https://placehold.co/1200x800/1e293b/d946ef?text=YOTEPUBLICO'">`;carousel.appendChild(d);});
    updateClasses();
  }
  function updateClasses(){
    const posters=document.querySelectorAll('.poster');
    posters.forEach((p,i)=>{p.classList.remove('active','prev','next');if(i===currentIndex)p.classList.add('active');else if(i===(currentIndex-1+slides.length)%slides.length)p.classList.add('prev');else if(i===(currentIndex+1)%slides.length)p.classList.add('next');});
  }
  function nextSlide(){currentIndex=(currentIndex+1)%slides.length;updateClasses();resetAuto();}
  function prevSlide(){currentIndex=(currentIndex-1+slides.length)%slides.length;updateClasses();resetAuto();}
  function startAuto(){
    if(!progBar)return;
    let p=0;
    progBar.style.width='0%';
    progInterval=setInterval(()=>{p+=100/(DELAY/100);progBar.style.width=Math.min(p,100)+'%';},100);
    autoInterval=setInterval(()=>nextSlide(),DELAY);
  }
  function stopAuto(){if(autoInterval)clearInterval(autoInterval);if(progInterval)clearInterval(progInterval);if(progBar)progBar.style.width='0%';autoInterval=progInterval=null;}
  function resetAuto(){stopAuto();startAuto();}

  // Función para pantalla completa
  function enableFullscreenOnClick(){
    if(!carousel) return;
    carousel.addEventListener('click', (e) => {
      // Buscar el elemento imagen dentro del poster activo
      const activePoster = carousel.querySelector('.poster.active');
      if (!activePoster) return;
      const img = activePoster.querySelector('img');
      if (!img) return;
      
      // Verificar si el clic fue sobre la imagen o el poster (pero no sobre controles)
      const isImageOrPoster = e.target.closest('.poster');
      if (!isImageOrPoster) return;

      // Solicitar pantalla completa para la imagen
      if (img.requestFullscreen) {
        img.requestFullscreen();
      } else if (img.webkitRequestFullscreen) {
        img.webkitRequestFullscreen();
      } else if (img.msRequestFullscreen) {
        img.msRequestFullscreen();
      } else {
        // Fallback: abrir la imagen en una nueva pestaña
        window.open(img.src, '_blank');
      }
    });
  }

  global.PortfolioCarousel={
    init(){
      carousel=document.getElementById('carousel');
      prevBtn=document.getElementById('prevBtn');
      nextBtn=document.getElementById('nextBtn');
      progBar=document.getElementById('prog');
      if(!carousel)return;
      renderSlides();
      startAuto();
      if(prevBtn)prevBtn.addEventListener('click',prevSlide);
      if(nextBtn)nextBtn.addEventListener('click',nextSlide);
      enableFullscreenOnClick();
    },
    pause:stopAuto,
    resume(){if(!autoInterval)startAuto();},
    next:nextSlide,
    prev:prevSlide
  };
})(window);