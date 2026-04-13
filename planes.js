const Planes = (function() {
  function init() {
    const buttons = document.querySelectorAll('.plan-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const planName = btn.dataset.plan;
        if (planName && typeof window.showSection === 'function') {
          window.showSection('contact');
          const msgField = document.getElementById('message');
          if (msgField) {
            msgField.value = `Hola, estoy interesado en el plan ${planName}. Me gustaría recibir más información.`;
          }
        }
      });
    });
  }
  return { init };
})();