// background.js

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({options: []});
});


// settings: [
//   {
//     key: 'hoge',
//     rowSelector: '',
//     columnSelectors: ['','']
//   }
// ]