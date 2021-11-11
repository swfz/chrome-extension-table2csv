function constructOptions() {

  const saveInputs = function(event) {
    const inputKeys = this.keys;

    console.log('inputKeys', inputKeys);

    const options = inputKeys.map(inputKey => {
      const key = document.querySelector(`input[name="key_${inputKey}"]`).value;
      const rowSelector = document.querySelector(`input[name="row_${inputKey}"]`).value;
      const columnSelectorInputs = document.querySelectorAll(`input[name="column_${inputKey}"]`);
      const columnSelectors = Array.from(columnSelectorInputs).map(input => input.value).filter(v => v !== '');

      return {key, rowSelector, columnSelectors};
    });

    const filteredOptions = options.filter(f => f.key !== '');
    console.log(filteredOptions);

    chrome.storage.sync.set({options: filteredOptions});
  }


  const br = () => {
    return document.createElement('br');
  }

  const divider = () => {
    return document.createElement('hr');
  }

  const plusButton = (name = '') => {
    const elem = document.createElement('button');
    elem.textContent = '+';
    elem.name = name;

    return elem;
  }

  const addKeyInput = (parentElem, name, value) => {
    const label = document.createElement('span');
    label.textContent = 'Key: ';

    const input = document.createElement('input');
    input.value = value;
    input.name = name;
    input.size = 10;

    parentElem.appendChild(label);
    parentElem.appendChild(input);

    parentElem.appendChild(br());
  }

  const addRowSelectorInput = (parentElem, name, value) => {
    const label = document.createElement('span');
    label.textContent = 'row: ';

    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    input.size = 50;

    parentElem.appendChild(label);
    parentElem.appendChild(input);

    parentElem.appendChild(br());
  }

  const columnSelectorBox = (name = '') => {
    const elem = document.createElement('div');
    elem.classList.add('column');

    return elem;
  }

  const addColumnSelectorInput = (parentElem, name, value) => {
    const label = document.createElement('span');
    label.textContent = 'column: ';

    const input = document.createElement('input');
    input.name = name;
    input.value = value;
    input.size = 50;

    parentElem.appendChild(label);
    parentElem.appendChild(input);

    parentElem.appendChild(br());
  }

  const addColumnSelectorsInput = function(event) {
    console.log(event);
    console.log(this);
    const parent = this.parent;
    const value = this.value;
    const name = this.name;

    addColumnSelectorInput(parent, name, value);
  }

  chrome.storage.sync.get(['options'], ({options}) => {
    console.log('options:', options);
    const box = document.querySelector('div#optionsList');
    const keys = options.map(option => option.key);
    console.log('keys: ', keys);

    if(options.length > 0) {
      for (const option of options) {
        const rowSelector = option.rowSelector;
        const key = option.key;
        const columnSelectors = option.columnSelectors;

        addKeyInput(box, `key_${key}`, key);
        addRowSelectorInput(box, `row_${key}`, rowSelector);
        const columnBox = columnSelectorBox();
        for (const selector of columnSelectors) {
          addColumnSelectorInput(columnBox, `column_${key}`, selector);
        }

        const plus = plusButton(`plus_${key}`);
        plus.addEventListener('click', {parent: columnBox, name: `column_${key}`, value: '', handleEvent: addColumnSelectorsInput});

        box.appendChild(columnBox);
        box.appendChild(plus);
        box.appendChild(divider());
      }
    }
    // new option
    addKeyInput(box, 'key_new', '');
    addRowSelectorInput(box, 'row_new', '');
    const columnBox = columnSelectorBox();
    addColumnSelectorInput(columnBox, 'column_new', '');

    // + button
    const plus = plusButton('first');
    plus.addEventListener('click', {parent: columnBox, value: '', handleEvent: addColumnSelectorsInput});

    box.appendChild(columnBox);
    box.appendChild(plus);


    box.appendChild(br());
    box.appendChild(divider());

    const saveButton = document.getElementById('saveSelector');
    saveButton.addEventListener('click', {keys: keys.concat('new'), handleEvent: saveInputs});
  });
}

constructOptions();
