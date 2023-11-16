// remove class from all array elements
export function removeClasses(array, className) {
  for (var i = 0; i < array.length; i++) {
    array[i].classList.remove(className);
  }
}

// convert rem
export const rem = rem => {
  if (window.innerWidth > 768) {
    return 0.005208335 * window.innerWidth * rem;
  } else {
    return (100 / 390) * (0.1 * window.innerWidth) * rem;
  }
};
