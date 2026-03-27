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

    // Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (isValid) {
        simulateSubmit(form, successMsg);
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

  function simulateSubmit(form, successMsg) {
    const submitBtn = form.querySelector('[type="submit"]');
    if (submitBtn) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        Enviando...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        form.reset();

        // Mostrar mensagem de sucesso
        if (successMsg) {
          form.querySelector('.form-fields')
            ? (form.querySelector('.form-fields').style.display = 'none')
            : null;
          successMsg.classList.add('visible');
          successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });

          setTimeout(() => {
            successMsg.classList.remove('visible');
            const fields = form.querySelector('.form-fields');
            if (fields) fields.style.display = '';
          }, 5000);
        }
      }, 1500);
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
