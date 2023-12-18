import 'swiped';
import { rem } from './utils.js';

// --------------------------------------------------------------------------

const swipeDetect = () => {
  if (
    document.querySelectorAll('.products-cart__item-wrap').length &&
    window.innerWidth <= 768
  ) {
    const cartItems = document.querySelectorAll('.products-cart__item-wrap');
    cartItems.forEach(cartItem => {
      console.log(cartItem);
      Swiped.init({
        query: `.${cartItem.className}`,
        right: rem(6),
      });
    });
  }
};
swipeDetect();

window.addEventListener('resize', swipeDetect);
