const pageMap = new Map();

chrome.runtime.onMessage.addListener(
  ({ url, description, imageDataURL, title }) => {
    pageMap.set(url, {
      description,
      imageDataURL,
      title,
    });
  }
);

chrome.bookmarks.onCreated.addListener(async (_id, bookmark) => {
  const page = pageMap.get(bookmark.url);

  if (!page) {
    throw new Error("No page found for bookmark");
  }

  const formData = new FormData();

  formData.append("app", "Zukan");
  formData.append("client_id", "gAvDn6SqYstuQ5s_SfgKmzBsUlNryxJX4bnUHFyyYhU");
  formData.append("image_url", page.imageDataURL);
  formData.append("referer_url", bookmark.url);
  formData.append("title", page.title);

  formData.append(
    "desc",
    [page.title, bookmark.url, page.description]
      .filter((line) => line)
      .join("\n")
  );

  const uploadResponse = await fetch(
    "https://upload.gyazo.com/api/upload/easy_auth",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!uploadResponse.ok) {
    throw new Error(uploadResponse.statusText);
  }

  const uploadResponseJSON = await uploadResponse.json();

  chrome.tabs.create({ url: uploadResponseJSON.get_image_url });
});
