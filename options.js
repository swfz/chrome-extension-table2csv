function constructOptions() {

  const saveInputs = function(event) {
    const inputKeys = this.keys;

    console.log('inputKeys', inputKeys);

    const options = inputKeys.map(inputKey => {
      const key = document.querySelector(`input[name="key_${inputKey}"]`).value;
      const rowSelector = document.querySelector(`input[name="row_${inputKey}"]`).value;
      const columnSelectorValues = Array.from(document.querySelectorAll(`input[name="column_${inputKey}"]`)).map(input => input.value);
      const columnRemarkValues = Array.from(document.querySelectorAll(`input[name="remark_${inputKey}"]`)).map(input => input.value);
      const columnSelectors = columnSelectorValues.map((selectorValue, i) => {
        return {selector: selectorValue, remark: columnRemarkValues[i]}
      }).filter(v => v.selector !== '');

      return {key, rowSelector, columnSelectors};
    });

    const filteredOptions = options.filter(f => f.key !== '');
    console.log(filteredOptions);

    chrome.storage.sync.set({options: filteredOptions});
  }

  const importJson = function(event) {
    const rawJson = document.querySelector('textarea[name="rawjson"]').value;
    const options = JSON.parse(rawJson);

    chrome.storage.sync.set({options: options});
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
    input.placeholder = 'CSS Selector';

    parentElem.appendChild(label);
    parentElem.appendChild(input);

    parentElem.appendChild(br());
  }

  const columnSelectorBox = (name = '') => {
    const elem = document.createElement('div');
    elem.classList.add('column');

    return elem;
  }

  const addColumnSelectorInput = (parentElem, selectorName, selectorValue, remarkName, remarkValue) => {
    const label = document.createElement('span');
    label.textContent = 'column: ';

    const remarkInput = document.createElement('input');
    remarkInput.name = remarkName;
    remarkInput.value = remarkValue;
    remarkInput.size = 10;
    remarkInput.placeholder = 'Column Name';

    const selectorInput = document.createElement('input');
    selectorInput.name = selectorName;
    selectorInput.value = selectorValue;
    selectorInput.size = 50;
    selectorInput.placeholder = 'CSS Selector';

    parentElem.appendChild(label);
    parentElem.appendChild(remarkInput);
    parentElem.appendChild(selectorInput);

    parentElem.appendChild(br());
  }

  const addColumnSelectorsInput = function(event) {
    console.log(event);
    console.log(this);
    const parent = this.parent;
    const selectorName = this.selectorName;
    const selectorValue = this.selectorValue;
    const remarkName = this.remarkName;
    const remarkValue = this.remarkValue;

    addColumnSelectorInput(parent, selectorName, selectorValue, remarkName, remarkValue);
  }

  const addRawConfigurationText = (options) => {
    const rawElem = document.createElement('textarea');
    rawElem.rows = 50;
    rawElem.cols = 100;
    rawElem.name = 'rawjson';

    rawElem.value = JSON.stringify(options, null, 2);
    
    const rawBox = document.querySelector('div#raw');
    rawBox.appendChild(rawElem);
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
        const columnSelectorItems = option.columnSelectors;

        addKeyInput(box, `key_${key}`, key);
        addRowSelectorInput(box, `row_${key}`, rowSelector);
        const columnBox = columnSelectorBox();
        for (const item of columnSelectorItems) {
          addColumnSelectorInput(columnBox, `column_${key}`, item.selector, `remark_${key}`, item.remark);
        }

        const plus = plusButton(`plus_${key}`);
        plus.addEventListener('click', {
          parent: columnBox,
          selectorName: `column_${key}`,
          selectorValue: '',
          remarkName: `remark_${key}`,
          remarkValue: '',
          handleEvent: addColumnSelectorsInput
        });

        box.appendChild(columnBox);
        box.appendChild(plus);
        box.appendChild(divider());
      }
    }
    // new option
    addKeyInput(box, 'key_new', '');
    addRowSelectorInput(box, 'row_new', '');
    const columnBox = columnSelectorBox();
    addColumnSelectorInput(columnBox, 'column_new', '', 'remark_new', '');

    // + button
    const plus = plusButton('first');
    plus.addEventListener('click', {
      parent: columnBox,
      selectorName: 'column_new',
      selectorValue: '',
      remarkName: 'remark_new',
      remarkValue: '',
      handleEvent: addColumnSelectorsInput
    });

    box.appendChild(columnBox);
    box.appendChild(plus);

    box.appendChild(br());
    box.appendChild(divider());

    const saveButton = document.getElementById('saveSelector');
    saveButton.addEventListener('click', {keys: keys.concat('new'), handleEvent: saveInputs});

    const importButton = document.querySelector('button#importConfig');
    importButton.addEventListener('click', importJson);

    // raw
    addRawConfigurationText(options);
  });
}

constructOptions();
