document.addEventListener('DOMContentLoaded', function () {
  // handler functions
  const onClickHandler = e => {
    const target = e.target;
    console.log(target);

    if (target.closest('.product-card__heart-icon')) {
      target.closest('.product-card__heart-icon').classList.toggle('_active');
      e.preventDefault();
    }
  };

  // document events
  document.addEventListener('click', onClickHandler);
});
