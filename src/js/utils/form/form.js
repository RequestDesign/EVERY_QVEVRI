import { modules } from '../../modules.js';

// --------------------------------------------------------------------------

// init form fields
export function formFieldsInit(options = { viewPass: false }) {
  const formFields = document.querySelectorAll(
    'input[placeholder],textarea[placeholder]'
  );
  if (formFields.length) {
    formFields.forEach(formField => {
      if (!formField.hasAttribute('data-placeholder-nohide')) {
        formField.dataset.placeholder = formField.placeholder;
      }
    });
  }
  document.body.addEventListener('focusin', function (e) {
    const targetElement = e.target;
    if (
      (targetElement.tagName === 'INPUT' &&
        targetElement.type !== 'file' &&
        targetElement.type !== 'checkbox' &&
        targetElement.type !== 'radio' &&
        !targetElement.closest('.quantity')) ||
      targetElement.tagName === 'TEXTAREA'
    ) {
      if (targetElement.dataset.placeholder) {
        targetElement.placeholder = '';
      }
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.add('_form-focus');
        targetElement.parentElement.classList.add('_form-focus');
      }
      if (targetElement.closest('.input')) {
        targetElement.closest('.input').classList.remove('_filled');
        formValidate.removeError(targetElement);
      } else if (targetElement.closest('.text-input')) {
        targetElement.closest('.text-input').classList.remove('_filled');
        formValidate.removeError(targetElement);
      }
      if (targetElement.closest('.input-row'))
        targetElement.closest('.input-row').classList.remove('_error');
    }
  });
  document.body.addEventListener('focusout', function (e) {
    const targetElement = e.target;
    if (
      (targetElement.tagName === 'INPUT' &&
        targetElement.type !== 'file' &&
        targetElement.type !== 'checkbox' &&
        targetElement.type !== 'radio' &&
        !targetElement.closest('.quantity')) ||
      targetElement.tagName === 'TEXTAREA'
    ) {
      if (targetElement.dataset.placeholder) {
        targetElement.placeholder = targetElement.dataset.placeholder;
      }
      if (!targetElement.hasAttribute('data-no-focus-classes')) {
        targetElement.classList.remove('_form-focus');
        targetElement.parentElement.classList.remove('_form-focus');
      }
      if (targetElement.hasAttribute('data-validate')) {
        formValidate.validateInput(targetElement);
      }
      if (targetElement.closest('.input_date')) {
        if (targetElement.value.length === 10) {
          targetElement.closest('.input_date').classList.add('_filled');
        } else if (targetElement.value.length < 10) {
          targetElement.value = '';
          targetElement.closest('.input_date').classList.remove('_filled');
        }
      } else if (targetElement.closest('.input_edit')) {
        if (!targetElement.value.length) {
          targetElement.value = targetElement.dataset.value;
        }
      } else {
        if (!targetElement.parentElement.classList.contains('_form-error')) {
          if (
            targetElement.closest('.input') &&
            !targetElement.closest('.input-row')
          ) {
            targetElement.closest('.input').classList.add('_filled');
          } else if (targetElement.closest('.text-input')) {
            targetElement.closest('.text-input').classList.remove('_filled');
            formValidate.removeError(targetElement);
          }
        }
      }
    }
  });

  if (options.viewPass) {
    document.addEventListener('click', function (e) {
      let targetElement = e.target;
      if (targetElement.closest('[class*="__viewpass"]')) {
        let inputType = targetElement.classList.contains('_viewpass-active')
          ? 'password'
          : 'text';
        targetElement.parentElement
          .querySelector('input')
          .setAttribute('type', inputType);
        targetElement.classList.toggle('_viewpass-active');
      }
    });
  }
}

