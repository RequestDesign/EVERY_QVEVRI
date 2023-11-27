import '../scss/style.scss';

// ---------------------------------- utils ---------------------------------

import * as utils from './utils/utils.js';

// menu
utils.menuInit();

// spoilers
utils.spoilers();

// showmore
utils.showmore();

// ---------------------------------- form ----------------------------------

import * as forms from './utils/form/form.js';

// form fields
forms.formFieldsInit({ viewPass: false });

// form submit
forms.formSubmit();

// --------------------------------- swiper ---------------------------------

import './utils/sliders.js';

// ----------------------------------- map ----------------------------------

import './utils/map.js';

// --------------------------------- libs -----------------------------------

// select
import './libs/select.js';

// dynamic dom
import './libs/da.js';

// -------------------------------- simplebar -------------------------------

import './utils/simplebar.js';

// --------------------------------------------------------------------------

// scripts
import './utils/script';
