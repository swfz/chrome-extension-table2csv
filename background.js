// background.js

let color = '#3333FF';

chrome.runtime.onInstalled.addListener(() => {
  console.log('hoge');
  chrome.storage.sync.set({ color });

  console.log('Default background color set to %cgreen', `color: ${color}`);
});
