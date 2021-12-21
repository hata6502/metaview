const pageMap = new Map();

chrome.runtime.onMessage.addListener(
  ({ url, description, imageURL, metadata, title }) => {
    pageMap.set(url, {
      description,
      imageURL,
      metadata,
      title,
    });
  }
);

chrome.bookmarks.onCreated.addListener(async (_id, bookmark) => {
  const page = pageMap.get(bookmark.url);

  if (!page) {
    throw new Error("No page found for bookmark");
  }

  const imageResponse = await fetch(
    await getImageDataURL({ imageURL: page.imageURL })
  );

  if (!imageResponse.ok) {
    throw new Error("Failed to fetch image");
  }

  const imageBitmap = await createImageBitmap(await imageResponse.blob());

  const offscreenCanvas = new OffscreenCanvas(
    imageBitmap.width,
    imageBitmap.height + 1
  );

  const canvasContext = offscreenCanvas.getContext("2d");

  canvasContext.drawImage(imageBitmap, 0, 0);

  [...Array(8).keys()].forEach((x) => {
    canvasContext.fillStyle = `rgba(${Math.floor(
      Math.random() * 256
    )}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
      Math.random() * 256
    )},  ${1 / 255})`;

    canvasContext.fillRect(x, imageBitmap.height, 1, 1);
  });

  const fileReader = new FileReader();

  fileReader.onerror = () => {
    throw fileReader.error;
  };

  fileReader.onload = async () => {
    const formData = new FormData();

    formData.append("app", "zukan");
    formData.append("client_id", "gAvDn6SqYstuQ5s_SfgKmzBsUlNryxJX4bnUHFyyYhU");
    formData.append("desc", page.description);
    formData.append("image_url", fileReader.result);
    formData.append("referer_url", bookmark.url);

    formData.append(
      "title",
      `${page.title}　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　　${page.metadata}`
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
  };

  fileReader.readAsDataURL(await offscreenCanvas.convertToBlob());
});

const getImageDataURL = async ({ imageURL }) => {
  // https://github.com/googlefonts/noto-emoji/blob/main/png/512/emoji_u1f4c4.png
  const fallbackDataURL =
    "data:image/png;base64,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";

  if (!imageURL) {
    return fallbackDataURL;
  }

  let response;

  try {
    response = await fetch(imageURL);
  } catch (exception) {
    console.error(exception);

    return fallbackDataURL;
  }

  if (!response.ok) {
    return fallbackDataURL;
  }

  const blob = await response.blob();

  try {
    return await new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onerror = () => {
        reject(fileReader.error);
      };

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.readAsDataURL(blob);
    });
  } catch (exception) {
    console.error(exception);

    return fallbackDataURL;
  }
};
