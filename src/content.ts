import { BackgroundMessage } from "./background";

const sendPage = () => {
  const structuredDataList = [
    ...document.querySelectorAll('script[type="application/ld+json" i]'),
  ].flatMap((jsonLDElement) => {
    if (!(jsonLDElement instanceof HTMLScriptElement)) {
      return [];
    }

    try {
      const jsonLD: unknown = JSON.parse(jsonLDElement.innerText);
      const jsonLDDocuments: unknown[] = Array.isArray(jsonLD)
        ? jsonLD
        : [jsonLD];

      return jsonLDDocuments.flatMap((jsonLDDocument) => {
        const structuredDataContexts: unknown[] = [
          "http://schema.org",
          "https://schema.org",
        ];

        return isObject(jsonLDDocument) &&
          structuredDataContexts.includes(jsonLDDocument["@context"])
          ? [jsonLDDocument]
          : [];
      });
    } catch (exception) {
      console.error(exception);

      return [];
    }
  });

  const url = location.href;
  const title = getTitle();

  const articleStructuredDataImages = getArticleStructuredData({
    structuredDataList,
  })?.image;

  const articleStructuredDataImage: unknown =
    Array.isArray(articleStructuredDataImages) &&
    articleStructuredDataImages[0];

  const ogImageElement = document.querySelector('meta[property="og:image" i]');
  const iconElement = document.querySelector('link[rel="icon" i]');

  const imageURL =
    (ogImageElement instanceof HTMLMetaElement && ogImageElement.content) ||
    (typeof articleStructuredDataImage === "string" &&
      articleStructuredDataImage) ||
    getSingleImageURL() ||
    (iconElement instanceof HTMLLinkElement && iconElement.href) ||
    undefined;

  const backgroundMessage: BackgroundMessage = {
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
      ...[...document.querySelectorAll("meta[name]")].flatMap((metaElement) =>
        metaElement instanceof HTMLMetaElement
          ? [`${metaElement.name}:${metaElement.content}`]
          : []
      ),
      ...[
        ...document.querySelectorAll('script[type="application/ld+json" i]'),
      ].flatMap((scriptElement) =>
        scriptElement instanceof HTMLElement ? [scriptElement.innerText] : []
      ),
    ].join(" "),
    title,
  };

  chrome.runtime.sendMessage(backgroundMessage);
};

document.addEventListener("DOMContentLoaded", sendPage);
addEventListener("load", sendPage);
setInterval(sendPage, 1000);

const getArticleStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: Record<string, unknown>[];
}) =>
  structuredDataList.find((structuredData) => {
    const articleTypes: unknown[] = ["Article", "BlogPosting", "NewsArticle"];

    return articleTypes.includes(structuredData["@type"]);
  });

const getBreadcrumbs = ({
  structuredDataList,
}: {
  structuredDataList: Record<string, unknown>[];
}) =>
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
          .flatMap((listItem) => {
            if (!listItem) {
              return [];
            }

            const name = listItem.item?.name ?? listItem.name;

            return typeof name === "string" ? [stringToHashTag(name)] : [];
          })
          .join(" > "),
      ];
    })
    .join("\n");

const getCreditLine = ({
  structuredDataList,
}: {
  structuredDataList: Record<string, unknown>[];
}) => {
  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  const author = articleStructuredData?.author;
  const publisher = articleStructuredData?.publisher;

  const credits = [
    ...new Set(
      [
        isObject(author) && author.name,
        isObject(publisher) && publisher.name,
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
      ].flatMap((credit) => (typeof credit === "string" ? [credit] : []))
    ),
  ];

  return credits.length >= 1 && `by ${credits.map(stringToHashTag).join(" ")}`;
};

const getDateLine = ({
  structuredDataList,
}: {
  structuredDataList: Record<string, unknown>[];
}) => {
  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  const dateString =
    articleStructuredData?.dateModified ?? articleStructuredData?.datePublished;

  return (
    typeof dateString === "string" && new Date(dateString).toLocaleString()
  );
};

const getDescription = ({
  structuredDataList,
}: {
  structuredDataList: Record<string, unknown>[];
}) => {
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

  if (!canvasContext) {
    throw new Error("Canvas is not supported.");
  }

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

const isObject = (unknown: unknown): unknown is Record<string, unknown> =>
  typeof unknown === "object" && unknown !== null;

const stringToHashTag = (string: string) => `#${string.replaceAll(" ", "_")}`;
