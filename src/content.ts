import {
  Article,
  Clip,
  Event,
  GeoCoordinates,
  PostalAddress,
  Product,
  Offer,
  Thing,
  VideoObject,
  WithContext,
} from "schema-dts";
import { BackgroundMessage } from "./background";
import { isObject } from "./isObject";
import {
  getArticleStructuredData,
  getBreadcrumbStructuredDataList,
  getEventStructuredData,
  getLocalBusinessStructuredData,
  getLogoStructuredData,
  getProductStructuredData,
  getVideoObjectStructuredData,
  isStructuredData,
  removeSchemaURL,
} from "./structuredData";

const geoCoordinatesToMapURLString = (geoCoordinates: GeoCoordinates) =>
  (typeof geoCoordinates.latitude === "number" ||
    typeof geoCoordinates.latitude === "string") &&
  (typeof geoCoordinates.longitude === "number" ||
    typeof geoCoordinates.longitude === "string") &&
  `[N${geoCoordinates.latitude},E${geoCoordinates.longitude}]`;

const getBody = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const selectedText = getSelectedText();

  if (selectedText) {
    return selectedText;
  }

  const ogImageElement = document.querySelector('meta[property="og:image" i]');
  const iconElement = document.querySelector('link[rel="icon" i]');

  const imageURL =
    (ogImageElement instanceof HTMLMetaElement && ogImageElement.content) ||
    getStructuredDataImageURL({ structuredDataList }) ||
    (iconElement instanceof HTMLLinkElement && iconElement.href) ||
    undefined;

  return [
    getTitle({ structuredDataList }),
    getBreadcrumbs({ structuredDataList }),
    // https://scrapbox.io/forum-jp/.pngや.jpgで終わらないURLの画像を貼りたい
    imageURL && `[${imageURL}#.png]`,
    `[${location.href}]`,
    getDateLine({ structuredDataList }),
    getDetails({ structuredDataList }),
    getDescription({ structuredDataList }),
    getHashTagLine(),
    getCreditLine({ structuredDataList }),
  ]
    .filter((line) => line)
    .join("\n\n");
};

const getBreadcrumbs = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) =>
  getBreadcrumbStructuredDataList({ structuredDataList })
    .flatMap((structuredData) => {
      const { itemListElement } = structuredData;

      return Array.isArray(itemListElement)
        ? [
            [...itemListElement]
              .sort((a, b) => a.position - b.position)
              .flatMap((listItem) => {
                if (!listItem) {
                  return [];
                }

                const name = listItem.item?.name ?? listItem.name;

                return typeof name === "string" ? [`[${name}]`] : [];
              })
              .join(" > "),
          ]
        : [];
    })
    .join("\n");

