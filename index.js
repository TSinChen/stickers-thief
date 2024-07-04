const MENU_ITEM_NAME = 'download-sticker'

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ITEM_NAME,
    title: '這個貼圖我偷走了',
    contexts: ['all']
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === MENU_ITEM_NAME && tab?.id && tab.url.startsWith('https://store.line.me/stickershop/product/')) {
    chrome.scripting?.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const element = window.getSelection().focusNode
        const backgroundImage = window.getComputedStyle(element).backgroundImage
        const url = backgroundImage.match(/url\("(.+)"\)/)[1]

        fetch(url)
          .then(resp => resp.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `${window.document.title}.png`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
          })
          .catch((error) => console.error(error));
      }
    });
  }
});

