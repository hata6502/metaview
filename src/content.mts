import { BackgroundMessage } from "./background.mjs";
import { Thing, WithContext } from "schema-dts";

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

      return jsonLDDocuments.flatMap((jsonLDDocument) =>
        isStructuredData(jsonLDDocument) ? [jsonLDDocument] : []
      );
    } catch (exception) {
      console.error(exception);

      return [];
    }
  });

  const url = location.href;
  const title = getTitle();

  const ogImageElement = document.querySelector('meta[property="og:image" i]');
  const iconElement = document.querySelector('link[rel="icon" i]');

  const imageURL =
    (ogImageElement instanceof HTMLMetaElement && ogImageElement.content) ||
    getStructuredDataImageURL({ structuredDataList }) ||
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
  structuredDataList: WithContext<Thing>[];
}) => {
  const articleStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      if (!("@type" in structuredData)) {
        return [];
      }

      const type = structuredData["@type"];

      return type === "Article" ||
        type === "BlogPosting" ||
        type === "NewsArticle"
        ? [structuredData]
        : [];
    }
  );

  if (articleStructuredDataList.length < 1) {
    return;
  }

  return articleStructuredDataList[0];
};

const getBreadcrumbs = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) =>
  structuredDataList
    .flatMap((structuredData) => {
      if (
        !("@type" in structuredData) ||
        structuredData["@type"] !== "BreadcrumbList"
      ) {
        return [];
      }

      const { itemListElement } = structuredData;

      if (!Array.isArray(itemListElement)) {
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
  structuredDataList: WithContext<Thing>[];
}) => {
  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  const author = articleStructuredData?.author;
  const publisher = articleStructuredData?.publisher;

  const credits = [
    ...new Set(
      [
        // @ts-expect-error
        isObject(author) && author.name,
        // @ts-expect-error
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
  structuredDataList: WithContext<Thing>[];
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
  structuredDataList: WithContext<Thing>[];
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

const getStructuredDataImageURL = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  if (articleStructuredData) {
    const { image, publisher } = articleStructuredData;
    const imageURL: unknown = Array.isArray(image) && image[0];

    if (typeof imageURL === "string") {
      return imageURL;
    }

    const publisherLogoImageURL =
      // @ts-expect-error
      isObject(publisher) && isObject(publisher.logo) && publisher.logo.url;

    if (typeof publisherLogoImageURL === "string") {
      return publisherLogoImageURL;
    }
  }

  const logoStructuredDataList = structuredDataList.flatMap((structuredData) =>
    "@type" in structuredData && structuredData["@type"] === "Organization"
      ? [structuredData]
      : []
  );

  if (logoStructuredDataList.length >= 1) {
    const { logo } = logoStructuredDataList[0];

    if (typeof logo === "string") {
      return logo;
    }
  }
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

const isStructuredData = (unknown: unknown): unknown is WithContext<Thing> => {
  const structuredDataContexts: unknown[] = [
    "http://schema.org",
    "https://schema.org",
  ];

  return (
    isObject(unknown) && structuredDataContexts.includes(unknown["@context"])
  );
};

const stringToHashTag = (string: string) => `#${string.replaceAll(" ", "_")}`;
