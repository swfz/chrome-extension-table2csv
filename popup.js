// Initialize button with user's preferred color

function constructPopup() {
  const box = document.querySelector('div#dlButtons');

  chrome.storage.sync.get(['options'], ({options}) => {
    console.log(options);

    const keys = options.map(option => option.key);
    console.log('keys',keys);

    for (const key of keys) {
      const dlButton = document.createElement('button');
      dlButton.classList.add('dl');
      dlButton.textContent = key;

      box.appendChild(dlButton);

      dlButton.addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: downloadCsvFromTable,
          args: [key]
        });
      });
    }
  });
}

function downloadCsvFromTable(key) {
  console.log(key);
  const downloadCsv = (filename, csvText) => {
    const a = document.createElement('a');
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvText], {type: 'text/plain'});
    const url = window.URL;
    const blobUrl = url.createObjectURL(blob);
    a.download = `${filename}.csv`;
    a.target = '_blank';
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getData = (rowSelector, columnSelectors) => {
    const rows = document.querySelectorAll(rowSelector);

    const data = Array.from(rows).map(row => {
      return columnSelectors.map(selector => {
        return row.querySelector(selector)?.textContent.trim();
      });
    });

    return data.map(row => row.join(",")).join("\n");
  }

  chrome.storage.sync.get(['options'], ({options}) => {
    console.log(options);
    const targetOption = options.find(o => o.key === key);
    console.log('target', targetOption);

    const csvData = getData(targetOption.rowSelector, targetOption.columnSelectors.map(v => v.selector));

    downloadCsv(`${key}.csv`, csvData);
  });
}

constructPopup();
