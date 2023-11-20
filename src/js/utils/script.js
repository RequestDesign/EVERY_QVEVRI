import { removeClasses } from '../utils/utils.js';

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

  // handler functions
  const onClickHandler = e => {
    const target = e.target;

    // console.log(target);

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
  };

  // document events
  document.addEventListener('click', onClickHandler);
});
