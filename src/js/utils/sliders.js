import Swiper from 'swiper';
import { Navigation, Pagination, EffectCreative } from 'swiper/modules';
import { removeClasses } from './utils';

import { rem } from './utils';

// styles
import 'swiper/css';

// --------------------------------------------------------------------------

// const initPagination = swiper => {
//   const pagination = swiper.pagination.el;
//   const bullets = swiper.pagination.bullets;

//   if (bullets.length) {
//     removeClasses(bullets, '_hidden');
//     bullets.forEach(bullet => {
//       if (
//         bullets.indexOf(bullet) <=
//         bullets.indexOf(
//           pagination.querySelector('.swiper-pagination-bullet-active')
//         )
//       ) {
//         bullet.classList.add('_hidden');
//       }
//       if (
//         bullets.indexOf(
//           pagination.querySelector('.swiper-pagination-bullet-active')
//         ) ===
//         bullets.length - 1
//       ) {
//         removeClasses(bullets, '_hidden');
//       }
//     });
//   }
// };

const changeSlideNum = (swiper, pagination, target) => {
  const slides = swiper.slides;

  if (slides.length && pagination) {
    slides.forEach(slide => {
      console.log(target);
      slide.querySelector(target).innerHTML = `${
        pagination.querySelector('.swiper-pagination-bullet-active').innerHTML
      }`;
    });
  }
};
const changeActiveNum = (pagination, target) => {
  if (target && pagination.el) {
    target.innerHTML = `${
      pagination.el.querySelector('.swiper-pagination-bullet-active').innerHTML
    }`;
  }
};
const hideSlide = swiper => {
  removeClasses(swiper.slides, '_hidden');
  if (swiper.slides[swiper.activeIndex + 3]) {
    swiper.slides[swiper.activeIndex + 3].classList.add('_hidden');
  }
};

// --------------------------------------------------------------------------

const initSliders = () => {
  if (document.querySelector('.hero__slider')) {
    new Swiper('.hero__slider', {
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      slidesPerView: 'auto',
      autoHeight: true,
      speed: 800,
      direction: 'vertical',
      loop: true,

      // navigation
      navigation: {
        prevEl: '.hero__sl-control .sl-nav__arrow_prev',
        nextEl: '.hero__sl-control .sl-nav__arrow_next',
      },

      // pagination
      pagination: {
        el: '.hero__sl-control .sl-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return (
            '<span class="' + className + '">' + '0' + (index + 1) + '</span>'
          );
        },
      },

      // events
      on: {
        init: swiper => {
          changeSlideNum(swiper, swiper.pagination.el, '.slide-hero__number');
        },
        slideChange: swiper => {
          changeSlideNum(swiper, swiper.pagination.el, '.slide-hero__number');
        },
      },
    });
  }
  if (document.querySelector('.recommendations__slider')) {
    new Swiper('.recommendations__slider', {
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      slidesPerView: 4,
      spaceBetween: 137,
      speed: 800,
      loop: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,

      // navigation
      navigation: {
        prevEl: '.recommendations .sl-nav__arrow_prev',
        nextEl: '.recommendations .sl-nav__arrow_next',
      },

      // pagination
      pagination: {
        el: '.recommendations .sl-pagination',
        clickable: true,
        dynamicBullets: true,
        renderBullet: function (index, className) {
          return (
            '<span class="' + className + '">' + '0' + (index + 1) + '</span>'
          );
        },
      },

      // events
      on: {
        afterInit: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.recommendations__number')
          );
          hideSlide(swiper);
        },
        slideChange: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.recommendations__number')
          );
          hideSlide(swiper);
        },
      },
    });
  }
  if (document.querySelector('.tests__slider')) {
    new Swiper('.tests__slider', {
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      slidesPerView: 1.01,
      spaceBetween: 30,
      speed: 1000,
      loop: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,

      // navigation
      navigation: {
        prevEl: '.tests .sl-nav__arrow_prev',
        nextEl: '.tests .sl-nav__arrow_next',
      },

      // pagination
      pagination: {
        el: '.tests .sl-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return (
            '<span class="' + className + '">' + '0' + (index + 1) + '</span>'
          );
        },
      },

      // events
      on: {
        afterInit: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.tests__active-number')
          );
        },
        slideChange: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.tests__active-number')
          );
        },
      },
    });
  }
  if (document.querySelector('.collections__slider')) {
    new Swiper('.collections__slider', {
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      slidesPerView: 'auto',
      spaceBetween: rem(42),
      speed: 1000,
      loop: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
      resistance: false,

      // navigation
      navigation: {
        prevEl: '.collections .sl-nav__arrow_prev',
        nextEl: '.collections .sl-nav__arrow_next',
      },

      // pagination
      pagination: {
        el: '.collections .sl-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return (
            '<span class="' + className + '">' + '0' + (index + 1) + '</span>'
          );
        },
      },

      // events
      on: {
        sliderFirstMove: swiper => {
          swiper.el.classList.add('_slide');
        },
        afterInit: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.collections__active-number')
          );
        },
        slideChange: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.collections__active-number')
          );
        },
      },
    });
  }
};

//=================================================================================================================

window.addEventListener('load', function (e) {
  initSliders();
});
