// get hash
// get hash
export const getHash = () => {
  if (location.hash) {
    return location.hash.replace('#', '');
  }
};

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
export const _slideUp = (target, duration = 500, showmore = 0) => {
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
export const _slideDown = (target, duration = 500, showmore = 0) => {
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
export const _slideToggle = (target, duration = 500) => {
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

// showmore
export const showmore = () => {
  const elements = document.querySelectorAll('[data-original-height]');
  if (elements.length && window.innerWidth > 768) {
    elements.forEach(element => {
      const visibleHeight = element.dataset.visibleHeight;
      const showmoreBtn = element.parentElement.querySelector(
        '[data-showmore-btn]'
      );

      const setHeight = () => {
        element.dataset.originalHeight = `${element.offsetHeight}px`;
        visibleHeight
          ? (element.style.height = element.dataset.visibleHeight)
          : null;
      };
      setHeight();

      if (showmoreBtn && visibleHeight) {
        showmoreBtn.addEventListener('click', function () {
          if (element.parentElement.classList.contains('_show-all')) {
            element.parentElement.classList.remove('_show-all');
            element.style.height = element.dataset.visibleHeight;
          } else {
            element.parentElement.classList.add('_show-all');
            element.style.height = element.dataset.originalHeight;
          }
        });
      }

      window.addEventListener('resize', setHeight);
    });
  }
};

// tabs
export const tabs = () => {
  const tabs = document.querySelectorAll('[data-tabs]');
  let tabsActiveHash = [];

  if (tabs.length > 0) {
    const hash = getHash();
    if (hash && hash.startsWith('tab-')) {
      tabsActiveHash = hash.replace('tab-', '').split('-');
    }
    tabs.forEach((tabsBlock, index) => {
      tabsBlock.classList.add('_tab-init');
      tabsBlock.setAttribute('data-tabs-index', index);
      tabsBlock.addEventListener('click', setTabsAction);
      initTabs(tabsBlock);
    });

    // get spoilers with media queries
    let mdQueriesArray = dataMediaQueries(tabs, 'tabs');
    if (mdQueriesArray && mdQueriesArray.length) {
      mdQueriesArray.forEach(mdQueriesItem => {
        // event
        mdQueriesItem.matchMedia.addEventListener('change', function () {
          setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
        });
        setTitlePosition(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
      });
    }
  }
  // setting title positions
  function setTitlePosition(tabsMediaArray, matchMedia) {
    tabsMediaArray.forEach(tabsMediaItem => {
      tabsMediaItem = tabsMediaItem.item;
      let tabsTitles = tabsMediaItem.querySelector('[data-tabs-titles]');
      let tabsTitleItems = tabsMediaItem.querySelectorAll('[data-tabs-title]');
      let tabsContent = tabsMediaItem.querySelector('[data-tabs-body]');
      let tabsContentItems = tabsMediaItem.querySelectorAll('[data-tabs-item]');
      tabsTitleItems = Array.from(tabsTitleItems).filter(
        item => item.closest('[data-tabs]') === tabsMediaItem
      );
      tabsContentItems = Array.from(tabsContentItems).filter(
        item => item.closest('[data-tabs]') === tabsMediaItem
      );
      tabsContentItems.forEach((tabsContentItem, index) => {
        if (matchMedia.matches) {
          tabsContent.append(tabsTitleItems[index]);
          tabsContent.append(tabsContentItem);
          tabsMediaItem.classList.add('_tab-spoller');
        } else {
          tabsTitles.append(tabsTitleItems[index]);
          tabsMediaItem.classList.remove('_tab-spoller');
        }
      });
    });
  }
  // content
  function initTabs(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-titles]>*');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-body]>*');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    const tabsActiveHashBlock = tabsActiveHash[0] == tabsBlockIndex;

    if (tabsActiveHashBlock) {
      const tabsActiveTitle = tabsBlock.querySelector(
        '[data-tabs-titles]>._active'
      );
      tabsActiveTitle ? tabsActiveTitle.classList.remove('_active') : null;
    }
    if (tabsContent.length) {
      tabsContent = Array.from(tabsContent).filter(
        item => item.closest('[data-tabs]') === tabsBlock
      );
      tabsTitles = Array.from(tabsTitles).filter(
        item => item.closest('[data-tabs]') === tabsBlock
      );
      tabsContent.forEach((tabsContentItem, index) => {
        tabsTitles[index].setAttribute('data-tabs-title', '');
        tabsContentItem.setAttribute('data-tabs-item', '');

        if (tabsActiveHashBlock && index == tabsActiveHash[1]) {
          tabsTitles[index].classList.add('_active');
        }
        tabsContentItem.hidden =
          !tabsTitles[index].classList.contains('_active');
      });
    }
  }
  function setTabsStatus(tabsBlock) {
    let tabsTitles = tabsBlock.querySelectorAll('[data-tabs-title]');
    let tabsContent = tabsBlock.querySelectorAll('[data-tabs-item]');
    const tabsBlockIndex = tabsBlock.dataset.tabsIndex;
    function isTabsAnamate(tabsBlock) {
      if (tabsBlock.hasAttribute('data-tabs-animate')) {
        return tabsBlock.dataset.tabsAnimate > 0
          ? Number(tabsBlock.dataset.tabsAnimate)
          : 500;
      }
    }
    const tabsBlockAnimate = isTabsAnamate(tabsBlock);
    if (tabsContent.length > 0) {
      const isHash = tabsBlock.hasAttribute('data-tabs-hash');
      tabsContent = Array.from(tabsContent).filter(
        item => item.closest('[data-tabs]') === tabsBlock
      );
      tabsTitles = Array.from(tabsTitles).filter(
        item => item.closest('[data-tabs]') === tabsBlock
      );
      tabsContent.forEach((tabsContentItem, index) => {
        if (tabsTitles[index].classList.contains('_active')) {
          if (tabsBlockAnimate) {
            _slideDown(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = false;
          }
          if (isHash && !tabsContentItem.closest('.modal')) {
            setHash(`tab-${tabsBlockIndex}-${index}`);
          }
        } else {
          if (tabsBlockAnimate) {
            _slideUp(tabsContentItem, tabsBlockAnimate);
          } else {
            tabsContentItem.hidden = true;
          }
        }
      });
    }
  }
  function setTabsAction(e) {
    const el = e.target;
    if (el.closest('[data-tabs-title]')) {
      const tabTitle = el.closest('[data-tabs-title]');
      const tabsBlock = tabTitle.closest('[data-tabs]');
      if (
        !tabTitle.classList.contains('_active') &&
        !tabsBlock.querySelector('._slide')
      ) {
        let tabActiveTitle = tabsBlock.querySelectorAll(
          '[data-tabs-title]._active'
        );
        tabActiveTitle.length
          ? (tabActiveTitle = Array.from(tabActiveTitle).filter(
              item => item.closest('[data-tabs]') === tabsBlock
            ))
          : null;
        tabActiveTitle.length
          ? tabActiveTitle[0].classList.remove('_active')
          : null;
        tabTitle.classList.add('_active');
        setTabsStatus(tabsBlock);
      }
      e.preventDefault();
    }
  }
};

// set active class
export const setActiveClass = (
  event,
  target,
  innerTarget,
  activeClass,
  isPreventDef
) => {
  if (
    document.querySelector(`${target}.${activeClass}`) &&
    (!event.target.closest(`${target}`) ||
      event.target.closest(`${innerTarget}`))
  ) {
    if (isPreventDef) {
      event.preventDefault();
    }
    document
      .querySelector(`${target}.${activeClass}`)
      .classList.remove(`${activeClass}`);
  } else if (
    !document.querySelector(`${target}.${activeClass}`) &&
    event.target.closest(`${target}`)
  ) {
    if (isPreventDef) {
      event.preventDefault();
    }
    event.target.closest(`${target}`).classList.add(`${activeClass}`);
  }
};

// countdown
export const initCountdown = el => {
  if (el) {
    let limitMinutes = Number(el.dataset.countdown);
    let limitSeconds = limitMinutes * 60;

    const start = () => {
      limitSeconds--;
      let minutes = Math.floor(limitSeconds / 60);
      let seconds = limitSeconds % 60;

      if (limitSeconds < 0) {
        clearInterval(interval);
        setTimeout(() => {
          el.textContent =
            limitMinutes >= 10 ? `${limitMinutes}:00` : `0${limitMinutes}:00`;
        }, 0);
        if (el.closest('.btn')) {
          const btn = el.closest('.btn');
          btn.removeAttribute('disabled');
          btn.addEventListener('click', function () {
            btn.setAttribute('disabled', '');
            limitSeconds = limitMinutes * 60;
            initCountdown(el);
          });
        }
        return;
      }

      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }

      el.textContent = minutes + ':' + seconds;
    };

    const interval = setInterval(start, 1000);
  }
};
