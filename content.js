const getSingleImageURL = () => {
  const imageElements = document.querySelectorAll("img");

  if (imageElements.length !== 1) {
    return;
  }

  const imageElement = imageElements[0];

  if (!imageElement.complete || imageElement.naturalWidth < 1) {
    return;
  }

  const canvasElement = document.createElement("canvas");
  const canvasContext = canvasElement.getContext("2d");

  canvasElement.width = imageElement.naturalWidth;
  canvasElement.height = imageElement.naturalHeight;
  canvasContext.drawImage(imageElement, 0, 0);

  return canvasElement.toDataURL();
};

const sendPage = () => {
  const url = location.href;

  const title =
    document.querySelector('meta[property="og:title" i]')?.content ??
    document.title;

  const metaDescription =
    document.querySelector('meta[property="og:description" i]')?.content ??
    document.querySelector('meta[name="description" i]')?.content ??
    "";

  const metaKeywords =
    document.querySelector('meta[name="keywords" i]')?.content ?? "";

  const keywords = metaKeywords.split(",").flatMap((keyword) => {
    const trimmedKeyword = keyword.trim();

    return trimmedKeyword === "" ? [] : [trimmedKeyword];
  });

  const hashTagLine = keywords
    .map((keyword) => `#${keyword.replaceAll(" ", "_")}`)
    .join(" ");

  const description = `${[title, url, metaDescription, hashTagLine]
    .filter((line) => line)
    .join("\n\n")}\n\n`;

  const imageURL =
    document.querySelector('meta[property="og:image" i]')?.content ??
    getSingleImageURL() ??
    document.querySelector('link[rel="icon" i]')?.href ??
    "";

  const metadata = [
    ...[...document.querySelectorAll("meta[name]")].flatMap((metaElement) => {
      const content = [
        url,
        imageURL,
        metaDescription,
        metaKeywords,
        title,
      ].reduce(
        (previousValue, currentValue) =>
          previousValue.replaceAll(currentValue, ""),
        metaElement.content
      );

      return content ? [`${metaElement.name}:${content}`] : [];
    }),
    ...[
      ...document.querySelectorAll('script[type="application/ld+json" i]'),
    ].map((scriptElement) =>
      [url, imageURL, metaDescription, metaKeywords, title].reduce(
        (previousValue, currentValue) =>
          previousValue.replaceAll(currentValue, ""),
        JSON.stringify(JSON.parse(scriptElement.innerText))
      )
    ),
  ].join(" ");

  chrome.runtime.sendMessage({
    url,
    description,
    imageURL,
    metadata,
    title,
  });
};

document.addEventListener("DOMContentLoaded", sendPage);
addEventListener("load", sendPage);
setInterval(sendPage, 1000);
