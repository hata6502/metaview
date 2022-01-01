import { BackgroundMessage } from "./background.mjs";
import { Product, Thing, WithContext } from "schema-dts";

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
      getDetails({ structuredDataList }),
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

  return credits.length >= 1 && `By ${credits.map(stringToHashTag).join(" ")}`;
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

  return typeof dateString === "string" && dateString;
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

  const productStructuredDataDescription = getProductStructuredData({
    structuredDataList,
  })?.description;

  const articleStructuredDataHeadline = getArticleStructuredData({
    structuredDataList,
  })?.headline;

  return (
    (typeof productStructuredDataDescription === "string" &&
      productStructuredDataDescription) ||
    (typeof articleStructuredDataHeadline === "string" &&
      articleStructuredDataHeadline) ||
    (ogDescriptionElement instanceof HTMLMetaElement &&
      ogDescriptionElement.content) ||
    (descriptionElement instanceof HTMLMetaElement &&
      descriptionElement.content)
  );
};

const getDetails = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const detailGroups: unknown[][] = [];

  const productStructuredData = getProductStructuredData({
    structuredDataList,
  });

  if (productStructuredData) {
    const { brand, name, offers } = productStructuredData;
    const offer: Product["offers"] = Array.isArray(offers) ? offers[0] : offers;

    detailGroups.push([
      typeof name === "string" && name,
      // @ts-expect-error
      isObject(brand) && `${stringToHashTag(brand.name)} brand`,
      offer &&
        "price" in offer &&
        (typeof offer.price === "number" || typeof offer.price === "string") &&
        `${offer.price} ${
          typeof offer.priceCurrency === "string" ? offer.priceCurrency : ""
        }`,
      offer &&
        "lowPrice" in offer &&
        (typeof offer.lowPrice === "number" ||
          typeof offer.lowPrice === "string") &&
        typeof offer.priceCurrency === "string" &&
        `${offer.lowPrice} ${
          typeof offer.highPrice === "number" ||
          typeof offer.highPrice === "string"
            ? `~ ${offer.highPrice} `
            : ""
        }${offer.priceCurrency}`,
      offer &&
        "availability" in offer &&
        typeof offer.availability === "string" &&
        offer.availability
          .replace("http://schema.org/", "")
          .replace("https://schema.org/", ""),
      offer &&
        "itemCondition" in offer &&
        typeof offer.itemCondition === "string" &&
        offer.itemCondition
          .replace("http://schema.org/", "")
          .replace("https://schema.org/", ""),
      offer &&
        "offerCount" in offer &&
        typeof offer.offerCount === "number" &&
        `${offer.offerCount} left`,
      offer &&
        "priceValidUntil" in offer &&
        typeof offer.priceValidUntil === "string" &&
        `Until ${offer.priceValidUntil}`,
      ,
    ]);
  }

  return detailGroups
    .map((detailGroup) =>
      detailGroup
        .flatMap((detail) =>
          typeof detail === "string" ? [`- ${detail}`] : []
        )
        .join("\n")
    )
    .filter((detailGroup) => detailGroup)
    .join("\n\n");
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

const getProductStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const productStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      if (!("@type" in structuredData)) {
        return [];
      }

      const type = structuredData["@type"];

      return type === "Product" ? [structuredData] : [];
    }
  );

  if (productStructuredDataList.length < 1) {
    return;
  }

  return productStructuredDataList[0];
};

const getStructuredDataImageURL = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const productStructuredData = getProductStructuredData({
    structuredDataList,
  });

  if (productStructuredData) {
    const { image } = productStructuredData;
    const imageURL: unknown = Array.isArray(image) && image[0];

    if (typeof imageURL === "string") {
      return imageURL;
    }
  }

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
    "http://schema.org/",
    "https://schema.org",
    "https://schema.org/",
  ];

  return (
    isObject(unknown) && structuredDataContexts.includes(unknown["@context"])
  );
};

const stringToHashTag = (string: string) => `#${string.replaceAll(" ", "_")}`;
