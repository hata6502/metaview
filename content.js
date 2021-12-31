const sendPage = () => {
  const structuredDataList = [
    ...document.querySelectorAll('script[type="application/ld+json" i]'),
  ].flatMap((jsonLDElement) => {
    if (!(jsonLDElement instanceof HTMLScriptElement)) {
      return [];
    }

    try {
      const jsonLD = JSON.parse(jsonLDElement.innerText);
      const jsonLDDocuments = Array.isArray(jsonLD) ? jsonLD : [jsonLD];

      return jsonLDDocuments.filter(
        (jsonLDDocument) =>
          typeof jsonLDDocument === "object" &&
          jsonLDDocument !== null &&
          ["http://schema.org", "https://schema.org"].includes(
            jsonLDDocument["@context"]
          )
      );
    } catch (exception) {
      console.error(exception);

      return [];
    }
  });

  const url = location.href;
  const title = getTitle();

  const articleStructuredDataImage = getArticleStructuredData({
    structuredDataList,
  })?.image[0];

  const imageURL =
    document.querySelector('meta[property="og:image" i]')?.content ||
    (typeof articleStructuredDataImage === string &&
      articleStructuredDataImage) ||
    getSingleImageURL() ||
    document.querySelector('link[rel="icon" i]')?.href;

  chrome.runtime.sendMessage({
    url,
    description: `${[
      title,
      url,
      [
        getDateLine({ structuredDataList }),
        getCreditLine({ structuredDataList }),
      ]
        .filter((line) => line)
        .join("\n"),
      getBreadcrumbs({ structuredDataList }),
      getDescription({ structuredDataList }),
      getHashTagLine(),
    ]
      .filter((line) => line)
      .join("\n\n")}\n\n`,
    imageURL,
    metadata: [
      ...[...document.querySelectorAll("meta[name]")].map(
        (metaElement) => `${metaElement.name}:${metaElement.content}`
      ),
      ...[
        ...document.querySelectorAll('script[type="application/ld+json" i]'),
      ].map((scriptElement) => scriptElement.innerText),
    ].join(" "),
    title,
  });
};

document.addEventListener("DOMContentLoaded", sendPage);
addEventListener("load", sendPage);
setInterval(sendPage, 1000);

const getArticleStructuredData = ({ structuredDataList }) =>
  structuredDataList.find((structuredData) =>
    ["Article", "BlogPosting", "NewsArticle"].includes(structuredData["@type"])
  );

const getBreadcrumbs = ({ structuredDataList }) =>
  structuredDataList
    .flatMap((structuredData) => {
      const { itemListElement } = structuredData;

      if (
        structuredData["@type"] !== "BreadcrumbList" ||
        !Array.isArray(itemListElement)
      ) {
        return [];
      }

      return [
        [...itemListElement]
          .sort((a, b) => a.position - b.position)
          .map((listItem) => `#${listItem.item.name}`)
          .join(" > "),
      ];
    })
    .join("\n");

const getCreditLine = ({ structuredDataList }) => {
  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  const credits = [
    ...new Set(
      [
        articleStructuredData?.author?.name,
        articleStructuredData?.publisher?.name,
        ,
        ...[
          ...document.querySelectorAll(
            'meta[name="author" i], meta[name="creator" i], meta[name="publisher" i]'
          ),
        ].flatMap((creditElement) =>
          creditElement instanceof HTMLMetaElement
            ? [creditElement.content]
            : []
        ),
      ].filter((credit) => credit)
    ),
  ];

  return credits.length >= 1 && `by ${credits.map(stringToHashTag).join(" ")}`;
};

const getDateLine = ({ structuredDataList }) => {
  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  const dateString =
    articleStructuredData?.dateModified ?? articleStructuredData?.datePublished;

  return dateString && new Date(dateString).toLocaleString();
};

const getDescription = ({ structuredDataList }) => {
  const descriptionElement = document.querySelector(
    'meta[name="description" i]'
  );

  const ogDescriptionElement = document.querySelector(
    'meta[property="og:description" i]'
  );

  return (
    (ogDescriptionElement instanceof HTMLMetaElement &&
      ogDescriptionElement.content) ||
    (descriptionElement instanceof HTMLMetaElement &&
      descriptionElement.content) ||
    getArticleStructuredData({ structuredDataList })?.headline
  );
};

const getHashTagLine = () => {
  const keywordsElement = document.querySelector('meta[name="keywords" i]');

  const joinedKeywords =
    (keywordsElement instanceof HTMLMetaElement && keywordsElement.content) ||
    "";

  const keywords = joinedKeywords.split(",").flatMap((keyword) => {
    const trimmedKeyword = keyword.trim();

    return trimmedKeyword === "" ? [] : [trimmedKeyword];
  });

  return keywords.map(stringToHashTag).join(" ");
};

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

const getTitle = () => {
  const ogTitleElement = document.querySelector('meta[property="og:title" i]');

  return (
    (ogTitleElement instanceof HTMLMetaElement && ogTitleElement.content) ||
    document.title
  );
};

const stringToHashTag = (string) => `#${string.replaceAll(" ", "_")}`;
