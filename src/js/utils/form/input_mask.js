import Inputmask from 'inputmask';

// --------------------------------------------------------------------------

const initInputmask = () => {
  const telInputCollection = document.querySelectorAll('[data-phone-mask]');

  if (telInputCollection.length) {
    telInputCollection.forEach(input => {
      Inputmask({
        mask: '+7 (999) 999-99-99',
        showMaskOnHover: false,
        jitMasking: true,
        onincomplete: function () {
          input.classList.add('_is-incomplete');
        },
        oncomplete: function () {
          input.classList.remove('_is-incomplete');
        },
      }).mask(input);
    });
  }
};
initInputmask();
