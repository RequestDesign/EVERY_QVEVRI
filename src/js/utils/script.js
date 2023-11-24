import { removeClasses } from '../utils/utils.js';
import { formValidate } from './form/form.js';

window.addEventListener('load', function () {
  // show page body
  document.body.style.opacity = 1;
});

document.addEventListener('DOMContentLoaded', function () {
  // header search
  const searchInput = document.querySelector('.header__search-input');
  if (searchInput) {
    searchInput.addEventListener('focusin', function () {
      document.documentElement.classList.add('_search-box-opened');
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
      '.catalog__card.menu-product-card_list-view .menu-product-card__labels'
    ),
    '.catalog__card',
    '.menu-product-card__preview'
  );

  // get original height
  if (window.innerWidth > 768) {
    const setOriginalHeight = () => {
      const elements = document.querySelectorAll('[data-original-height]');
      if (elements.length) {
        elements.forEach(element => {
          const visibleHeight = element.dataset.visibleHeight;
          const showmoreBtn = element.parentElement.querySelector(
            '[data-showmore-btn]'
          );

          element.dataset.originalHeight = `${element.offsetHeight}px`;
          visibleHeight
            ? (element.style.height = element.dataset.visibleHeight)
            : null;

          if (showmoreBtn && visibleHeight) {
            showmoreBtn.addEventListener('click', function () {
              if (element.parentElement.classList.contains('_active')) {
                element.parentElement.classList.remove('_active');
                element.style.height = element.dataset.visibleHeight;
              } else {
                element.parentElement.classList.add('_active');
                element.style.height = element.dataset.originalHeight;
              }
            });
          }
        });
      }
    };
    setOriginalHeight();
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
      } else if (
        !filter.checked &&
        targetElement.querySelector(`[data-tag-text="${filterTxt}"]`)
      ) {
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

  // handler functions
  const onClickHandler = e => {
    const target = e.target;

    // console.log(target);

    if (target.closest('.tags-catalog__remove-btn-icon')) {
      const tag = target.closest('.tags-catalog__item');
      document.querySelector(
        `[data-filter-text="${tag.dataset.tagText}"] input`
      ).checked = false;
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
      const parent = target.closest('.filters__show-all-btn').parentElement;
      parent.classList.toggle('_show-all');
    }
    if (target.closest('.filters__showmore-btn') && window.innerWidth > 768) {
      const parent = target.closest('.filters__showmore-list');

      if (parent && !parent.classList.contains('scroll')) {
        parent.classList.toggle('_active');
      } else if (parent && parent.classList.contains('scroll')) {
        if (parent.classList.contains('_active')) {
          parent.classList.remove('_active');
          parent.querySelector('.filters__options').style.height = 0;
        } else {
          parent.classList.add('_active');
          parent.querySelector('.filters__options').style.height = `22rem`;
        }
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
    if (target.closest('.search-box__delete-btn')) {
      const parent = target.closest('.search-box__group');
      const item = target.closest('.search-box__item');
      item.remove();

      if (!parent.querySelectorAll('.search-box__item').length) {
        parent.remove();
      }
    }
    if (target.closest('.menu-bar__item')) {
      removeClasses(document.querySelectorAll('.menu-bar__item'), '_active');
      target.closest('.menu-bar__item').classList.add('_active');
    }
    if (target.closest('.categories-catalog__item')) {
      removeClasses(
        document.querySelectorAll('.categories-catalog__item'),
        '_active'
      );
      target.closest('.categories-catalog__item').classList.add('_active');
    }
    if (target.closest('.view-catalog__btn')) {
      removeClasses(document.querySelectorAll('.view-catalog__btn'), '_active');
      target.closest('.view-catalog__btn').classList.add('_active');
    }
  };

  // document events
  document.addEventListener('click', onClickHandler);
});
