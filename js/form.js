/* ================================================
   FORM.JS — Validação e Envio via AJAX (Formspree)
   ================================================ */

// ===== FUNÇÕES AUXILIARES =====

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 10 && cleaned.length <= 11;
}

function validateField(input) {
  const value = input.value.trim();
  const errorEl = input.parentElement.querySelector('.form-error');
  let isValid = true;
  let errorMsg = '';

  if (!value) {
    isValid = false;
    errorMsg = 'Este campo é obrigatório.';
  } else if (input.type === 'email' && !isValidEmail(value)) {
    isValid = false;
    errorMsg = 'Informe um e-mail válido.';
  } else if (input.name === 'telefone' && !isValidPhone(value)) {
    isValid = false;
    errorMsg = 'Informe um telefone válido.';
  }

  if (!isValid) {
    input.classList.add('error');
    if (errorEl) {
      errorEl.textContent = errorMsg;
      errorEl.classList.add('visible');
    }
  } else {
    input.classList.remove('error');
    if (errorEl) errorEl.classList.remove('visible');
  }

  return isValid;
}

// ===== INICIALIZAÇÃO =====

document.addEventListener('DOMContentLoaded', function () {

  // ----- Validação + envio AJAX -----
  var forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(function (form) {
    var inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    var submitBtn = form.querySelector('button[type="submit"]');
    var fieldsEl = form.querySelector('.form-fields');
    var successEl = form.querySelector('.form-success');

    // Validação em tempo real (ao sair do campo)
    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // sempre — envio via fetch

      // Valida todos os campos
      var isValid = true;
      inputs.forEach(function (input) {
        if (!validateField(input)) isValid = false;
      });

      if (!isValid) {
        var firstError = form.querySelector('input.error, textarea.error, select.error');
        if (firstError) firstError.focus();
        return;
      }

      // --- Envio via fetch ---
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      fetch('https://formspree.io/f/mzdkdzrw', {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
      .then(function (response) {
        if (response.ok) {
          // Sucesso: esconde o formulário, exibe mensagem
          if (fieldsEl) fieldsEl.style.display = 'none';
          if (successEl) {
            successEl.innerHTML =
              '<svg viewBox="0 0 24 24" style="width:56px;height:56px;stroke:var(--color-accent);fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;margin-bottom:12px">' +
                '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>' +
              '</svg>' +
              '<h3 style="margin-bottom:8px">Mensagem enviada com sucesso!</h3>' +
              '<p style="margin-bottom:24px">Obrigado pelo contato. Retornaremos em breve.</p>' +
              '<button class="btn btn-primary" id="btn-nova-msg-' + form.id + '">Enviar nova mensagem</button>';
            successEl.classList.add('visible');
            successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Botão "nova mensagem": restaura o formulário
            var btnNova = document.getElementById('btn-nova-msg-' + form.id);
            if (btnNova) {
              btnNova.addEventListener('click', function () {
                form.reset();
                inputs.forEach(function (input) {
                  input.classList.remove('error');
                  var err = input.parentElement.querySelector('.form-error');
                  if (err) err.classList.remove('visible');
                });
                successEl.classList.remove('visible');
                successEl.innerHTML = '';
                if (fieldsEl) fieldsEl.style.display = '';
                if (submitBtn) {
                  submitBtn.disabled = false;
                  submitBtn.textContent = 'Enviar Mensagem';
                }
              });
            }
          }
        } else {
          // Erro HTTP do Formspree
          showFormError(form, submitBtn);
        }
      })
      .catch(function () {
        showFormError(form, submitBtn);
      });
    });
  });

  function showFormError(form, submitBtn) {
    var existing = form.querySelector('.form-send-error');
    if (!existing) {
      var errDiv = document.createElement('p');
      errDiv.className = 'form-send-error';
      errDiv.style.cssText = 'color:#e74c3c;font-size:0.9rem;margin-top:12px;text-align:center';
      errDiv.textContent = 'Erro ao enviar a mensagem. Por favor, tente novamente.';
      var submitBtn2 = form.querySelector('button[type="submit"]');
      if (submitBtn2) submitBtn2.insertAdjacentElement('afterend', errDiv);
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
    }
  }

  // ----- Máscara de telefone -----
  var phoneInputs = document.querySelectorAll('input[name="telefone"]');
  phoneInputs.forEach(function (input) {
    input.addEventListener('input', function (e) {
      var value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      if (value.length <= 10) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
      } else {
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
      }
      e.target.value = value;
    });
  });

});

// Estilo de animação (spin — caso necessário em loading futuro)
var spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } } .spin { animation: spin 0.8s linear infinite; }';
document.head.appendChild(spinStyle);
