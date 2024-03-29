import { Bookmark } from "./content";
import { initialStorageValues } from "./initialStorageValues";

export type BackgroundMessage = {
  type: "getBookmark";
};

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.tabs.create({
    url: "https://chrome.google.com/webstore/detail/anno/idgkmipflfgjphmbennfclgnalmaggdm?hl=ja&authuser=0",
  });
});

chrome.action.onClicked.addListener(async (tab) => {
  if (typeof tab.id !== "number") {
    return;
  }

  const backgroundMessage: BackgroundMessage = {
    type: "getBookmark",
  };

  chrome.tabs.sendMessage(
    tab.id,
    backgroundMessage,
    async (bookmark: Bookmark) => {
      const { scrapboxProjectName, scrapboxURL } =
        await chrome.storage.sync.get(initialStorageValues);

      if (!scrapboxProjectName || !scrapboxURL) {
        chrome.runtime.openOptionsPage();

        return;
      }

      chrome.tabs.create({
        url: `${scrapboxURL}/${scrapboxProjectName}/${encodeURIComponent(
          bookmark.title
        )}?${new URLSearchParams({ body: bookmark.body }).toString()}`,
      });
    }
  );
});
