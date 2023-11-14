import '../scss/style.scss';

// ---------------------------------- utils ---------------------------------

// import * as utils from './utils/utils.js'

// ---------------------------------- form ----------------------------------

import * as forms from './utils/form/form.js';

// form fields
forms.formFieldsInit({ viewPass: false });

// form submit
forms.formSubmit();

// --------------------------------- swiper ---------------------------------

import './utils/sliders.js';

// --------------------------------------------------------------------------

// scripts
import './utils/script';
