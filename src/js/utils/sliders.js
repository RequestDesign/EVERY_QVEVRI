import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade, Controller } from 'swiper/modules';
import 'swiper/css';

import { removeClasses } from './utils';
import { rem } from './utils';

// --------------------------------------------------------------------------

let categoriesSlider = null;
let catalogCategoriesSlider = null;

const changeSlideNum = (swiper, pagination, target) => {
  const slides = swiper.slides;

  if (slides.length && pagination) {
    slides.forEach(slide => {
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
const initDynamicPagination = swiper => {
  if (swiper.slides.length >= 4) {
    const bullets = swiper.pagination.bullets;
    const slides = swiper.slides;
    const curIndex = swiper.realIndex;

    if (bullets.length) {
      removeClasses(bullets, '_revealed');

      window.innerWidth <= 768
        ? bullets[curIndex].classList.add('_revealed')
        : null;
      bullets[curIndex + 1]
        ? bullets[curIndex + 1].classList.add('_revealed')
        : null;
      bullets[curIndex + 2]
        ? bullets[curIndex + 2].classList.add('_revealed')
        : null;

      window.innerWidth > 768 && bullets[curIndex + 3]
        ? bullets[curIndex + 3].classList.add('_revealed')
        : null;

      if (
        window.innerWidth <= 768 &&
        (curIndex === slides.length - 2 || curIndex === slides.length - 1)
      ) {
        bullets[slides.length - 3].classList.add('_revealed');
        bullets[slides.length - 2].classList.add('_revealed');
        bullets[slides.length - 1].classList.add('_revealed');
      }
      if (window.innerWidth > 768 && curIndex === slides.length - 1) {
        bullets[0].classList.add('_revealed');
        bullets[1].classList.add('_revealed');
        bullets[2].classList.add('_revealed');
      }
    } else if (window.innerWidth > 768) {
      bullets.forEach(bullet => {
        if (!bullet.classList.contains('swiper-pagination-bullet-active')) {
          bullet.classList.add('_revealed');
        }
      });
    }
  }
};
const revealSlides = swiper => {
  const slides = Array.from(swiper.el.querySelectorAll('.swiper-slide'));

  removeClasses(slides, '_revealed');

  slides.forEach((slide, index) => {
    if (slide.classList.contains('swiper-slide-active')) {
      slides[index].classList.add('_revealed');
      if (window.innerWidth > 768) {
        slides[index + 1] ? slides[index + 1].classList.add('_revealed') : null;
        slides[index + 2] ? slides[index + 2].classList.add('_revealed') : null;
        if (document.querySelector('.catalog-page')) {
          slides[index + 3]
            ? slides[index + 3].classList.add('_revealed')
            : null;
        }
      }
    }
  });
};

const initSliders = () => {
  if (document.querySelector('.search-box__slider')) {
    new Swiper('.search-box__slider', {
      modules: [Navigation, EffectFade],
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      slidesPerView: 1,
      speed: 700,
      loop: true,

      // effects
      effect: 'fade',

      // navigation
      navigation: {
        prevEl: '.search-box__slider-nav .search-box__slider-arr_prev',
        nextEl: '.search-box__slider-nav .search-box__slider-arr_next',
      },
    });
  }

  if (document.querySelector('.hero__slider')) {
    new Swiper('.hero__slider', {
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      autoHeight: true,
      slidesPerView: 1,
      speed: 800,
      loop: true,

      // navigation
      navigation: {
        prevEl: '.hero .sl-nav__arrow_prev',
        nextEl: '.hero .sl-nav__arrow_next',
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

      // breakpoints
      breakpoints: {
        768: {
          direction: 'vertical',
          slidesPerView: 'auto',
        },
      },

      // events
      on: {
        init: swiper => {
          const totalGap = swiper.passedParams.spaceBetween;
          const containerHeight = swiper.slides[0].clientHeight + totalGap;
          swiper.el.style.height = containerHeight + 'px';

          changeSlideNum(swiper, swiper.pagination.el, '.slide-hero__number');
        },
        slideChange: swiper => {
          changeSlideNum(swiper, swiper.pagination.el, '.slide-hero__number');
          initDynamicPagination(swiper);
        },
      },
    });
  }
  if (document.querySelector('.recommendations__slider')) {
    new Swiper('.recommendations__slider', {
      modules: [Navigation, Pagination],
      slidesPerView: 1.4,
      spaceBetween: 65,
      speed: 800,
      loop: true,
      longSwipes: false,

      // navigation
      navigation: {
        prevEl: '.recommendations .sl-nav__arrow_prev',
        nextEl: '.recommendations .sl-nav__arrow_next',
      },

      // pagination
      pagination: {
        el: '.recommendations .sl-pagination',
        clickable: true,
        renderBullet: function (index, className) {
          return (
            '<span class="' + className + '">' + '0' + (index + 1) + '</span>'
          );
        },
      },

      // breakpoints
      breakpoints: {
        768: {
          slidesPerView: document.querySelector('.catalog-page') ? 5 : 4,
          spaceBetween: document.querySelector('.catalog-page') ? 90 : 137,
        },
      },

      // events
      on: {
        afterInit: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.recommendations__number')
          );
          initDynamicPagination(swiper);
          revealSlides(swiper);
        },
        realIndexChange: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.recommendations__number')
          );

          initDynamicPagination(swiper);
        },
        slideChangeTransitionStart: swiper => {
          revealSlides(swiper);
        },
        touchMove: swiper => {
          revealSlides(swiper);
        },
      },
    });
  }
  if (document.querySelector('.tests__slider')) {
    new Swiper('.tests__slider', {
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      slidesPerView: 1,
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

      // breakpoints
      breakpoints: {
        768: {
          slidesPerView: 1.01,
        },
      },

      // events
      on: {
        afterInit: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.tests__active-number')
          );

          initDynamicPagination(swiper);
        },
        slideChange: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.tests__active-number')
          );
        },
        realIndexChange: swiper => {
          initDynamicPagination(swiper);
        },
      },
    });
  }
  if (document.querySelector('.collections__slider')) {
    new Swiper('.collections__slider', {
      modules: [Navigation, Pagination],
      observer: true,
      observeParents: true,
      speed: 1000,
      loop: true,
      slidesPerView: 1.6,
      spaceBetween: 64,
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

      // breakpoints
      breakpoints: {
        768: {
          slidesPerView: 'auto',
          spaceBetween: '21%',
        },
      },

      // events
      on: {
        afterInit: swiper => {
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.collections__active-number')
          );
        },
        slideChange: swiper => {
          if (!swiper.el.classList.contains('_slide')) {
            swiper.el.classList.add('_slide');
          }
          changeActiveNum(
            swiper.pagination,
            document.querySelector('.collections__active-number')
          );
          initDynamicPagination(swiper);
        },
      },
    });
  }
  if (document.querySelector('.categories__slider')) {
    if (window.innerWidth <= 768 && !categoriesSlider) {
      categoriesSlider = new Swiper('.categories__slider', {
        modules: [Navigation, Pagination],
        observer: true,
        observeParents: true,
        slidesPerView: 2,
        spaceBetween: rem(0.8),
        speed: 1000,
        loop: true,

        // navigation
        navigation: {
          prevEl: '.categories .sl-nav__arrow_prev',
          nextEl: '.categories .sl-nav__arrow_next',
        },

        // pagination
        pagination: {
          el: '.categories .sl-pagination',
          clickable: true,
          renderBullet: function (index, className) {
            return (
              '<span class="' +
              className +
              '">' +
              `${index + 1 < 10 ? '0' : ''}` +
              (index + 1) +
              '</span>'
            );
          },
        },

        // events
        on: {
          afterInit: swiper => {
            setTimeout(() => {
              initDynamicPagination(swiper);
            }, 0);
          },
          slideChangeTransitionStart: swiper => {
            initDynamicPagination(swiper);
          },
        },
      });
    } else if (window.innerWidth > 768 && categoriesSlider) {
      categoriesSlider.destroy();
      categoriesSlider = null;
    }
  }
};
const initSlidersOnResize = () => {
  if (document.querySelector('.catalog__categories')) {
    if (window.innerWidth <= 768 && !catalogCategoriesSlider) {
      catalogCategoriesSlider = new Swiper('.catalog__categories', {
        observer: true,
        observeParents: true,
        slidesPerView: 'auto',
        spaceBetween: rem(2.5),
        slideToClickedSlide: true,
        slideClass: 'categories-catalog__item',
        wrapperClass: 'categories-catalog__list',
      });
    } else if (window.innerWidth > 768 && catalogCategoriesSlider) {
      catalogCategoriesSlider.destroy();
      catalogCategoriesSlider = null;
    }
  }
};

//=================================================================================================================

window.addEventListener('load', function (e) {
  setTimeout(() => {
    initSliders();
    initSlidersOnResize();
  }, 0);
});
window.addEventListener('resize', initSlidersOnResize);
