import { getHash } from './utils';

// control window scroll event
let addWindowScrollEvent = false;

// --------------------------------------------------------------------------

export const headerScroll = () => {
  addWindowScrollEvent = true;
  const header = document.querySelector('header.header');
  const headerShow = header.hasAttribute('data-scroll-show');
  const headerShowTimer = header.dataset.scrollShow
    ? header.dataset.scrollShow
    : 500;
  const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
  let scrollDirection = 0;
  let timer;
  document.addEventListener('windowScroll', function (e) {
    const scrollTop = window.scrollY;
    clearTimeout(timer);
    if (scrollTop >= startPoint) {
      !document.documentElement.classList.contains('_header-scroll')
        ? document.documentElement.classList.add('_header-scroll')
        : null;
      if (headerShow) {
        if (scrollTop > scrollDirection) {
          // downscroll code
          document.documentElement.classList.contains('_header-show')
            ? document.documentElement.classList.remove('_header-show')
            : null;
        } else {
          // upscroll code
          !document.documentElement.classList.contains('_header-show')
            ? document.documentElement.classList.add('_header-show')
            : null;
        }
        timer = setTimeout(() => {
          !document.documentElement.classList.contains('_header-show')
            ? document.documentElement.classList.add('_header-show')
            : null;
        }, headerShowTimer);
      }
    } else {
      document.documentElement.classList.contains('_header-scroll')
        ? document.documentElement.classList.remove('_header-scroll')
        : null;
      if (headerShow) {
        document.documentElement.classList.contains('_header-show')
          ? document.documentElement.classList.remove('_header-show')
          : null;
      }
    }
    scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
  });
};

// --------------------------------------------------------------------------

export const pageNavigation = () => {
  document.addEventListener('click', pageNavigationAction);
  document.addEventListener('watcherCallback', pageNavigationAction);
  // main function
  function pageNavigationAction(e) {
    if (e.type === 'click') {
      const targetElement = e.target;
      if (targetElement.closest('[data-goto]')) {
        const gotoLink = targetElement.closest('[data-goto]');
        const gotoLinkSelector = gotoLink.dataset.goto
          ? gotoLink.dataset.goto
          : '';
        const noHeader = gotoLink.hasAttribute('data-goto-header')
          ? true
          : false;
        const gotoSpeed = gotoLink.dataset.gotoSpeed
          ? gotoLink.dataset.gotoSpeed
          : 500;
        const offsetTop = gotoLink.dataset.gotoTop
          ? parseInt(gotoLink.dataset.gotoTop)
          : 0;
        gotoBlock(gotoLinkSelector, noHeader, gotoSpeed, offsetTop);
        e.preventDefault();
      }
    } else if (e.type === 'watcherCallback' && e.detail) {
      const entry = e.detail.entry;
      const targetElement = entry.target;
      if (targetElement.dataset.watch === 'navigator') {
        const navigatorActiveItem = document.querySelector(
          `[data-goto]._navigator-active`
        );
        let navigatorCurrentItem;
        if (
          targetElement.id &&
          document.querySelector(`[data-goto="#${targetElement.id}"]`)
        ) {
          navigatorCurrentItem = document.querySelector(
            `[data-goto="#${targetElement.id}"]`
          );
        } else if (targetElement.classList.length) {
          for (let index = 0; index < targetElement.classList.length; index++) {
            const element = targetElement.classList[index];
            if (document.querySelector(`[data-goto=".${element}"]`)) {
              navigatorCurrentItem = document.querySelector(
                `[data-goto=".${element}"]`
              );
              break;
            }
          }
        }
        if (entry.isIntersecting) {
          navigatorCurrentItem
            ? navigatorCurrentItem.classList.add('_navigator-active')
            : null;
        } else {
          navigatorCurrentItem
            ? navigatorCurrentItem.classList.remove('_navigator-active')
            : null;
        }
      }
    }
  }
  // scroll by hash
  if (getHash()) {
    let goToHash;
    if (document.querySelector(`#${getHash()}`)) {
      goToHash = `#${getHash()}`;
    } else if (document.querySelector(`.${getHash()}`)) {
      goToHash = `.${getHash()}`;
    }
    goToHash ? gotoBlock(goToHash, true, 500, 20) : null;
  }
};

// --------------------------------------------------------------------------

export let gotoBlock = (
  targetBlock,
  noHeader = false,
  speed = 500,
  offsetTop = 0
) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (targetBlockElement) {
    let headerItem = '';
    let headerItemHeight = 0;
    if (noHeader) {
      headerItem = 'header.header';
      headerItemHeight = document.querySelector(headerItem).offsetHeight;
    }
    let options = {
      speedAsDuration: true,
      speed: speed,
      header: headerItem,
      offset: offsetTop,
      easing: 'easeOutQuad',
    };
    // close menu if it's opened
    document.documentElement.classList.contains('_menu-opened')
      ? menuClose()
      : null;

    // scroll without plugin
    let targetBlockElementPosition =
      targetBlockElement.getBoundingClientRect().top + scrollY;
    targetBlockElementPosition = headerItemHeight
      ? targetBlockElementPosition - headerItemHeight
      : targetBlockElementPosition;
    targetBlockElementPosition = offsetTop
      ? targetBlockElementPosition - offsetTop
      : targetBlockElementPosition;
    window.scrollTo({
      top: targetBlockElementPosition,
      behavior: 'smooth',
    });
  }
};

// --------------------------------------------------------------------------

setTimeout(() => {
  if (addWindowScrollEvent) {
    let windowScroll = new Event('windowScroll');
    window.addEventListener('scroll', function (e) {
      document.dispatchEvent(windowScroll);
    });
  }
}, 0);
