import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import { removeClasses } from './utils';

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

const changeSlideNum = (swiper, pagination) => {
  const slides = swiper.slides;

  if (slides.length && pagination) {
    slides.forEach(slide => {
      const target = slide.querySelector('.slide-hero__number');

      if (target) {
        target.innerHTML = `${
          pagination.querySelector('.swiper-pagination-bullet-active').innerHTML
        }`;
      }
    });
  }
};
const changeActiveNum = pagination => {
  const target = document.querySelector('.recommendations__number');

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
          changeSlideNum(swiper, swiper.pagination.el);
        },
        slideChange: swiper => {
          changeSlideNum(swiper, swiper.pagination.el);
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
          changeActiveNum(swiper.pagination);
          hideSlide(swiper);
        },
        slideChange: swiper => {
          changeActiveNum(swiper.pagination);
          hideSlide(swiper);
        },
      },
    });
  }
};

//=================================================================================================================

window.addEventListener('load', function (e) {
  initSliders();
});
