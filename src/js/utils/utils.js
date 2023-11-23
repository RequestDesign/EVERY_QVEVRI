// body lock
export let bodyLockStatus = true;
export const bodyLockToggle = (delay = 500) => {
  if (document.documentElement.classList.contains('lock')) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
export const bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    setTimeout(() => {
      document.documentElement.classList.remove('lock');
    }, delay);
    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};
export const bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    document.documentElement.classList.add('lock');

    bodyLockStatus = false;
    setTimeout(function () {
      bodyLockStatus = true;
    }, delay);
  }
};

// menu
export const menuInit = () => {
  if (document.querySelector('.hamburger')) {
    document.addEventListener('click', function (e) {
      if (bodyLockStatus && e.target.closest('.hamburger')) {
        menuOpen();
      } else if (
        bodyLockStatus &&
        document.documentElement.classList.contains('_menu-opened') &&
        (e.target.closest('.menu__close-btn') || !e.target.closest('.menu'))
      ) {
        menuClose();
      }
    });
  }
};
export const menuOpen = () => {
  bodyLock();
  document.documentElement.classList.add('_menu-opened');
};
export const menuClose = () => {
  bodyUnlock();
  document.documentElement.classList.remove('_menu-opened');
};

// remove class from all array elements
export const removeClasses = (array, className) => {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
};

// convert rem
export const rem = rem => {
  if (window.innerWidth > 768) {
    return 0.005208335 * window.innerWidth * rem;
  } else {
    return (100 / 390) * (0.1 * window.innerWidth) * rem;
  }
};

// smooth slide
export let _slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty('height') : null;
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      !showmore ? target.style.removeProperty('overflow') : null;
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // create event
      document.dispatchEvent(
        new CustomEvent('slideUpDone', {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};
export let _slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains('_slide')) {
    target.classList.add('_slide');
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty('height') : null;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = showmore ? `${showmore}rem` : `0`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout(() => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      target.classList.remove('_slide');
      // create event
      document.dispatchEvent(
        new CustomEvent('slideDownDone', {
          detail: {
            target: target,
          },
        })
      );
    }, duration);
  }
};
export let _slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return _slideDown(target, duration);
  } else {
    return _slideUp(target, duration);
  }
};

// array uniqueization
export const uniqueArray = array => {
  return array.filter(function (item, index, self) {
    return self.indexOf(item) === index;
  });
};

// processing media requests from attributes
export const dataMediaQueries = (array, dataSetValue) => {
  // get objects with media queries
  const media = Array.from(array).filter(function (item, index, self) {
    if (item.dataset[dataSetValue]) {
      return item.dataset[dataSetValue].split(',')[0];
    }
  });
  // objects with media queries initialization
  if (media.length) {
    const breakpointsArray = [];
    media.forEach(item => {
      const params = item.dataset[dataSetValue];
      const breakpoint = {};
      const paramsArray = params.split(',');
      breakpoint.value = paramsArray[0];
      breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
      breakpoint.item = item;
      breakpointsArray.push(breakpoint);
    });
    // get unique breakpoints
    let mdQueries = breakpointsArray.map(function (item) {
      return (
        '(' +
        item.type +
        '-width: ' +
        item.value +
        'px),' +
        item.value +
        ',' +
        item.type
      );
    });
    mdQueries = uniqueArray(mdQueries);
    const mdQueriesArray = [];

    if (mdQueries.length) {
      // work with every breakpoint
      mdQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(',');
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);
        // objects with conditions
        const itemsArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        mdQueriesArray.push({
          itemsArray,
          matchMedia,
        });
      });
      return mdQueriesArray;
    }
  }
};

// spoilers
export const spoilers = () => {
  const spoilersArray = document.querySelectorAll('[data-spoilers]');
  if (spoilersArray.length > 0) {
    // get regular spoilers
    const spoilersRegular = Array.from(spoilersArray).filter(function (
      item,
      index,
      self
    ) {
      return !item.dataset.spoilers.split(',')[0];
    });
    // regular spoilers initialization
    if (spoilersRegular.length) {
      initSpoilers(spoilersRegular);
    }
    // get spoilers with media queries
    let mdQueriesArray = dataMediaQueries(spoilersArray, 'spoilers');
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // event
        mdQueriesItem.matchMedia.addEventListener('change', function () {
          initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        initSpoilers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
    // initialization
    function initSpoilers(spoilersArray, matchMedia = false) {
      spoilersArray.forEach(spoilersBlock => {
        spoilersBlock = matchMedia ? spoilersBlock.item : spoilersBlock;
        if (matchMedia.matches || !matchMedia) {
          spoilersBlock.classList.add('_spoiler-init');
          initSpoilerBody(spoilersBlock);
          spoilersBlock.addEventListener('click', setSpoilerAction);
        } else {
          spoilersBlock.classList.remove('_spoiler-init');
          initSpoilerBody(spoilersBlock, false);
          spoilersBlock.removeEventListener('click', setSpoilerAction);
        }
      });
    }
    // content
    function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
      let spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');
      if (spoilerTitles.length) {
        spoilerTitles = Array.from(spoilerTitles).filter(
          item => item.closest('[data-spoilers]') === spoilersBlock
        );
        spoilerTitles.forEach(spoilerTitle => {
          if (hideSpoilerBody) {
            spoilerTitle.removeAttribute('tabindex');
            if (!spoilerTitle.classList.contains('_spoiler-active')) {
              spoilerTitle.nextElementSibling.hidden = true;
            }
          } else {
            spoilerTitle.setAttribute('tabindex', '-1');
            spoilerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }
    function setSpoilerAction(e) {
      const el = e.target;
      if (el.closest('[data-spoiler]')) {
        const spoilerTitle = el.closest('[data-spoiler]');
        const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
        const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler');
        const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed
          ? parseInt(spoilersBlock.dataset.spoilersSpeed)
          : 500;
        if (!spoilersBlock.querySelectorAll('._slide').length) {
          if (
            oneSpoiler &&
            !spoilerTitle.classList.contains('_spoiler-active')
          ) {
            hideSpoilersBody(spoilersBlock);
          }
          spoilerTitle.classList.toggle('_spoiler-active');
          _slideToggle(spoilerTitle.nextElementSibling, spoilerSpeed);
        }
        e.preventDefault();
      }
    }
    function hideSpoilersBody(spoilersBlock) {
      const spoilerActiveTitle = spoilersBlock.querySelector(
        '[data-spoiler]._spoiler-active'
      );
      const spoilerSpeed = spoilersBlock.dataset.spoilersSpeed
        ? parseInt(spoilersBlock.dataset.spoilersSpeed)
        : 500;
      if (
        spoilerActiveTitle &&
        !spoilersBlock.querySelectorAll('._slide').length
      ) {
        spoilerActiveTitle.classList.remove('_spoiler-active');
        _slideUp(spoilerActiveTitle.nextElementSibling, spoilerSpeed);
      }
    }
    // closing on click outside the spoiler
    const spoilersClose = document.querySelectorAll('[data-spoiler-close]');
    if (spoilersClose.length) {
      document.addEventListener('click', function (e) {
        const el = e.target;
        if (!el.closest('[data-spoilers]')) {
          spoilersClose.forEach(spoilerClose => {
            const spoilersBlock = spoilerClose.closest('[data-spoilers]');
            const spoilerSpeed = spollersBlock.dataset.spoilersSpeed
              ? parseInt(spoilersBlock.dataset.spoilersSpeed)
              : 500;
            spoilerClose.classList.remove('_spoiler-active');
            _slideUp(spoilerClose.nextElementSibling, spoilerSpeed);
          });
        }
      });
    }
  }
};
