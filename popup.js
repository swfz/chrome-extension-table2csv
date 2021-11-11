// Initialize button with user's preferred color
const downloadCsv = document.getElementById("downloadCsv");

downloadCsv.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: downloadCsvFromTable,
  });
});

function downloadCsvFromTable() {
  const downloadCsv = (filename, csvText) => {
    const a = document.createElement('a');
    const mimeType = 'text/plain';
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
        return row.querySelector(selector).textContent.trim();
      });
    });

    return data.map(row => row.join(",")).join("\n");
  }

  chrome.storage.sync.get(['rowSelector', 'columnSelectors'], (options) => {
    console.log(options);
    const csvData = getData(options.rowSelector, options.columnSelectors);

    downloadCsv('hoge.csv', csvData);
  });
}
