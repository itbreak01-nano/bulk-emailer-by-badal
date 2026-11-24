document.getElementById('btn-open-gmail').onclick = () => {
  chrome.tabs.create({ url: 'https://mail.google.com' });
};
