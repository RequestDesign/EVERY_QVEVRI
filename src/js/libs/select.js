import { _slideUp, _slideDown, _slideToggle } from '../utils/utils.js';

// --------------------------------------------------------------------------

class Select {
  // setup ------------------------------------------------------------------

  constructor() {
    this._this = this;

    // custom select classes
    this.classes = {
      // html build classes
      sel: 'select',
      body: 'select__body',
      label: 'select__label',
      title: 'select__title',
      val: 'select__value',
      content: 'select__content',
      options: 'select__options',
      option: 'select__option',
      scroll: 'select__scroll',
      group: 'select__group',
      inp: 'select__input',
      asset: 'select__asset',
      txt: 'select__text',
      hint: 'select__hint',

      // state classes
      active: '_select-active',
      focused: '_select-focused',
      opened: '_select-opened',
      filled: '_select-filled',
      selected: '_select-selected',
      disabled: '_select-disabled',

      // additional classes
      list: '_select-list',
      error: '_select-error',
      multiple: '_select-multiple',
      checkbox: '_select-checkbox',
      label: '_select-label',
    };

    // all select items
    const selectList = document.querySelectorAll('select');
    if (selectList.length) {
      this.init(selectList);
    }
  }

  // select initialization & build ------------------------------------------

  // initialization
  init(selectList) {
    // init
    selectList.forEach((select, index) => {
      if (!select.classList.contains('star-rating')) {
        this.initSelItem(select, index + 1);
      }
    });

    // events
    document.addEventListener(
      'click',
      function (e) {
        this.setActions(e);
      }.bind(this)
    );
    document.addEventListener(
      'keydown',
      function (e) {
        this.setActions(e);
      }.bind(this)
    );
    document.addEventListener(
      'focusin',
      function (e) {
        this.setActions(e);
      }.bind(this)
    );
    document.addEventListener(
      'focusout',
      function (e) {
        this.setActions(e);
      }.bind(this)
    );
  }
  // single select item initialization
  initSelItem(relativeSel, index) {
    const _this = this;
    const select = document.createElement('div');

    select.classList.add(this.classes.sel);
    relativeSel.parentNode.insertBefore(select, relativeSel);
    select.appendChild(relativeSel);
    relativeSel.hidden = true;
    index ? (relativeSel.dataset.selId = index) : null;

    if (this.getPlaceholder(relativeSel)) {
      relativeSel.dataset.optPlaceholder =
        this.getPlaceholder(relativeSel).value;
      if (this.getPlaceholder(relativeSel).label.show) {
        const selTitle = this.getSelect(select, this.classes.title).twinSel;
        selTitle.insertAdjacentHTML(
          'afterbegin',
          `<span class="${this.classes.label}">${
            this.getPlaceholder(relativeSel).label.text
              ? this.getPlaceholder(relativeSel).label.text
              : this.getPlaceholder(relativeSel).value
          }</span>`
        );
      }
    }
    select.insertAdjacentHTML(
      'beforeend',
      `<div class="${this.classes.body}"><div hidden class="${this.classes.options}"></div></div>`
    );
    this.build(relativeSel);

    relativeSel.dataset.speed = relativeSel.dataset.speed
      ? relativeSel.dataset.speed
      : '150';
    relativeSel.addEventListener('change', function (e) {
      _this.initSelections(e);
    });
  }
  // select build
  build(relativeSel) {
    const select = relativeSel.parentElement;

    // set id
    select.dataset.selId = relativeSel.dataset.selId;
    // set value
    this.setValue(select, relativeSel);
    // set options
    this.setOptions(select, relativeSel);
    // set css modificator
    relativeSel.dataset.selAddonClass
      ? select.classList.add(`select_${relativeSel.dataset.selAddonClass}`)
      : null;
    // set class if select is multiple
    relativeSel.multiple
      ? select.classList.add(this.classes.multiple)
      : select.classList.remove(this.classes.multiple);
    // set class if select checkboxes are set
    relativeSel.hasAttribute('data-sel-checkboxes') && relativeSel.multiple
      ? select.classList.add(this.classes.checkbox)
      : select.classList.remove(this.classes.checkbox);
    // disable select
    this.disableSelect(select, relativeSel);
    // set search actions if data-sel-search is set
    relativeSel.hasAttribute('data-sel-search')
      ? this.setSearchActions(select)
      : null;
    // set select actions if it's initially opened
    relativeSel.hasAttribute('data-sel-opened') ? this.setAction(select) : null;

    // set select hint
    if (relativeSel.dataset.selHint) {
      relativeSel.parentElement.insertAdjacentHTML(
        'beforeend',
        `<div class="select__hint">${relativeSel.dataset.selHint}</div>`
      );
    }

    // show / hide selection from select title
    if (relativeSel.hasAttribute('data-show-val')) {
      select.classList.add('_select-show-val');
    } else {
      select.classList.remove('_select-show-val');
    }
  }
  // set twin select title value
  setValue(select, relativeSel) {
    const selBody = this.getSelect(select, this.classes.body).twinSel;
    const selTitle = this.getSelect(select, this.classes.title).twinSel;

    if (selTitle) selTitle.remove();
    selBody.insertAdjacentHTML(
      'afterbegin',
      this.getValue(select, relativeSel)
    );
  }
  // set twin select options
  setOptions(select, relativeSel) {
    const options = this.getSelect(select, this.classes.options).twinSel;

    options.innerHTML = this.getOptions(relativeSel);
    options
      .querySelector(`.${this.classes.option}`)
      .classList.add(this.classes.selected);
  }
  // disable select
  disableSelect(select, relativeSel) {
    if (relativeSel.disabled) {
      select.classList.add(this.classes.disabled);
      this.getSelect(select, this.classes.title).twinSel.disabled = true;
    } else {
      select.classList.remove(this.classes.disabled);
      this.getSelect(select, this.classes.title).twinSel.disabled = false;
    }
  }

