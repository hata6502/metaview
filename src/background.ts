import { initialStorageValues } from "./initialStorageValues";

export interface BackgroundMessage {
  body: string;
  title: string;
}

const pageMap = new Map<number, BackgroundMessage>();

chrome.runtime.onMessage.addListener(
  ({ body, title }: BackgroundMessage, sender) => {
    const tabID = sender.tab?.id;

    if (tabID === undefined) {
      return;
    }

    pageMap.set(tabID, { body, title });
  }
);

chrome.action.onClicked.addListener(async (tab) => {
  const tabID = tab.id;

  if (tabID === undefined) {
    return;
  }

  const page = pageMap.get(tabID);

  if (!page) {
    throw new Error("No page found for bookmark");
  }

  const { scrapboxProjectName, scrapboxURL } = await chrome.storage.sync.get(
    initialStorageValues
  );

  if (!scrapboxProjectName || !scrapboxURL) {
    chrome.runtime.openOptionsPage();

    return;
  }

  chrome.tabs.create({
    url: `${scrapboxURL}/${scrapboxProjectName}/${encodeURIComponent(
      page.title
    )}?${new URLSearchParams({ body: page.body }).toString()}`,
  });
});
