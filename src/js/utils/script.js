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
} from '../utils/utils.js';
import { formValidate } from './form/form.js';

// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  // row input
  const rowInput = document.querySelector('.input-row');
  if (rowInput) {
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
    document.documentElement.setAttribute(
      'style',
      `--percentValue: ${percentValue}%`
    );
  }

  // show header
  if (window.scrollY >= 50) {
    document.documentElement.classList.add('_header-scroll');
    document.documentElement.classList.add('_header-show');
  }

  // header search
  const searchInput = document.querySelector('.header__search-input');
  if (searchInput) {
    searchInput.addEventListener('focusin', function () {
      if (!document.documentElement.classList.contains('_search-box-opened')) {
        document.documentElement.classList.add('_search-box-opened');
        if (window.innerWidth <= 768 && bodyLockStatus) {
          setTimeout(() => {
            document
              .querySelector('.search-box__content')
              .prepend(searchInput.parentElement);
          }, 0);
          bodyLock();
        }
      }
    });
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
  }

  // inputs w number values
  const numberInputs = document.querySelectorAll('[data-numbers-only]');
  if (numberInputs.length) {
    numberInputs.forEach(numberInput => {
      if (numberInput.dataset.numbersOnly === '1') numberInput.value = '1';
      numberInput.addEventListener('input', function () {
        if (!/\d+/.test(numberInput.value)) numberInput.value = '';
      });
    });
  }

  // relocate dom elements
  const relocateDOMElements = (array, parent, target) => {
    if (array.length) {
      array.forEach(item =>
        item.closest(parent).querySelector(target).appendChild(item)
      );
    }
  };
  relocateDOMElements(
    document.querySelectorAll(
      '.catalog__card.menu-product-card_list-view .menu-product-card__heart-btn'
    ),
    '.catalog__card',
    '.menu-product-card__actions'
  );
  relocateDOMElements(
    document.querySelectorAll(
      '.catalog__card.menu-product-card_list-view .menu-product-card__badges'
    ),
    '.catalog__card',
    '.menu-product-card__preview'
  );
  if (window.innerWidth <= 768) {
    // relocateDOMElements(
    //   document.querySelectorAll(
    //     '.menu-product-card_grid-view .menu-product-card__heart-btn'
    //   ),
    //   '.menu-product-card_grid-view',
    //   '.menu-product-card__actions'
    // );
    // relocateDOMElements(
    //   document.querySelectorAll(
    //     '.menu-product-card_grid-view .menu-product-card__badges'
    //   ),
    //   '.menu-product-card_grid-view',
    //   '.menu-product-card__preview'
    // );
    relocateDOMElements(
      document.querySelectorAll('.order-card__label'),
      '.order-card',
      '.order-card__group_s'
    );
    relocateDOMElements(
      document.querySelectorAll('.order-product-card__quantity'),
      '.order-product-card',
      '.order-product-card__group'
    );
    relocateDOMElements(
      document.querySelectorAll('.order-product-card__price-wrap'),
      '.order-product-card',
      '.order-product-card__group'
    );
  }

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
      if (filter.checked) {
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

    if (target && target.closest('.filters .checkbox__input')) {
      addTag(
        target.closest('.filters .checkbox__input'),
        target.closest('.filters .checkbox__input').nextElementSibling.innerHTML
      );
    } else if (!target) {
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
            removeActiveClasses();
          }
          if (target.closest('[data-sublink-index]')) {
            removeActiveClasses();
            target.closest('[data-sublink-index]').classList.add('_active');
            document
              .querySelector(
                `[data-subnav-index="${
                  target.closest('[data-sublink-index]').dataset.sublinkIndex
                }"]`
              )
              .classList.add('_active');
            document
              .querySelector('.header .header-catalog__stock-card')
              .classList.add('_hidden');
          }
        });
      }
    }
  };
  initCatalogNav();

  // cart
  if (document.getElementById('check-all-items')) {
    const checkAllChx = document.querySelector('#check-all-items input');

    checkAllChx.addEventListener('change', function () {
      const checkboxes = document.querySelectorAll(
        '.cart-item__checkbox input'
      );

      if (checkboxes.length) {
        checkboxes.forEach(checkbox => {
          if (checkAllChx.checked) {
            checkboxes.forEach(checkbox => (checkbox.checked = true));
          } else {
            checkboxes.forEach(checkbox => (checkbox.checked = false));
          }
        });
      }
    });
  }

  // handler functions
  const onClickHandler = e => {
    const target = e.target;

    // console.log(target);

    if (window.innerWidth <= 768) {
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
      if (document.querySelector('.user-avatar__inner')) {
        setActiveClass(
          e,
          '.user-avatar__inner',
          '.user-avatar__wrap',
          '_active',
          true
        );
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

    if (target.closest('.promocode-order-info__btn')) {
      target.closest('.promocode-order-info').classList.add('_active');
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
    if (target.closest('.sublist-filters__options .option__input')) {
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
    if (target.closest('#close-filters-btn')) {
      document.documentElement.classList.remove('_filters-visible');
      bodyUnlock();
    }
    if (target.closest('.tags-catalog__remove-btn-icon')) {
      const tag = target.closest('.tags-catalog__item');
      const checkedInputs = document.querySelectorAll(
        `[data-filter-text="${tag.dataset.tagText}"] input`
      );
      checkedInputs.forEach(checkedInput => (checkedInput.checked = false));

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
    if (target.closest('.heart-btn')) {
      target.closest('.heart-btn').classList.toggle('_active');
      e.preventDefault();
    }
    if (
      document.documentElement.classList.contains('_search-box-opened') &&
      !target.closest('.header__search')
    ) {
      document.documentElement.classList.remove('_search-box-opened');
    }
    if (
      target.closest('.menu-bar__link') &&
      !target.closest('.menu-bar__link').hasAttribute('data-open-account-menu')
    ) {
      removeClasses(document.querySelectorAll('.menu-bar__item'), '_active');
      target.closest('.menu-bar__item').classList.add('_active');
    }
    if (target.closest('.tab')) {
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

  // document events
  document.addEventListener('click', onClickHandler);
});

window.addEventListener('load', function () {
  // show page body
  document.body.style.opacity = 1;
});