  // main actions -----------------------------------------------------------

  // set main actions
  setActions(e) {
    const target = e.target;
    const type = e.type;

    if (
      target.closest(this.getClass(this.classes.sel)) ||
      target.closest(this.getClass(this.classes.list))
    ) {
      const select = target.closest('.select')
        ? target.closest('.select')
        : document.querySelector(
            `.${this.classes.sel}[data-sel-id="${
              target.closest(this.getClass(this.classes.list)).dataset.selectId
            }"]`
          );
      const relativeSel = this.getSelect(select).relativeSel;
      if (type === 'click') {
        if (!relativeSel.disabled) {
          if (target.closest(this.getClass(this.classes.list))) {
            const selList = target.closest(this.getClass(this.classes.list));
            const selOption = document.querySelector(
              `.${this.classes.sel}[data-sel-id="${selList.dataset.selId}"] .select__option[data-opt-val="${selList.dataset.optVal}"]`
            );
            this.setOptionAction(select, relativeSel, selOption);
          } else if (target.closest(this.getClass(this.classes.title))) {
            this.setAction(select);
          } else if (target.closest(this.getClass(this.classes.option))) {
            const selOption = target.closest(
              this.getClass(this.classes.option)
            );
            this.setOptionAction(select, relativeSel, selOption);
          }
        }
      } else if (type === 'focusin' || type === 'focusout') {
        if (target.closest(this.getClass(this.classes.sel))) {
          if (type === 'focusin') {
            select.classList.add(this.classes.focused);
          } else {
            select.classList.remove(this.classes.focused);
            if (relativeSel.hasAttribute('data-validate')) {
              if (!select.classList.contains(this.classes.filled)) {
                this.addErr(relativeSel, select);
              } else {
                this.removeErr(relativeSel, select);
              }
            }
          }
        }
      } else if (type === 'keydown' && e.code === 'Escape') {
        this.closeGroup();
      }
    } else {
      this.closeGroup();
    }
  }
  // set single select action
  setAction(select) {
    const relativeSel = this.getSelect(select).relativeSel;
    const selOptions = this.getSelect(select, this.classes.options).twinSel;

    if (relativeSel.closest('[data-one-select]')) {
      const selectOneGroup = relativeSel.closest('[data-one-select]');
      this.closeGroup(selectOneGroup);
    }

    if (!selOptions.classList.contains('_slide')) {
      select.classList.toggle(this.classes.opened);
      _slideToggle(selOptions, relativeSel.dataset.speed);
      if (
        select.classList.contains(this.classes.opened) &&
        relativeSel.hasAttribute('data-validate') &&
        select.classList.contains(this.classes.error)
      ) {
        this.removeErr(relativeSel, select);
      }
    }
  }
  // close single select group
  closeGroup(group) {
    const selGroup = group ? group : document;
    const selections = selGroup.querySelectorAll(
      `${this.getClass(this.classes.sel)}${this.getClass(this.classes.opened)}`
    );
    if (selections.length) {
      selections.forEach(selection => {
        this.closeItem(selection);
      });
    }
  }
  // close single select item
  closeItem(select) {
    const relativeSel = this.getSelect(select).relativeSel;
    const selOptions = this.getSelect(select, this.classes.options).twinSel;

    if (!selOptions.classList.contains('_slide')) {
      select.classList.remove(this.classes.opened);
      _slideUp(selOptions, relativeSel.dataset.speed);
    }
  }
  // set single option actions
  setOptionAction(select, relativeSel, option) {
    if (relativeSel.multiple) {
      option.classList.toggle(this.classes.selected);
      const relativeSelections = this.getData(relativeSel).elements;

      relativeSelections.forEach(relativeSelection => {
        relativeSelection.removeAttribute('selected');
      });

      const twinSelections = select.querySelectorAll(
        this.getClass(this.classes.selected)
      );
      twinSelections.forEach(twinSelection => {
        relativeSel
          .querySelector(`option[value="${twinSelection.dataset.optVal}"]`)
          .setAttribute('selected', 'selected');
      });
      if (!option.classList.contains(this.classes.selected)) {
        console.log(
          relativeSel.querySelector(`option[value="${option.dataset.optVal}"]`)
        );
        relativeSel
          .querySelector(`option[value="${option.dataset.optVal}"]`)
          .removeAttribute('selected');
      }
    } else {
      select
        .querySelectorAll('.select__option')
        .forEach(opt => opt.classList.remove(this.classes.selected));
      option.classList.add(this.classes.selected);
      if (!relativeSel.hasAttribute('data-show-selection')) {
        if (
          select.querySelector(`${this.getClass(this.classes.option)}[hidden]`)
        ) {
          select.querySelector(
            `${this.getClass(this.classes.option)}[hidden]`
          ).hidden = false;
        }
        option.hidden = true;
      }
      relativeSel.value = option.hasAttribute('data-opt-val')
        ? option.dataset.optVal
        : option.textContent;
      this.setAction(select);
    }
    this.setValue(select, relativeSel);
    this.setSelections(relativeSel);
  }
  // set search actions
  setSearchActions(select) {
    const _this = this;
    const selInput = this.getSelect(select, this.classes.inp).twinSel;
    const selOptions = this.getSelect(
      select,
      this.classes.options
    ).twinSel.querySelectorAll(`.${this.classes.option}`);

    selInput.addEventListener('input', function () {
      selOptions.forEach(selOption => {
        if (
          selOption.textContent
            .toUpperCase()
            .indexOf(selInput.value.toUpperCase()) >= 0
        ) {
          selOption.hidden = false;
        } else {
          selOption.hidden = true;
        }
      });
      selOptions.hidden === true ? _this.setAction(select) : null;
    });
  }
  // set select subtitle
  setSubtitle(relativeSel) {}

