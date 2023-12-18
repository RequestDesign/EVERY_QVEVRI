import '../scss/style.scss';

// ---------------------------------- utils ---------------------------------

import * as utils from './utils/utils.js';

// menu
utils.menuInit();

// accordion
utils.accordion();

// showmore
utils.showmore();

// tabs
utils.tabs();

// --------------------------------- libs -----------------------------------

// select
import './libs/select.js';

// dynamic dom
import './libs/da.js';

// modals
import './libs/modals.js';

// star rating
import './libs/star_rating.js';

// --------------------------------- scroll ---------------------------------

import * as scroll from './utils/scroll.js';

// header scroll
scroll.headerScroll();

// page navigation
scroll.pageNavigation();

// ---------------------------------- form ----------------------------------

import * as forms from './utils/form/form.js';

// form fields
forms.formFieldsInit({ viewPass: false });

// form submit
forms.formSubmit();

// quantity
forms.formQuantity();

// range slider
import './utils/form/range_slider.js';

// --------------------------------- swiper ---------------------------------

import './utils/sliders.js';

// ----------------------------------- map ----------------------------------

import './utils/map.js';

// -------------------------------- simplebar -------------------------------

import './utils/simplebar.js';

// ------------------------------- input mask -------------------------------

import './utils/form/input_mask.js';

// ------------------------------ swipe detect ------------------------------

import './utils/swipe_detect.js';

// --------------------------------------------------------------------------

// scripts
import './utils/script';
