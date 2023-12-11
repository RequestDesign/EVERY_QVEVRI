import '../scss/style.scss';

// ---------------------------------- utils ---------------------------------

import * as utils from './utils/utils.js';

// menu
utils.menuInit();

// spoilers
utils.spoilers();

// showmore
utils.showmore();

// tabs
utils.tabs();

// --------------------------------- scroll ---------------------------------

import * as scroll from './utils/scroll.js';

// header scroll
scroll.headerScroll();

// ---------------------------------- form ----------------------------------

import * as forms from './utils/form/form.js';

// form fields
forms.formFieldsInit({ viewPass: false });

// form submit
forms.formSubmit();

// quantity
forms.formQuantity();

// --------------------------------- swiper ---------------------------------

import './utils/sliders.js';

// ----------------------------------- map ----------------------------------

import './utils/map.js';

// -------------------------------- simplebar -------------------------------

import './utils/simplebar.js';

// ------------------------------- input mask -------------------------------

import './utils/form/input_mask.js';

// --------------------------------- libs -----------------------------------

// select
import './libs/select.js';

// dynamic dom
import './libs/da.js';

// modals
import './libs/modals.js';

// star rating
import './libs/star_rating.js';

// --------------------------------------------------------------------------

// scripts
import './utils/script';
