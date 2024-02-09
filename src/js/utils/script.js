// node modules
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';

// utils
import {
  removeClasses,
  bodyLock,
  bodyUnlock,
  bodyLockStatus,
  setActiveClass,
  menuClose,
} from '../utils/utils.js';
import { formValidate } from './form/form.js';

// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  // user pass fields
  if (
    document.querySelectorAll(
      '.form-personal-data-account__group_pass .input__field'
    ).length
  ) {
    document
      .querySelectorAll('.form-personal-data-account__group_pass .input__field')
      .forEach(inp => {
        inp.addEventListener('input', function () {
          inp.value = inp.value.replace(' ', '');
        });
      });
  }

  // timer
  const initTimer = (el, minutes, btn) => {
    const elTxt = el.innerHTML;

    let timeInSecs;
    let ticker;

    function tick() {
      let secs = timeInSecs;
      if (secs > 0) {
        timeInSecs--;
      } else {
        clearInterval(ticker);
        btn.removeAttribute('disabled');
        setTimeout(() => {
          el.innerHTML = elTxt;
        }, 0);
        if (el.closest('._init-countdown')) {
          el.closest('._init-countdown').classList.remove('_init-countdown');
        }
        // startTimer(Number(minutes) * 60);
      }

      const mins = Math.floor(secs / 60);
      secs %= 60;
      const pretty =
        (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

      el.innerHTML = pretty;
    }
    function startTimer(secs) {
      timeInSecs = parseInt(secs);
      ticker = setInterval(tick, 1000);
    }
    startTimer(Number(minutes) * 60);
  };

  // user avatar
  if (document.querySelector('.user-avatar__input')) {
    const parent = document.querySelector('.personal-data-account__head-inner');
    const image = document.querySelector('.user-avatar__image');
    const inp = document.querySelector('.user-avatar__input');

    const readURL = input => {
      if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
          const size = Math.round(input.files[0].size / 1000);
          input.value = '';

          // check size
          if (size > 500) {
            parent.classList.add('_error');
          } else if (size <= 500) {
            image.src = e.target.result;
            parent.classList.remove('_error');
          }
        };

        reader.readAsDataURL(input.files[0]);
      }
    };

    inp.addEventListener('input', function () {
      readURL(this);
    });
    document.addEventListener('click', function (e) {
      if (
        e.target.closest('[data-remove-avatar-btn]') &&
        !parent.classList.contains('_error')
      ) {
        e.preventDefault();
        image.src = image.dataset.src;
      }
      if (e.target.closest('[data-upload-avatar-btn]')) {
        inp.click();
      }
    });
  }

  // magnifier
  const initMagnifier = () => {
    const magnifier = document.getElementById('magnifier');
    const item = document.getElementById('magnifier-el');
    const asideItem = document.getElementById('magnifier-img');
    const handleMousemove = e => {
      let { width, height } = item.getBoundingClientRect();
      let xAxis = (e.offsetX / width) * 100;
      let yAxis = (e.offsetY / height) * 100;
      magnifier.style.top = `${e.clientY - magnifier.offsetHeight / 2}px`;
      magnifier.style.left = `${e.clientX - magnifier.offsetWidth / 2}px`;
      asideItem.style.transform = `translate(-${xAxis}%, -${yAxis}%)`;
      magnifier.parentElement.classList.add('_show-magnifier');
    };
    const handleMouseleave = () => {
      magnifier.parentElement.classList.remove('_show-magnifier');
    };
    if (item && asideItem && magnifier) {
      item.addEventListener('mousemove', handleMousemove, false);
      item.addEventListener('mouseleave', handleMouseleave);
    }
  };
  initMagnifier();

  // row input
  const rowInputs = document.querySelectorAll('.input-row');
  if (rowInputs.length) {
    rowInputs.forEach(rowInput => {
      const inputs = rowInput.querySelectorAll('input');

      inputs.forEach((input, index) => {
        input.addEventListener('keyup', function () {
          const value = input.value;
          const curIndex = Number(input.dataset.index);
          const nextIndex = curIndex + 1;
          const prevIndex = curIndex - 1;

          if (value.length === 1 && nextIndex !== inputs.length + 1) {
            rowInput.querySelector(`[data-index="${nextIndex}"]`).focus();
          } else if (!value.length && prevIndex !== 0) {
            rowInput.querySelector(`[data-index="${prevIndex}"]`).focus();
          }
        });
      });
    });
  }

  // date input
  const dateInp = document.querySelector('.input_date input');
  if (dateInp) {
    dateInp.addEventListener('input', function () {
      if (!/\d+/.test(dateInp.value)) dateInp.value = '';
    });
    dateInp.addEventListener('keyup', function (e) {
      if (e.keyCode < 47 || e.keyCode > 57) {
        e.preventDefault();
      }

      const len = dateInp.value.length;

      if (len !== 1 || len !== 3) {
        if (dateInp.keyCode == 47) {
          dateInp.preventDefault();
        }
      }

      if (len === 2) {
        dateInp.value += '.';
      }

      if (len === 5) {
        dateInp.value += '.';
      }
    });
  }

  // datepicker
  const dp = document.querySelector('[data-dp]')
    ? new AirDatepicker('[data-dp]', {
        visible: true,
        showOtherMonths: false,
        selectOtherMonths: false,
        container: document.querySelector('[data-dp]').parentElement,
        monthsField: 'months',
        inline: true,
        autoClose: true,
        navTitles: {
          days: '<span class="air-datepicker-nav--text" data-show-months>MMMM</span> <span class="air-datepicker-nav--text" data-show-years>yyyy</span>',
          months:
            '<span class="air-datepicker-nav--text _active" data-show-months>MMMM</span> <span class="air-datepicker-nav--text" data-show-years>yyyy</span>',
          years:
            '<span class="air-datepicker-nav--text" data-show-months>MMMM</span> <span class="air-datepicker-nav--text _active" data-show-years>yyyy</span>',
        },
        prevHtml:
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14 18L6 10L14 2" stroke="#303033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        nextHtml:
          '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 2L14 10L6 18" stroke="#303033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        position({ $datepicker }) {
          $datepicker.style.top = `calc(100% + 0.8rem)`;
        },
        onSelect: () => {
          document
            .querySelector('[data-dp]')
            .parentElement.classList.remove('_form-error');

          document.querySelector('[data-dp]').classList.remove('_form-error');
          document
            .querySelector('[data-dp]')
            .parentElement.classList.add('_filled');
        },
      })
    : null;
  if (document.querySelector('[data-dp]')) {
    dp.$customContainer.addEventListener('click', function (e) {
      const target = e.target;

      if (target.closest('[data-dp-btn]')) {
        if (!dp.$customContainer.classList.contains('_dp-show')) {
          dp.$customContainer.classList.add('_dp-show');
        } else {
          dp.$customContainer.classList.remove('_dp-show');
        }
      }
    });
  }

  // cashback status
  let cashSum = document.querySelector('[data-cash-sum]');
  let totalCashSum = document.querySelector('[data-total-cash-sum]');
  if (cashSum && totalCashSum) {
    const cashSumVal = Number(cashSum.dataset.cashSum);
    const totalCashSumVal = Number(totalCashSum.dataset.totalCashSum);
    const percentValue = 100 - (cashSumVal / totalCashSumVal) * 100;

    cashSum.innerHTML = `${cashSumVal}`;
    totalCashSum.innerHTML = `${totalCashSumVal}`;
    document
      .querySelector('.wrapper')
      .setAttribute('style', `--percentValue: ${percentValue}%`);
  }

  // show header
  if (window.scrollY >= 50) {
    document.documentElement.classList.add('_header-scroll');
    document.documentElement.classList.add('_header-show');
  }

  // header search
  const searchInput = document.querySelector('.header__search-input');
  const initSearchInp = () => {
    if (window.innerWidth > 768) {
      searchInput.addEventListener('focusin', function () {
        if (
          !document.documentElement.classList.contains('_search-box-opened')
        ) {
          document.documentElement.classList.add('_search-box-opened');
        }
      });
    }
    searchInput.addEventListener('input', function () {
      if (searchInput.querySelector('input').value.length) {
        if (!searchInput.closest('form').classList.contains('_filled')) {
          searchInput.closest('form').classList.add('_filled');
        }
      } else {
        if (searchInput.closest('form').classList.contains('_filled')) {
          searchInput.closest('form').classList.remove('_filled');
        }
      }
    });
    searchInput.closest('form').addEventListener('submit', function () {
      if (document.documentElement.classList.contains('_search-box-opened')) {
        document.documentElement.classList.remove('_search-box-opened');
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            document
              .querySelector('.header__search')
              .appendChild(searchInput.parentElement);
          }, 0);

          bodyUnlock();
        }
      }
      if (searchInput.closest('form').classList.contains('_filled')) {
        searchInput.closest('form').classList.remove('_filled');
      }
      searchInput.querySelector('input').blur();
    });
  };
  if (searchInput) {
    initSearchInp();
    window.addEventListener('resize', initSearchInp);
  }

  // inputs w number values
  const handleNumbersOnlyInputs = () => {
    const numberInputs = document.querySelectorAll('[data-numbers-only]');
    if (numberInputs.length) {
      numberInputs.forEach(numberInput => {
        if (numberInput.dataset.numbersOnly === '1') numberInput.value = '1';
        numberInput.addEventListener('input', function () {
          // if (!/\d+/.test(numberInput.value)) numberInput.value = '';
          this.value = this.value.replace(/[^0-9]/g, '');
        });
      });
    }
  };
  handleNumbersOnlyInputs();

  // replace dom elements
  const dynamicDOM = () => {
    const dynamicElements = document.querySelectorAll('[data-dom-replace]');
    if (dynamicElements.length) {
      dynamicElements.forEach(dynamicElement => {
        const params = dynamicElement.dataset.domReplace.trim().split(',');
        const parent = dynamicElement.closest(`${params[2]}`);
        const container = dynamicElement.closest(`${params[0]}`);
        console.log(`${params[2]}`);
        const target = parent.querySelector(`${params[1]}`);

        const moveElements = () => {
          if (window.innerWidth <= 768) {
            target.append(dynamicElement);
          } else {
            container.append(dynamicElement);
          }
        };
        moveElements();

        window.addEventListener('resize', moveElements);
      });
    }
  };
  dynamicDOM();

  // show filters selections
  const setSelections = target => {
    const targetElement = document.querySelector('.tags-catalog__list');
    const addTag = (filter, filterTxt) => {
      const tagBody = `
      <span class="tags-catalog__text txt">${filterTxt}</span>
      <button type="button" class="tags-catalog__remove-btn"><img src="./img/icons/cross.svg" alt="" class="tags-catalog__remove-btn-icon" /></button>
    `;
      if (
        filter.checked &&
        !document.querySelector(
          `.tags-catalog__list [data-tag-text="${filterTxt}"]`
        )
      ) {
        const tag = document.createElement('div');
        tag.classList.add('tags-catalog__item');
        tag.setAttribute('data-tag-text', filterTxt);
        tag.innerHTML = tagBody;
        targetElement.appendChild(tag);
      } else if (!filter.checked) {
        targetElement.removeChild(
          targetElement.querySelector(`[data-tag-text="${filterTxt}"]`)
        );
      }
    };

    if (target) {
      if (target.closest('.filters .checkbox__input')) {
        addTag(
          target.closest('.filters .checkbox__input'),
          target.closest('.filters .checkbox__input').nextElementSibling
            .innerHTML
        );
      }
    } else {
      const checkboxes = document.querySelectorAll(
        '.filters .checkbox__input[checked]'
      );
      if (checkboxes.length) {
        checkboxes.forEach(checkbox => {
          addTag(checkbox, checkbox.nextElementSibling.innerHTML);
        });
      }
    }
  };
  setSelections();
  const filters = document.querySelectorAll('.filters .checkbox');
  const setFiltersAttributes = arr => {
    arr.forEach(item =>
      item.setAttribute(
        'data-filter-text',
        item.querySelector('.checkbox__text').innerHTML
      )
    );
  };
  if (filters.length) {
    setFiltersAttributes(filters);
  }

  // header catalog
  const initCatalogNav = () => {
    if (document.querySelector('.header__catalog')) {
      if (window.innerWidth > 768) {
        document.addEventListener('mouseover', function (e) {
          const target = e.target;

          const removeActiveClasses = () => {
            removeClasses(
              document.querySelectorAll('[data-subnav-index]'),
              '_active'
            );
            removeClasses(
              document.querySelectorAll('[data-sublink-index]'),
              '_active'
            );
          };

          if (target.closest('.header__catalog')) {
            document.documentElement.classList.add('_show-catalog');
          } else {
            document.documentElement.classList.remove('_show-catalog');
            document
              .querySelector('.header .header-catalog__stock-card')
              .classList.remove('_hidden');
            document.querySelectorAll('[data-sublink-index]');

            removeClasses(
              document.querySelectorAll('[data-sublink-index]'),
              '_inactive'
            );
            removeActiveClasses();
          }

          if (target.closest('[data-sublink-index]')) {
            removeActiveClasses();
            target.closest('[data-sublink-index]').classList.add('_active');

            const activeSublink = document.querySelector(
              `[data-subnav-index="${
                target.closest('[data-sublink-index]').dataset.sublinkIndex
              }"]`
            );

            activeSublink.classList.add('_active');
            activeSublink.classList.remove('_inactive');

            document
              .querySelectorAll('[data-sublink-index]')
              .forEach(sublink => {
                if (!sublink.classList.contains('_active')) {
                  sublink.classList.add('_inactive');
                }
              });

            document
              .querySelector('.header .header-catalog__stock-card')
              .classList.add('_hidden');
          }
        });
      }
    }
  };
  initCatalogNav();

  const hideHeaderSearch = () => {
    document.documentElement.classList.remove('_search-box-opened');
    setTimeout(() => {
      document
        .querySelector('.header__search')
        .appendChild(searchInput.parentElement);
    }, 0);
    bodyUnlock();
  };

  // cart checkboxes
  if (
    document.querySelectorAll('.products-cart__body .checkbox__input').length
  ) {
    const checkboxes = document.querySelectorAll(
      '.cart-item__checkbox .checkbox__input'
    );
    const checkAllChx = document.querySelector(
      '#check-all-items .checkbox__input'
    );
    const removeBtn = document.querySelector('.products-cart__remove-btn');
    const checkAllCheckboxes = () => {
      checkboxes.forEach(checkbox => {
        if (checkAllChx.checked || checkAllChx.hasAttribute('checked')) {
          checkbox.checked = true;
          checkbox.classList.add('_checked');
          removeBtn.removeAttribute('disabled');
        } else {
          checkbox.checked = false;
          checkbox.classList.remove('_checked');
          removeBtn.setAttribute('disabled', '');
        }
      });
    };
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function () {
        if (checkbox.checked) {
          checkbox.closest('.checkbox').classList.add('_checked');
        } else {
          checkbox.closest('.checkbox').classList.remove('_checked');
        }
        if (document.querySelector('.checkbox._checked')) {
          removeBtn.removeAttribute('disabled');
        } else {
          removeBtn.setAttribute('disabled', '');
        }
      });
    });
    checkAllChx.addEventListener('change', checkAllCheckboxes);

    checkAllCheckboxes();
  }

  // choose store
  const setChoosenStore = () => {
    if (
      document.querySelectorAll('.choose-store-modal__options .option input')
        .length
    ) {
      document
        .querySelectorAll('.choose-store-modal__options .option input')
        .forEach(option => {
          const txt = option.closest('.option').dataset.optTxt;
          const target = document.getElementById('choosen-store');
          const setStore = () => {
            if (target.closest('.select-store')) {
              target.closest('.select-store').classList.add('_choosen');
            }
            if (target.closest('.choose-store-banner')) {
              target.closest('.choose-store-banner').classList.add('_choosen');
            }
            if (target.closest('.step-purchase-checkout_shipping')) {
              target
                .closest('.step-purchase-checkout_shipping')
                .classList.add('_choosen');
            }

            if (option.checked) {
              target.innerHTML = txt;
            }
          };

          option.addEventListener('change', setStore);
        });
    }
  };
  setChoosenStore();

  // handler functions
  const onClickHandler = e => {
    const target = e.target;

    // console.log(target);

    if (window.innerWidth <= 768) {
      // if (document.querySelector('.user-avatar__inner')) {
      //   setActiveClass(
      //     e,
      //     '.user-avatar__inner',
      //     '.user-avatar__wrap',
      //     '_active',
      //     true
      //   );
      // }
      if (bodyLockStatus && target.closest('.hero-product__image-wrap')) {
        document.documentElement.classList.add('_fullscreen-image');
        bodyLock();
      }
      if (bodyLockStatus && target.closest('.fullscreen-image__close-btn')) {
        document.documentElement.classList.remove('_fullscreen-image');
        bodyUnlock();
      }
      if (
        target.closest(
          '.mainpage_not-logged-in .header__menu .menu__link_profile'
        )
      ) {
        document.documentElement.classList.remove('_menu-opened');
      }
      if (
        bodyLockStatus &&
        target.closest('.mainpage_not-logged-in #loginModal .modal__close')
      ) {
        bodyUnlock();
      }
      if (
        bodyLockStatus &&
        target.closest('.header__search-input') &&
        !document.documentElement.classList.contains('_search-box-opened')
      ) {
        document.documentElement.classList.add('_search-box-opened');
        setTimeout(() => {
          document
            .querySelector('.search-box__content')
            .prepend(searchInput.parentElement);
        }, 0);
        bodyLock();
      }
      if (bodyLockStatus && target.closest('[data-open-account-menu]')) {
        bodyLock();
        document.documentElement.classList.add('_show-account-menu');
        if (document.documentElement.classList.contains('_menu-opened')) {
          document.documentElement.classList.remove('_menu-opened');
        }
      }
      if (bodyLockStatus && target.closest('[data-close-account-menu]')) {
        bodyUnlock();
        document.documentElement.classList.remove('_show-account-menu');
      }
      if (target.closest('#show-navbar-btn')) {
        target.closest('.account-page__group').classList.add;
      }
      if (
        document.querySelector('.account-page__group._visible-dropdown') &&
        (target.closest('#show-navbar-btn') ||
          !target.closest('.account-page__group'))
      ) {
        document
          .querySelector('.account-page__group._visible-dropdown')
          .classList.remove('_visible-dropdown');
      } else if (
        !document.querySelector('.account-page__group._visible-dropdown') &&
        target.closest('#show-navbar-btn')
      ) {
        target
          .closest('.account-page__group')
          .classList.add('_visible-dropdown');
      }
    }
    if (document.querySelector('[data-dp]')) {
      if (
        (!target.closest('[data-dp-btn]') &&
          !target.closest('.air-datepicker') &&
          !target.closest('.air-datepicker-nav--title') &&
          !target.closest('.air-datepicker-nav--text')) ||
        target.closest('.air-datepicker-cell.-day-')
      ) {
        dp.$customContainer.classList.remove('_dp-show');
      }
      if (
        !target.closest('[data-dp-parent]') &&
        document.querySelector('[data-dp-parent]._focused')
      ) {
        document
          .querySelector('[data-dp-parent]._focused')
          .classList.remove('_focused');
      }
      if (target.closest('[data-show-months]')) {
        if (dp.currentView === 'months') {
          dp.setCurrentView('months');
        } else {
          dp.setCurrentView('days');
        }
      }
      if (target.closest('[data-show-years]')) {
        if (dp.currentView === 'years') {
          dp.setCurrentView('days');
        } else {
          dp.setCurrentView('years');
        }
      }
    }

    if (target.closest('.reg-warning__close-btn')) {
      target.closest('.reg-warning').classList.add('_hidden');
    }
    if (target.closest('[data-start-countdown-btn]')) {
      const countdown = target.parentElement.querySelector('[data-countdown]');
      const button = target.closest('[data-start-countdown-btn]');
      button.setAttribute('disabled', '');
      initTimer(countdown, countdown.dataset.countdown, button);
      button.parentElement.classList.add('_init-countdown');
    }
    if (target.closest('.promocode-order-info__clear-btn')) {
      document.querySelector('.promocode-order-info__input input').value = '';
    }
    if (target.closest('.promocode-order-info__btn')) {
      document.querySelector('.order-info__promocode').classList.add('_active');
    }
    if (target.closest('a._disabled')) {
      e.preventDefault();
    }
    if (target.closest('[data-verify-btn]')) {
      const parent = target.closest('[data-modal-parent]');
      const inputs = parent.querySelectorAll('.input-row__input input');
      const values = [];

      if (inputs.length) {
        inputs.forEach(input => {
          if (input.value.length) values.push(input.value);
        });
      }
      if (values.length < 4)
        parent.querySelector('.input-row').classList.add('_error');
    }
    if (target.closest('#remove-checked-items')) {
      document
        .querySelector('.products-cart__remove-btn')
        .setAttribute('disabled', '');
      if (
        document.querySelectorAll('.cart-item__checkbox input:checked').length
      ) {
        document
          .querySelectorAll('.cart-item__checkbox input:checked')
          .forEach(checkbox => {
            checkbox.checked = false;
          });
      }
      if (document.querySelector('#check-all-items input').checked) {
        document.querySelector('#check-all-items input').checked = false;
      }
    }
    if (target.closest('.cart-btn') || target.closest('.heart-btn')) {
      e.preventDefault();
      target.closest('button').classList.toggle('_active');
    }
    if (target.closest('.test__option')) {
      if (document.querySelector('.test__btn').hasAttribute('disabled')) {
        document.querySelector('.test__btn').removeAttribute('disabled');
      }
    }
    if (target.closest('.navbar-account-page__link')) {
      removeClasses(
        document.querySelectorAll('.navbar-account-page__link'),
        '_active'
      );
      target.closest('.navbar-account-page__link').classList.add('_active');
    }
    if (
      document.querySelector('.user-cashback._active') &&
      (target.closest('.user-cashback__value') ||
        !target.closest('.user-cashback'))
    ) {
      document
        .querySelector('.user-cashback._active')
        .classList.remove('_active');
    } else if (
      !document.querySelector('.user-cashback._active') &&
      target.closest('.user-cashback__value')
    ) {
      target.closest('.user-cashback').classList.add('_active');
    }
    if (
      target.closest('.actions-header__item_account') &&
      window.innerWidth > 768
    ) {
      e.preventDefault();
    }
    if (target.closest('.show-all-btn')) {
      target.closest('.info-product__tab-body').classList.toggle('_show-all');
    }
    if (target.closest('.characteristics__show-all-btn')) {
      target.closest('.characteristics').classList.toggle('_show-all');
    }
    if (target.closest('.header-catalog__arr-btn')) {
      target.closest('.header-catalog__subnav').classList.remove('_active');
    }
    if (
      window.innerWidth <= 768 &&
      target.closest('.header-catalog__sublinks-item')
    ) {
      e.preventDefault();
      removeClasses(
        document.querySelectorAll('[data-subnav-index]'),
        '_active'
      );
      document
        .querySelector(
          `[data-subnav-index="${
            target.closest('.header-catalog__sublinks-item').dataset
              .sublinkIndex
          }"]`
        )
        .classList.add('_active');
    }
    if (target.closest('.menu__link_catalog') && bodyLockStatus) {
      document.documentElement.classList.add('_show-catalog');
      document.documentElement.classList.remove('_menu-opened');
      bodyLock();
    }
    if (target.closest('.header-catalog__close-btn') && bodyLockStatus) {
      e.stopPropagation();
      document.documentElement.classList.remove('_show-catalog');
      removeClasses(
        document.querySelectorAll('[data-subnav-index]'),
        '_active'
      );
      bodyUnlock();
    }
    if (target.closest('#close-search-btn')) {
      document.documentElement.classList.remove('_search-box-opened');
      setTimeout(() => {
        document
          .querySelector('.header__search')
          .appendChild(searchInput.parentElement);
      }, 0);
      bodyUnlock();
    }
    if (
      target.closest('.sublist-filters__options .option__input') &&
      !document.querySelector('.favorite-page')
    ) {
      const targetEl = document.querySelector('.filters__sort-btn');
      targetEl.innerHTML = target.closest(
        '.sublist-filters__options .option__input'
      ).nextElementSibling.innerHTML;
    }
    if (target.closest('[data-sl-btn]')) {
      target.closest('[data-sl-parent]').classList.add('_sublist-opened');
    }
    if (target.closest('[data-close-sl-btn]')) {
      target.closest('[data-sl-parent]').classList.remove('_sublist-opened');
    }
    if (target.closest('#open-filters-btn') && bodyLockStatus) {
      document.documentElement.classList.add('_filters-visible');
      bodyLock();
    }
    if (target.closest('[data-close-filters-btn]')) {
      document.documentElement.classList.remove('_filters-visible');
      bodyUnlock();
    }
    if (target.closest('.tags-catalog__remove-btn-icon')) {
      const Form = document.getElementById('filter-form');
      const tag = target.closest('.tags-catalog__item');
      const checkedInputs = document.querySelectorAll(
        `[data-filter-text="${tag.dataset.tagText}"] input`
      );
      checkedInputs.forEach(checkedInput => {
        checkedInput.checked = false;
        checkedInput.removeAttribute('checked');
        checkedInput.value = '';

        if (Form) {
          const event = new Event('change');
          Form.dispatchEvent(event);
        }
      });

      tag.remove();
    }
    if (target.closest('.filters .checkbox__input')) {
      setSelections(
        target.closest('.filters .checkbox__input'),
        target.closest('.filters .checkbox__input').parentElement.dataset
          .filterTxt
      );
    }
    if (target.closest('[data-clean-form-btn]')) {
      formValidate.formClean(target.closest('form'));
      document.querySelector('.tags-catalog__list').innerHTML = '';
    }
    if (target.closest('.filters__show-all-btn')) {
      target.closest('.filters__form').classList.toggle('_show-all-filters');
    }
    if (target.closest('.filters__showmore-btn') && window.innerWidth > 768) {
      const parent = target.closest('.filters__group');

      if (parent) {
        parent.classList.toggle('_show-all-options');
      }
    }
    if (
      document.documentElement.classList.contains('_search-box-opened') &&
      !target.closest('.header__search')
    ) {
      hideHeaderSearch();
    }
    if (
      target.closest('.menu-bar__link') &&
      !target
        .closest('.menu-bar__link')
        .hasAttribute('data-open-account-menu') &&
      !target.closest('.menu-bar__link').dataset.modal
    ) {
      removeClasses(document.querySelectorAll('.menu-bar__item'), '_active');
      target.closest('.menu-bar__item').classList.add('_active');
    }
    if (
      target.closest('.tab') &&
      !target.closest('.categories-catalog__item')
    ) {
      removeClasses(document.querySelectorAll('.tab'), '_active');
      target.closest('.tab').classList.add('_active');
    }
    if (target.closest('.hero-product__option')) {
      removeClasses(
        document.querySelectorAll('.hero-product__option'),
        '_active'
      );
      target.closest('.hero-product__option').classList.add('_active');
    }
    if (target.closest('.view-catalog__btn')) {
      removeClasses(document.querySelectorAll('.view-catalog__btn'), '_active');
      target.closest('.view-catalog__btn').classList.add('_active');
    }
  };
  const onMouseOverHandler = e => {
    const target = e.target;

    if (target.closest('.header-subnav__sublink')) {
      removeClasses(
        document.querySelectorAll('.header-subnav__sublink'),
        '_active'
      );
      document.querySelectorAll('.header-subnav__sublink').forEach(sublink => {
        sublink.classList.remove('_active');
        sublink.classList.add('_inactive');
      });
      target.closest('.header-subnav__sublink').classList.remove('_inactive');
      target.closest('.header-subnav__sublink').classList.add('_active');
    } else {
      if (document.querySelector('.header-subnav__sublink._active')) {
        document
          .querySelector('.header-subnav__sublink._active')
          .classList.remove('_active');
        removeClasses(
          document.querySelectorAll('.header-subnav__sublink'),
          '_inactive'
        );
      }
    }
  };

  // document events
  document.addEventListener('click', onClickHandler);
  document.addEventListener('mouseover', onMouseOverHandler);
  // window events
  window.addEventListener('resize', function () {
    if (document.documentElement.classList.contains('_search-box-opened')) {
      hideHeaderSearch();
    }
    if (window.innerWidth > 768) {
      if (
        bodyLockStatus &&
        document.documentElement.classList.contains('_show-account-menu')
      ) {
        document.documentElement.classList.remove('_show-account-menu');
        bodyUnlock();
      }
      if (
        bodyLockStatus &&
        document.documentElement.classList.contains('_show-catalog')
      ) {
        document.documentElement.classList.remove('_show-catalog');
        bodyUnlock();
      }
      if (
        bodyLockStatus &&
        document.documentElement.classList.contains('_filters-visible')
      ) {
        document.documentElement.classList.remove('_filters-visible');
        bodyUnlock();
      }
      if (
        bodyLockStatus &&
        document.documentElement.classList.contains('_fullscreen-image')
      ) {
        document.documentElement.classList.remove('_fullscreen-image');
        bodyUnlock();
      }
    }
  });
});

window.addEventListener('load', function () {
  // show page body
  document.body.style.opacity = 1;
});