  // validation -------------------------------------------------------------

  // add an error to a select
  addErr(relativeSel, select) {
    select.classList.add(this.classes.error);

    if (relativeSel.dataset.selError && !relativeSel.dataset.selHint) {
      relativeSel.parentElement.insertAdjacentHTML(
        'beforeend',
        `<div class="select__hint">${relativeSel.dataset.selError}</div>`
      );
    }
  }
  // remove an error from a select
  removeErr(relativeSel, select) {
    if (select.classList.contains(this.classes.error)) {
      select.classList.remove(this.classes.error);
    }
    if (
      relativeSel.parentElement.querySelector('.select__hint') &&
      !relativeSel.dataset.selHint
    ) {
      relativeSel.parentElement.removeChild(
        relativeSel.parentElement.querySelector('.select__hint')
      );
    }
  }

  // utils ------------------------------------------------------------------

  // get custom class
  getClass(cssClass) {
    return `.${cssClass}`;
  }
  // get single select item
  getSelect(select, cssClass) {
    return {
      relativeSel: select.querySelector('select'),
      twinSel: select.querySelector(this.getClass(cssClass)),
    };
  }
  // get selected item value
  getValue(select, relativeSel) {
    let attr,
      attrClass,
      titleVal = this.getData(relativeSel, 2).html;

    // set title value
    titleVal = titleVal.length
      ? titleVal
      : relativeSel.dataset.selLabel
      ? relativeSel.dataset.selLabel
      : '';

    // set active class to select if it contains any values
    if (this.getData(relativeSel).values.length) {
      select.classList.add(this.classes.active);
    } else {
      select.classList.remove(this.classes.active);
    }

    // set select label
    if (relativeSel.hasAttribute('data-sel-label')) {
      attr = relativeSel.dataset.selLabel
        ? ` data-sel-label="${relativeSel.dataset.selLabel}"`
        : ` data-sel-label="Выбор"`;
      attrClass = ` ${this.classes.label}`;
    }

    // push selections to the list inside of select title
    if (relativeSel.multiple && relativeSel.hasAttribute('data-sel-list')) {
      titleVal = this.getData(relativeSel)
        .elements.map(
          option =>
            `<span data-opt-id="${select.dataset.selId}" data-opt-val="${
              option.value
            }" class="_list-item">${this.getContent(option)}</span>`
        )
        .join('');

      if (
        relativeSel.dataset.list &&
        document.querySelector(relativeSel.dataset.list)
      ) {
        document.querySelector(relativeSel.dataset.list).innerHTML = titleVal;
        if (relativeSel.hasAttribute('data-sel-search')) titleVal = false;
      }
    }

    // init select search
    if (relativeSel.hasAttribute('data-sel-search')) {
      return `<div class="${this.classes.title}"><span ${attr} class="${this.classes.val}"><input autocomplete="off" type="search" placeholder="${titleVal}" data-placeholder="${titleVal}" class="${this.classes.inp}"></span></div>`;
    } else {
      const customClass =
        this.getData(relativeSel).elements.length &&
        this.getData(relativeSel).elements[0].dataset.optClass
          ? ` ${this.getData(relativeSel).elements[0].dataset.optClass}`
          : '';
      return `<button type="button" class="${this.classes.title}"><span ${
        attr ? attr : ''
      } class="${this.classes.val} ${
        attrClass ? attrClass : ''
      }"><span class="${
        this.classes.content
      }${customClass}">${titleVal}</span></span></button>`;
    }
  }
  // get options
  getOptions(relativeSel) {
    const selScroll = relativeSel.hasAttribute('data-sel-scroll')
      ? `data-simplebar`
      : '';
    let selScrollHeight = relativeSel.dataset.selScroll
      ? `style="max-height:${relativeSel.dataset.selScroll}px"`
      : '';
    let selOptions = Array.from(relativeSel.options);

    if (selOptions.length) {
      let selOptionsHTML = ``;

      if (
        (this.getPlaceholder(relativeSel) &&
          !this.getPlaceholder(relativeSel).show) ||
        relativeSel.multiple
      ) {
        selOptions = selOptions.filter(option => option.value);
      }
      selOptionsHTML += selScroll
        ? `<div ${selScroll} ${selScrollHeight} class="${this.classes.scroll}">`
        : '';
      selOptions.forEach(option => {
        selOptionsHTML += this.getOption(option, relativeSel);
      });
      selOptionsHTML += selScroll ? `</div>` : '';
      return selOptionsHTML;
    }
  }
  // get option
  getOption(option, relativeSel) {
    const selections =
      option.selected && relativeSel.multiple
        ? ` ${this.classes.selected}`
        : '';
    const showSelection =
      option.selected &&
      !relativeSel.hasAttribute('data-show-selection') &&
      !relativeSel.multiple
        ? `hidden`
        : ``;
    const optionClass = option.dataset.optClass
      ? ` ${option.dataset.optClass}`
      : '';
    const optionLink = option.dataset.optionLink
      ? option.dataset.optionLink
      : false;
    const optionLinkTarget = option.hasAttribute('data-option-link-target')
      ? `target="_blank"`
      : '';
    let optionHTML = ``;

    optionHTML += optionLink
      ? `<a ${optionLinkTarget} ${showSelection} href="${optionLink}" data-opt-val="${option.value}" class="${this.classes.option}${optionClass}${selections}">`
      : `<button ${showSelection} class="${this.classes.option}${optionClass}${selections}" data-opt-val="${option.value}" type="button">`;
    optionHTML += this.getContent(option);
    optionHTML += optionLink ? `</a>` : `</button>`;
    return optionHTML;
  }
  // get select content
  getContent(option) {
    const optionData = option.dataset.optAsset
      ? `${option.dataset.optAsset}`
      : '';
    const optionDataHTML =
      optionData.indexOf('img') >= 0
        ? `<img src="${optionData}" alt="">`
        : optionData;
    let optionContentHTML = ``;

    optionContentHTML += optionData
      ? `<span class="${this.classes.group}">`
      : '';
    optionContentHTML += optionData
      ? `<span class="${this.classes.asset}">`
      : '';
    optionContentHTML += optionData ? optionDataHTML : '';
    optionContentHTML += optionData ? `</span>` : '';
    optionContentHTML += optionData ? `<span class="${this.classes.txt}">` : '';
    optionContentHTML += option.textContent;
    optionContentHTML += optionData ? `</span>` : '';
    optionContentHTML += optionData ? `</span>` : '';
    return optionContentHTML;
  }
  // get select placeholder
  getPlaceholder(relativeSel) {
    const placeholder = Array.from(relativeSel.options).find(
      option => !option.value
    );

    if (placeholder) {
      placeholder.classList.add(this.classes.subtitle);
      return {
        value: placeholder.textContent,
        show: placeholder.hasAttribute('data-sel-ph-show'),
        label: {
          show: placeholder.hasAttribute('data-sel-ph'),
          text: placeholder.dataset.optPlaceholder,
        },
      };
    }
  }
  // get selected options data
  getData(relativeSel) {
    let selections = [];

    if (relativeSel.multiple) {
      selections = Array.from(relativeSel.options)
        .filter(option => option.value)
        .filter(option => option.selected);
    } else {
      selections.push(relativeSel.options[relativeSel.selectedIndex]);
    }
    return {
      elements: selections.map(option => option),
      values: selections
        .filter(option => option.value)
        .map(option => option.value),
      html: selections.map(option => this.getContent(option)),
    };
  }

  // selections -------------------------------------------------------------

  // init selections
  initSelections(e) {
    const relativeSel = e.target;

    this.build(relativeSel);
    this.setSelections(relativeSel);
  }
  // set selections
  setSelections(relativeSel) {
    const select = relativeSel.parentElement;

    if (relativeSel.hasAttribute('data-submit') && relativeSel.value) {
      let tempButton = document.createElement('button');
      tempButton.type = 'submit';
      relativeSel.closest('form').append(tempButton);
      tempButton.click();
      tempButton.remove();
    }
    relativeSel.parentElement.classList.add(this.classes.filled);
    this.selection(select, relativeSel);
  }
  // custom select event (listen to any selections / mutations)
  selection(select, relativeSel) {
    document.dispatchEvent(
      new CustomEvent('selection', {
        detail: {
          select: relativeSel,
        },
      })
    );
  }
}
new Select({});
