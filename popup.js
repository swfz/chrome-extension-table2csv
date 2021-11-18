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

        chrome.tabs.sendMessage(tab.id, {key: key}, (res) => console.log('response', res));
      });
    }
  });
}

constructPopup();
