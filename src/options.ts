import { initialStorageValues } from "./initialStorageValues";

const scrapboxProjectNameInputElement = document.querySelector(
  "#scrapbox-project-name-input"
);

const scrapboxURLInputElement = document.querySelector("#scrapbox-url-input");

if (
  !(scrapboxProjectNameInputElement instanceof HTMLInputElement) ||
  !(scrapboxURLInputElement instanceof HTMLInputElement)
) {
  throw new Error("Cannot find scrapbox project name or URL input element");
}

scrapboxProjectNameInputElement.addEventListener("input", () =>
  chrome.storage.sync.set({
    scrapboxProjectName: scrapboxProjectNameInputElement.value,
  })
);

scrapboxURLInputElement.addEventListener("input", () =>
  chrome.storage.sync.set({
    scrapboxURL: scrapboxURLInputElement.value,
  })
);

const { scrapboxProjectName, scrapboxURL } = await chrome.storage.sync.get(
  initialStorageValues
);

scrapboxProjectNameInputElement.value = scrapboxProjectName;
scrapboxURLInputElement.value = scrapboxURL;
