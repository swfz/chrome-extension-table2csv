let page = document.getElementById("buttonDiv");
function constructOptions() {
  const saveInputs = () => {
    const columnSelectors = document.querySelectorAll('input[name="columnSelectors"]');
    const columnSelectorValues = Array.from(columnSelectors).map(input => input.value).filter(v => v !== '');

    console.log(columnSelectorValues);

    const rowSelector = document.querySelectorAll('input[name="rowSelector"]');
    const rowSelectorValue = rowSelector.value;

    chrome.storage.sync.set({rowSelector: rowSelectorValue, columnSelectors: columnSelectorValues});
  }

  const addColumnSelectorInput = (event, value = '') => {
    console.log(value);
    const columnSelectorsSpan = document.getElementById('columnSelectorsInput');

    const columnSelectorsInputElem = document.createElement('input');
    columnSelectorsInputElem.name = 'columnSelectors';
    columnSelectorsInputElem.value = value;
    columnSelectorsInputElem.size = 50;

    columnSelectorsSpan.appendChild(columnSelectorsInputElem);
    const br = document.createElement('br');
    columnSelectorsSpan.appendChild(br);
  }

  chrome.storage.sync.get(['rowSelector', 'columnSelectors'], (options) => {
    console.log(options);
    // rowSelector
    const rowSelectorSpan = document.getElementById('rowSelectorInput');

    const rowSelectorInputElem = document.createElement('input');
    rowSelectorInputElem.value = options.rowSelector;
    rowSelectorInputElem.size = 50;

    rowSelectorSpan.appendChild(rowSelectorInputElem);

    options.columnSelectors.forEach(columnSelector => {
      addColumnSelectorInput(null, columnSelector);
    });

    // add selector event listener
    const incrButton = document.getElementById('addColumnSelector');
    incrButton.addEventListener('click', addColumnSelectorInput);

    const saveButton = document.getElementById('saveSelector');
    saveButton.addEventListener('click', saveInputs);
  });
}

constructOptions();
