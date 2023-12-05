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

setTimeout(() => {
  if (addWindowScrollEvent) {
    let windowScroll = new Event('windowScroll');
    window.addEventListener('scroll', function (e) {
      document.dispatchEvent(windowScroll);
    });
  }
}, 0);