// validation
export let formValidate = {
  getErrors(form) {
    let error = 0;
    let formRequiredItems = form.querySelectorAll('*[data-required]');
    if (formRequiredItems.length) {
      formRequiredItems.forEach(formRequiredItem => {
        if (
          (formRequiredItem.offsetParent !== null ||
            formRequiredItem.tagName === 'SELECT') &&
          !formRequiredItem.disabled
        ) {
          error += this.validateInput(formRequiredItem);
        }
      });
    }
    return error;
  },
  validateInput(formRequiredItem) {
    const oldPassInp = document.getElementById('old-pass');
    const newPassInp = document.getElementById('new-pass');
    const repeatPassInp = document.getElementById('repeat-pass');

    let error = 0;

    if (formRequiredItem.dataset.required === 'email') {
      formRequiredItem.value = formRequiredItem.value.replace(' ', '');
      if (this.emailTest(formRequiredItem)) {
        this.addError(formRequiredItem);
        error++;
      } else {
        this.removeError(formRequiredItem);
      }
    } else if (
      formRequiredItem.type === 'checkbox' &&
      !formRequiredItem.checked
    ) {
      this.addError(formRequiredItem);
      error++;
    } else if (
      formRequiredItem.type === 'tel' &&
      formRequiredItem.classList.contains('_is-incomplete')
    ) {
      this.addError(formRequiredItem);
      error++;
    } else {
      if (
        !formRequiredItem.value.trim() &&
        !formRequiredItem.hasAttribute('data-static')
      ) {
        formRequiredItem.dataset.error = 'Обязательное поле';
        this.addError(formRequiredItem);
        error++;
      } else if (formRequiredItem.dataset.validate === 'letters-only') {
        const pattern = /[0-9`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
        if (pattern.test(formRequiredItem.value)) {
          formRequiredItem.dataset.error = ``;
          this.addError(formRequiredItem);
          error++;
        }
      } else if (formRequiredItem.id === 'old-pass') {
        if (
          formRequiredItem.value &&
          !formRequiredItem.classList.contains('_form-error')
        ) {
          formRequiredItem.parentElement.classList.add('_verified');
          newPassInp.removeAttribute('disabled');
        } else {
          formRequiredItem.parentElement.classList.remove('_verified');
          newPassInp.parentElement.classList.remove('_verified');
          repeatPassInp.parentElement.classList.remove('_verified');
          newPassInp.setAttribute('disabled', '');
          repeatPassInp.setAttribute('disabled', '');
          newPassInp.value = '';
          repeatPassInp.value = '';
          this.removeError(newPassInp);
          this.removeError(repeatPassInp);
        }
      } else if (formRequiredItem.dataset.required === 'pass') {
        const passRegex =
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$@!%&*?])(.{6,})/;

        if (!passRegex.test(formRequiredItem.value)) {
          formRequiredItem.parentElement.classList.remove('_verified');
          repeatPassInp.parentElement.classList.remove('_verified');
          repeatPassInp.setAttribute('disabled', '');
          repeatPassInp.value = '';

          this.addError(formRequiredItem);
          this.removeError(repeatPassInp);
          error++;
        } else {
          formRequiredItem.parentElement.classList.add('_verified');
          repeatPassInp.removeAttribute('disabled');
        }
      } else if (formRequiredItem.id === 'repeat-pass') {
        if (
          formRequiredItem.value.trim() &&
          document.getElementById('new-pass').value !== formRequiredItem.value
        ) {
          formRequiredItem.dataset.error = 'Неверный пароль';
          formRequiredItem.parentElement.classList.remove('_verified');

          this.addError(formRequiredItem);
          error++;
        } else if (!formRequiredItem.value.trim()) {
          formRequiredItem.dataset.error = 'Обязательное поле';
          this.addError(formRequiredItem);
          error++;
        } else {
          formRequiredItem.parentElement.classList.add('_verified');
        }
      } else {
        this.removeError(formRequiredItem);
      }
    }
    return error;
  },
  addError(formRequiredItem) {
    formRequiredItem.classList.add('_form-error');
    formRequiredItem.parentElement.classList.add('_form-error');
    formRequiredItem.parentElement.classList.remove('_filled');
    let inputError =
      formRequiredItem.parentElement.querySelector('.form-error');
    if (inputError) formRequiredItem.parentElement.removeChild(inputError);
    if (formRequiredItem.dataset.error) {
      formRequiredItem.parentElement.insertAdjacentHTML(
        'beforeend',
        `<div class="form-error txt txt_16">${formRequiredItem.dataset.error}</div>`
      );
    }
    if (formRequiredItem.closest('.input_validate')) {
      formRequiredItem.closest('form').classList.add('_error');
    }
  },
  removeError(formRequiredItem) {
    formRequiredItem.classList.remove('_form-error');
    formRequiredItem.parentElement.classList.remove('_form-error');
    if (!formRequiredItem.closest('.input-row')) {
      formRequiredItem.parentElement.classList.add('_filled');
    }
    if (formRequiredItem.parentElement.querySelector('.form-error')) {
      formRequiredItem.parentElement.removeChild(
        formRequiredItem.parentElement.querySelector('.form-error')
      );
    }
    if (formRequiredItem.closest('.input_validate')) {
      formRequiredItem.closest('form').classList.remove('_error');
    }
  },
  formClean(form) {
    if (!form.hasAttribute('data-save-fields')) {
      form.reset();
      setTimeout(() => {
        let inputs = form.querySelectorAll('input,textarea');
        for (let index = 0; index < inputs.length; index++) {
          const el = inputs[index];
          el.parentElement.classList.remove('_form-focus');
          el.classList.remove('_form-focus');
          formValidate.removeError(el);
        }
        let checkboxes = form.querySelectorAll('.checkbox__input');
        if (checkboxes.length > 0) {
          for (let index = 0; index < checkboxes.length; index++) {
            const checkbox = checkboxes[index];
            checkbox.checked = false;
          }
        }
      }, 0);
    }
  },
  emailTest(formRequiredItem) {
    return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(
      formRequiredItem.value
    );
  },
};

// form submition
export function formSubmit(options = { validate: true }) {
  const forms = document.forms;
  if (forms.length) {
    for (const form of forms) {
      form.addEventListener('submit', function (e) {
        const form = e.target;
        formSubmitAction(form, e);
      });
      form.addEventListener('reset', function (e) {
        const form = e.target;
        formValidate.formClean(form);
      });
    }
  }
  async function formSubmitAction(form, e) {
    const error = !form.hasAttribute('data-no-validate')
      ? formValidate.getErrors(form)
      : 0;
    if (error === 0) {
      const ajax = form.hasAttribute('data-ajax');
      if (ajax) {
        e.preventDefault();
        const formAction = form.getAttribute('action')
          ? form.getAttribute('action').trim()
          : '#';
        const formMethod = form.getAttribute('method')
          ? form.getAttribute('method').trim()
          : 'GET';
        const formData = new FormData(form);

        form.classList.add('_sending');
        const response = await fetch(formAction, {
          method: formMethod,
          body: formData,
        });
        if (response.ok) {
          let responseResult = await response.json();
          form.classList.remove('_sending');
          formSent(form, responseResult);
        } else {
          alert('error');
          form.classList.remove('_sending');
        }
      } else if (form.hasAttribute('data-dev')) {
        // in development mode
        e.preventDefault();
        formSent(form);
      }
    } else {
      e.preventDefault();
      const formError = form.querySelector('._form-error');
      if (formError && form.hasAttribute('data-goto-error')) {
        gotoBlock(formError, true, 1000);
      }
    }
  }
  // actions after submitting the form
  function formSent(form, responseResult = ``) {
    // show popup, if popup module is connected and form has setting
    setTimeout(() => {
      if (modules.modal) {
        const modal = form.dataset.modalMessage;
        modal ? modules.modal.open(modal) : null;
      }
    }, 0);

    // form submit event
    document.dispatchEvent(
      new CustomEvent('formSent', {
        detail: {
          form: form,
        },
      })
    );
    // clean form
    formValidate.formClean(form);
  }
}

// quantity
export function formQuantity() {
  const qntInputs = document.querySelectorAll('.quantity');
  if (qntInputs.length) {
    qntInputs.forEach(qntInput => {
      const input = qntInput.querySelector('input');

      input.addEventListener('change', function () {
        if (/0$/.test(input.value)) input.value = '1';
      });
      input.addEventListener('focusout', function () {
        if (!input.value) {
          input.value = '1';
        }
      });
    });
  }
  document.addEventListener('click', function (e) {
    let targetElement = e.target;
    if (targetElement.closest('.quantity__button')) {
      let value = parseInt(
        targetElement.closest('.quantity').querySelector('input').value
      );
      if (targetElement.classList.contains('quantity__button_plus')) {
        value++;
      } else {
        --value;
        if (value < 1) value = 1;
      }
      targetElement.closest('.quantity').querySelector('input').value = value;
    }
  });
}
