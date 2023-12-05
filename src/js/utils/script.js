import {
  removeClasses,
  bodyLock,
  bodyUnlock,
  bodyLockStatus,
} from '../utils/utils.js';
import { formValidate } from './form/form.js';

window.addEventListener('load', function () {
  // show page body
  document.body.style.opacity = 1;
});

document.addEventListener('DOMContentLoaded', function () {
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
    relocateDOMElements(
      document.querySelectorAll(
        '.catalog__card.menu-product-card_grid-view .menu-product-card__heart-btn'
      ),
      '.catalog__card',
      '.menu-product-card__actions'
    );
    relocateDOMElements(
      document.querySelectorAll(
        '.catalog__card.menu-product-card_grid-view .menu-product-card__badges'
      ),
      '.catalog__card',
      '.menu-product-card__preview'
    );
  }

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
              .querySelector('.header-catalog__advertising')
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
              .querySelector('.header-catalog__advertising')
              .classList.add('_hidden');
          }
        });
      }
    }
  };
  initCatalogNav();

  // handler functions
  const onClickHandler = e => {
    const target = e.target;

    // console.log(target);

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
    if (target.closest('.heart-btn__icon')) {
      target.closest('.heart-btn__icon').classList.toggle('_active');
      e.preventDefault();
    }
    if (
      document.documentElement.classList.contains('_search-box-opened') &&
      !target.closest('.header__search')
    ) {
      document.documentElement.classList.remove('_search-box-opened');
    }
    if (target.closest('.menu-bar__item')) {
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
