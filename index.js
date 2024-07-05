const MENU_ITEM_NAME = '這個貼圖我偷走了'

const MENU_SUB_ITEM_NAME = {
  downloadImage: {
    id: 'downloadImage',
    title: '下載',
  },
  copyImage: {
    id: 'copyImage',
    title: '複製',
  }
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ITEM_NAME,
    title: MENU_ITEM_NAME,
    contexts: ['all'],
    documentUrlPatterns: ['https://store.line.me/stickershop/product/*'],
  });
  chrome.contextMenus.create({
    id: MENU_SUB_ITEM_NAME.downloadImage.id,
    title: MENU_SUB_ITEM_NAME.downloadImage.title,
    parentId: MENU_ITEM_NAME,
  });
  chrome.contextMenus.create({
    id: MENU_SUB_ITEM_NAME.copyImage.id,
    title: MENU_SUB_ITEM_NAME.copyImage.title,
    parentId: MENU_ITEM_NAME,
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id) return

  switch (info.menuItemId) {
    case MENU_SUB_ITEM_NAME.downloadImage.id:
      chrome.scripting?.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const backgroundImage = window.getComputedStyle(window.getSelection().focusNode).backgroundImage
          const url = backgroundImage.match(/url\("(.+)"\)/)[1]
          fetch(url)
            .then(res => res.blob())
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
        }
      });
      break
    case MENU_SUB_ITEM_NAME.copyImage.id:
      chrome.scripting?.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const backgroundImage = window.getComputedStyle(window.getSelection().focusNode).backgroundImage
          const url = backgroundImage.match(/url\("(.+)"\)/)[1]
          fetch(url)
            .then(res => res.blob())
            .then(blob => {
              navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
            })
        }
      });
      break
    default:
      break
  }

});

