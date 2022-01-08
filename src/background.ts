import { initialStorageValues } from "./initialStorageValues";

interface PageValue {
  body: string;
  title: string;
}

const pageMap = new Map<string, PageValue>();

export interface BackgroundMessage extends PageValue {
  url: string;
}

chrome.runtime.onMessage.addListener(
  ({ url, body, title }: BackgroundMessage) => pageMap.set(url, { body, title })
);

chrome.bookmarks.onCreated.addListener(async (_id, bookmark) => {
  const { url } = bookmark;

  if (!url) {
    return;
  }

  const page = pageMap.get(url);

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
