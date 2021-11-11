let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#3aa757", "#e8453c", "#f9bb2d", "#4688f1"];

// Reacts to a button click by marking the selected button and saving
// the selection
function handleButtonClick(event) {
  // Remove styling from the previously selected color
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  // Mark the button as selected
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}

// Add a button to the page for each supplied color
function constructOptions(buttonColors) {

  chrome.storage.sync.get("color", (data) => {
    let currentColor = data.color;
    // For each color we were provided…
    for (let buttonColor of buttonColors) {
      // …create a button with that color…
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
      button.style.backgroundColor = buttonColor;

      // …mark the currently selected color…
      if (buttonColor === currentColor) {
        button.classList.add(selectedClassName);
      }

      // …and register a listener for when that button is clicked
      button.addEventListener("click", handleButtonClick);
      page.appendChild(button);
    }
  });

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

// Initialize the page by constructing the color options
constructOptions(presetButtonColors);


