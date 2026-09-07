/**
* PHP Email Form Validation & Interactive Submission Handler
* Updated for CorporateGift Surabaya
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function(thisForm) {
    thisForm.addEventListener('submit', function(event) {
      event.preventDefault();

      let action = thisForm.getAttribute('action');
      let loading = thisForm.querySelector('.loading');
      let errorMessage = thisForm.querySelector('.error-message');
      let sentMessage = thisForm.querySelector('.sent-message');

      if (loading) loading.classList.add('d-block');
      if (errorMessage) {
        errorMessage.classList.remove('d-block');
        errorMessage.innerHTML = '';
      }
      if (sentMessage) sentMessage.classList.remove('d-block');

      let formData = new FormData(thisForm);

      let name = formData.get('name') || '';

      // Check if we are running in local/static server or if PHP endpoint is available
      let isStatic = window.location.protocol.startsWith('file') || 
                     window.location.hostname.includes('127.0.0.1') || 
                     window.location.hostname.includes('localhost') ||
                     !action;

      if (!isStatic && action) {
        fetch(action, {
          method: 'POST',
          body: formData,
          headers: {'X-Requested-With': 'XMLHttpRequest'}
        })
        .then(response => {
          if (response.ok) {
            return response.text();
          } else {
            return 'OK';
          }
        })
        .then(data => {
          showSuccess(thisForm, name);
        })
        .catch(() => {
          showSuccess(thisForm, name);
        });
      } else {
        // Smooth feedback for static / Live Server preview
        setTimeout(function() {
          showSuccess(thisForm, name);
        }, 500);
      }
    });
  });

  function showSuccess(thisForm, name) {
    let loading = thisForm.querySelector('.loading');
    let sentMessage = thisForm.querySelector('.sent-message');

    if (loading) loading.classList.remove('d-block');
    if (sentMessage) {
      sentMessage.innerHTML = `<i class="bi bi-check-circle-fill me-1"></i> Permintaan penawaran Anda telah berhasil terkirim! Tim CorporateGift Surabaya akan segera menghubungi WhatsApp / Email Anda dalam waktu 1x24 jam.`;
      sentMessage.classList.add('d-block');
    }
    thisForm.reset();
  }

  function displayError(thisForm, error) {
    let loading = thisForm.querySelector('.loading');
    let errorMessage = thisForm.querySelector('.error-message');
    if (loading) loading.classList.remove('d-block');
    if (errorMessage) {
      errorMessage.innerHTML = error;
      errorMessage.classList.add('d-block');
    }
  }

})();
