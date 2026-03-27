/* ================================================
   FORM.JS — Validação de Formulários
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    const successMsg = form.querySelector('.form-success');

    // Validação em tempo real (ao sair do campo)
    inputs.forEach(input => {
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
          validateField(input);
        }
      });
    });

    // Submit — bloqueia apenas se inválido; se válido, submete ao Formspree
    form.addEventListener('submit', (e) => {
      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });

  function validateField(input) {
    const value = input.value.trim();
    const type = input.type;
    const errorEl = input.parentElement.querySelector('.form-error');
    let isValid = true;
    let errorMsg = '';

    // Campo vazio
    if (!value) {
      isValid = false;
      errorMsg = 'Este campo é obrigatório.';
    }
    // Email
    else if (type === 'email' && !isValidEmail(value)) {
      isValid = false;
      errorMsg = 'Informe um e-mail válido.';
    }
    // Telefone
    else if (input.name === 'telefone' && !isValidPhone(value)) {
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
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
    }

    return isValid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 11;
  }

  // ===== VERIFICAÇÃO ?enviado=true (retorno do Formspree) =====
  if (new URLSearchParams(window.location.search).get('enviado') === 'true') {
    const targetForm = document.querySelector('form[data-validate]');
    if (targetForm) {
      const fields = targetForm.querySelector('.form-fields');
      const success = targetForm.querySelector('.form-success');
      if (fields) fields.style.display = 'none';
      if (success) {
        success.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <h3>Mensagem enviada com sucesso!</h3>
          <p>Retornaremos em breve.</p>
          <button class="btn btn-primary" style="margin-top:16px" onclick="window.location.href=window.location.pathname">Enviar nova mensagem</button>
        `;
        success.classList.add('visible');
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }

  // ===== MÁSCARA DE TELEFONE =====
  const phoneInputs = document.querySelectorAll('input[name="telefone"]');
  phoneInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
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

// Estilo para ícone girando no loading
const spinStyle = document.createElement('style');
spinStyle.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 0.8s linear infinite;
  }
`;
document.head.appendChild(spinStyle);
