import * as noUiSlider from 'nouislider';
import wNumb from '../../libs/wNumb.min';

// styles
import '../../../scss/libs/range-slider.scss';

// --------------------------------------------------------------------------

export function rangeInit() {
  const rangeSlider = document.getElementById('range-slider');
  noUiSlider.create(rangeSlider, {
    start: 400,
    connect: [true, false],
    tooltips: wNumb({ decimals: 0, suffix: '₽' }),
    range: {
      min: [0],
      max: [1200],
    },
  });

  const rangeInp = document.getElementById('range-input');
  if (rangeInp) {
    const maxVal = rangeSlider.noUiSlider.options.range.max[0];
    rangeInp.addEventListener('input', function () {
      rangeSlider.noUiSlider.set([rangeInp.value, null]);
      if (Number(rangeInp.value) > maxVal) {
        rangeInp.value = maxVal;
      }
    });
    rangeSlider.noUiSlider.on('change', function () {
      rangeInp.value = wNumb({ decimals: 0 }).to(
        Number(rangeSlider.noUiSlider.get())
      );
    });
  }
}
if (document.getElementById('range-slider')) {
  rangeInit();
}