const getCreditLine = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const eventStructuredData = getEventStructuredData({
    structuredDataList,
  });

  const eventStructuredDataPerformer = eventStructuredData?.performer;
  const eventStructuredDataOrganizer = eventStructuredData?.organizer;

  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  const articleStructuredDataAuthor = articleStructuredData?.author;
  const articleStructuredDataPublisher = articleStructuredData?.publisher;

  const credits = [
    ...new Set(
      [
        isObject(eventStructuredDataPerformer) &&
          // @ts-expect-error
          eventStructuredDataPerformer.name,
        isObject(eventStructuredDataOrganizer) &&
          // @ts-expect-error
          eventStructuredDataOrganizer.name,
        isObject(articleStructuredDataAuthor) &&
          // @ts-expect-error
          articleStructuredDataAuthor.name,
        isObject(articleStructuredDataPublisher) &&
          // @ts-expect-error
          articleStructuredDataPublisher.name,
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
        location.hostname,
      ].flatMap((credit) => (typeof credit === "string" ? [credit] : []))
    ),
  ];

  return (
    credits.length >= 1 &&
    `by ${credits.map((credit) => `[${credit}]`).join(" ")}`
  );
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

  const eventStructuredDataDescription = getEventStructuredData({
    structuredDataList,
  })?.description;

  const productStructuredDataDescription = getProductStructuredData({
    structuredDataList,
  })?.description;

  const videoObjectStructuredDataDescription = getVideoObjectStructuredData({
    structuredDataList,
  })?.description;

  const articleStructuredDataHeadline = getArticleStructuredData({
    structuredDataList,
  })?.headline;

  return (
    (typeof eventStructuredDataDescription === "string" &&
      eventStructuredDataDescription) ||
    (typeof productStructuredDataDescription === "string" &&
      productStructuredDataDescription) ||
    (typeof videoObjectStructuredDataDescription === "string" &&
      videoObjectStructuredDataDescription) ||
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

  const eventStructuredData = getEventStructuredData({
    structuredDataList,
  });

  if (eventStructuredData) {
    const { endDate, location, offers, startDate } = eventStructuredData;
    const offer: Offer | undefined = Array.isArray(offers) ? offers[0] : offers;

    detailGroups.push([
      // @ts-expect-error
      isObject(location) && "name" in location && `at [${location.name}]`,
      isObject(location) &&
        // @ts-expect-error
        isObject(location.address) &&
        // @ts-expect-error
        postalAddressToString(location.address),
      isObject(location) &&
        // @ts-expect-error
        location.geo &&
        // @ts-expect-error
        "latitude" in location.geo &&
        // @ts-expect-error
        geoCoordinatesToMapURLString(location.geo),
      // @ts-expect-error
      isObject(location) && location.url,
      `${startDate ?? ""} ~ ${endDate ?? ""}`,
      ...(offer ? offerToDetails(offer) : []),
    ]);
  }

  const localBusinessStructuredData = getLocalBusinessStructuredData({
    structuredDataList,
  });

  if (localBusinessStructuredData) {
    const { address, geo, openingHoursSpecification, priceRange, telephone } =
      localBusinessStructuredData;

    const openings =
      (Array.isArray(openingHoursSpecification) && openingHoursSpecification) ||
      (isObject(openingHoursSpecification) && [openingHoursSpecification]);

    detailGroups.push([
      // @ts-expect-error
      isObject(address) && postalAddressToString(address),
      geo && "latitude" in geo && geoCoordinatesToMapURLString(geo),
      ...(openings
        ? openings.map((opening) =>
            [
              (opening.opens || opening.closes) &&
                `${opening.opens ?? ""} ~ ${opening.closes ?? ""}`,
              opening.dayOfWeek?.map(removeSchemaURL).join(", "),
              (opening.validFrom || opening.validThrough) &&
                `${opening.validFrom ?? ""} ~ ${opening.validThrough ?? ""}`,
            ]
              .filter((opening) => opening)
              .join(" ")
          )
        : []),
      typeof priceRange === "string" && priceRange,
      typeof telephone === "string" && telephone,
    ]);
  }

  const productStructuredData = getProductStructuredData({
    structuredDataList,
  });

  if (productStructuredData) {
    const { brand, offers } = productStructuredData;
    const offer: Offer | undefined = Array.isArray(offers) ? offers[0] : offers;

    detailGroups.push([
      // @ts-expect-error
      isObject(brand) && `[${brand.name}] brand`,
      ...(offer ? offerToDetails(offer) : []),
    ]);
  }

  const videoObjectStructuredData = getVideoObjectStructuredData({
    structuredDataList,
  });

  if (videoObjectStructuredData) {
    const { duration, expires, hasPart, publication, uploadDate } =
      videoObjectStructuredData;

    const clips: Clip[] = Array.isArray(hasPart) ? hasPart : [];

    detailGroups.push([
      `${uploadDate ?? ""} ~ ${expires ?? ""}`,
      isObject(publication) &&
        // @ts-expect-error
        publication.isLiveBroadcast &&
        // @ts-expect-error
        `Live ${publication.startDate ?? ""} ~ ${publication.endDate ?? ""}`,
      typeof duration === "string" && duration,
      ...clips.map(
        (clip) =>
          `${clip.name} ${clip.startOffset ? `${clip.startOffset} s` : ""} ~ ${
            clip.endOffset ? `${clip.endOffset} s` : ""
          } ${clip.url}`
      ),
    ]);
  }

  return detailGroups
    .map((detailGroup) =>
      detailGroup.filter((detail) => typeof detail === "string").join("\n")
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

const getSelectedText = () => {
  const selection = getSelection();

  if (!selection) {
    return;
  }

  return [...Array(selection.rangeCount).keys()]
    .map((rangeIndex) => {
      const range = selection.getRangeAt(rangeIndex);
      const documentFragment = range.cloneContents();

      documentFragment.querySelectorAll("a").forEach((anchorElement) => {
        if (!anchorElement.textContent) {
          return;
        }

        anchorElement.textContent = anchorElement.textContent;
        anchorElement.prepend("[");
        anchorElement.append("]");
      });

      documentFragment.querySelectorAll("img").forEach((imageElement) => {
        if (!imageElement.src) {
          return;
        }

        // https://scrapbox.io/forum-jp/.pngや.jpgで終わらないURLの画像を貼りたい
        imageElement.after(`[${imageElement.src}#.png]`);
      });

      const rangeToGetText = new Range();

      rangeToGetText.selectNodeContents(documentFragment);

      return rangeToGetText.toString();
    })
    .join("")
    .trim();
};

const getStructuredDataImageURL = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const eventStructuredData = getEventStructuredData({
    structuredDataList,
  });

  if (eventStructuredData) {
    const { image } = eventStructuredData;
    const imageURL: Event["image"] = Array.isArray(image) ? image[0] : image;

    if (typeof imageURL === "string") {
      return imageURL;
    }
  }

  const productStructuredData = getProductStructuredData({
    structuredDataList,
  });

  if (productStructuredData) {
    const { image } = productStructuredData;
    const imageURL: Product["image"] = Array.isArray(image) ? image[0] : image;

    if (typeof imageURL === "string") {
      return imageURL;
    }
  }

  const videoObjectStructuredData = getVideoObjectStructuredData({
    structuredDataList,
  });

  if (videoObjectStructuredData) {
    const { thumbnailUrl } = videoObjectStructuredData;

    const firstThumbnailUrl: VideoObject["thumbnailUrl"] = Array.isArray(
      thumbnailUrl
    )
      ? thumbnailUrl[0]
      : thumbnailUrl;

    if (typeof firstThumbnailUrl === "string") {
      return firstThumbnailUrl;
    }
  }

  const articleStructuredData = getArticleStructuredData({
    structuredDataList,
  });

  if (articleStructuredData) {
    const { image, publisher } = articleStructuredData;
    const imageURL: Article["image"] = Array.isArray(image) ? image[0] : image;

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

  const logoStructuredData = getLogoStructuredData({
    structuredDataList,
  });

  if (logoStructuredData) {
    const { logo } = logoStructuredData;

    if (typeof logo === "string") {
      return logo;
    }
  }
};

const getTitle = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const eventStructuredDataName = getEventStructuredData({
    structuredDataList,
  })?.name;

  const localBusinessStructuredDataName = getLocalBusinessStructuredData({
    structuredDataList,
  })?.name;

  const productStructuredDataName = getProductStructuredData({
    structuredDataList,
  })?.name;

  const videoObjectStructuredDataName = getVideoObjectStructuredData({
    structuredDataList,
  })?.name;

  const articleStructuredDataName = getArticleStructuredData({
    structuredDataList,
  })?.name;

  return (
    (typeof eventStructuredDataName === "string" && eventStructuredDataName) ||
    (typeof localBusinessStructuredDataName === "string" &&
      localBusinessStructuredDataName) ||
    (typeof productStructuredDataName === "string" &&
      productStructuredDataName) ||
    (typeof videoObjectStructuredDataName === "string" &&
      videoObjectStructuredDataName) ||
    (typeof articleStructuredDataName === "string" &&
      articleStructuredDataName) ||
    document.title
  );
};

const offerToDetails = (offer: Offer) => [
  "price" in offer &&
    (typeof offer.price === "number" || typeof offer.price === "string") &&
    `${offer.price} ${
      typeof offer.priceCurrency === "string" ? offer.priceCurrency : ""
    }`,
  "lowPrice" in offer &&
    (typeof offer.lowPrice === "number" ||
      typeof offer.lowPrice === "string") &&
    typeof offer.priceCurrency === "string" &&
    `${offer.lowPrice} ${
      typeof offer.highPrice === "number" || typeof offer.highPrice === "string"
        ? `~ ${offer.highPrice} `
        : ""
    }${offer.priceCurrency}`,
  "availability" in offer &&
    typeof offer.availability === "string" &&
    removeSchemaURL(offer.availability),
  "itemCondition" in offer &&
    typeof offer.itemCondition === "string" &&
    removeSchemaURL(offer.itemCondition),
  "offerCount" in offer &&
    typeof offer.offerCount === "number" &&
    `${offer.offerCount} left`,
  "priceValidUntil" in offer &&
    typeof offer.priceValidUntil === "string" &&
    `until ${offer.priceValidUntil}`,
];

const postalAddressToString = (postalAddress: PostalAddress) =>
  [
    postalAddress.streetAddress,
    postalAddress.addressLocality,
    postalAddress.addressRegion,
    postalAddress.postalCode,
    postalAddress.addressCountry,
  ]
    .flatMap((postalAddress) =>
      typeof postalAddress === "string" ? [`[${postalAddress}]`] : []
    )
    .join(", ");

const stringToHashTag = (string: string) => `#${string.replaceAll(" ", "_")}`;

const sendPage = () => {
  const structuredDataList = [
    ...document.querySelectorAll('script[type="application/ld+json" i]'),
  ].flatMap((jsonLDElement) => {
    if (!(jsonLDElement instanceof HTMLScriptElement)) {
      return [];
    }

    try {
      const jsonString = jsonLDElement.textContent;

      if (!jsonString) {
        throw new Error("JSON string is empty");
      }

      const jsonLD: unknown = JSON.parse(jsonString);
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

  const backgroundMessage: BackgroundMessage = {
    body: `${getBody({ structuredDataList })
      .split("\n")
      .map((line) => `> ${line}`)
      .join("\n")}\n`,
    title: getTitle({ structuredDataList }),
  };

  chrome.runtime.sendMessage(backgroundMessage);
};

sendPage();
addEventListener("load", sendPage);
setInterval(sendPage, 1000);
