const downloadCsv = (filename, csvText) => {
  const a = document.createElement('a');
  const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
  const blob = new Blob([bom, csvText], {type: 'text/csv'});
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.key) {
    console.log('content_script: message received.');
    console.log(message);
    const key = message.key;
  
    chrome.storage.sync.get(['options'], ({options}) => {
      const targetOption = options.find(o => o.key === key);
      console.log('targetOption:', targetOption);
    
      const csvData = getData(targetOption.rowSelector, targetOption.columnSelectors.map(v => v.selector));
  
      downloadCsv(`${key}`, csvData);
    });
    endResponse({result: true});
  }
});