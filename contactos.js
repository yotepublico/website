const Contacto = (function() {
  function init() {
    const fileInput = document.getElementById('files');
    const fileLabel = document.getElementById('fileLabel');
    const form = document.getElementById('adForm');

    if (fileInput && fileLabel) {
      fileInput.addEventListener('change', function() {
        const count = this.files.length;
        fileLabel.textContent = count ? `${count} archivo(s) seleccionado(s)` : '📎 Arrastra archivos o haz clic';
      });
    }

    if (form) {
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        const nombre = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const empresa = document.getElementById('company').value.trim();
        const mensaje = document.getElementById('message').value.trim();

        let body = `Solicitud Premium YOTEPUBLICO%0A%0A`;
        body += `👤 Nombre: ${nombre}%0A`;
        body += `📧 Email: ${email}%0A`;
        body += `🏢 Empresa: ${empresa || 'No especificada'}%0A%0A`;
        body += `📝 Mensaje:%0A${mensaje}%0A%0A`;
        body += `--- Plan seleccionado desde web ---`;

        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=agencia.yotepublico@gmail.com&su=${encodeURIComponent('Solicitud Premium - '+(empresa||nombre))}&body=${body}`, '_blank');
        alert('📬 Gmail abierto. Puedes adjuntar manualmente los archivos. ¡Gracias!');
        form.reset();
        if (fileLabel) fileLabel.textContent = '📎 Arrastra archivos o haz clic';
      });
    }
  }
  return { init };
})();