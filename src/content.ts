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
  `map https://www.google.com/maps?q=${geoCoordinates.latitude},${geoCoordinates.longitude}`;

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

                return typeof name === "string" ? [stringToHashTag(name)] : [];
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
    const { endDate, location, name, offers, startDate } = eventStructuredData;
    const offer: Offer | undefined = Array.isArray(offers) ? offers[0] : offers;

    detailGroups.push([
      typeof name === "string" && name,
      // @ts-expect-error
      isObject(location) && "name" in location && `at ${location.name}`,
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
    const {
      address,
      geo,
      name,
      openingHoursSpecification,
      priceRange,
      telephone,
    } = localBusinessStructuredData;

    const openings =
      (Array.isArray(openingHoursSpecification) && openingHoursSpecification) ||
      (isObject(openingHoursSpecification) && [openingHoursSpecification]);

    detailGroups.push([
      typeof name === "string" && name,
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
    const { brand, name, offers } = productStructuredData;
    const offer: Offer | undefined = Array.isArray(offers) ? offers[0] : offers;

    detailGroups.push([
      typeof name === "string" && name,
      // @ts-expect-error
      isObject(brand) && `${stringToHashTag(brand.name)} brand`,
      ...(offer ? offerToDetails(offer) : []),
    ]);
  }

  const videoObjectStructuredData = getVideoObjectStructuredData({
    structuredDataList,
  });

  if (videoObjectStructuredData) {
    const { duration, expires, hasPart, name, publication, uploadDate } =
      videoObjectStructuredData;

    const clips: Clip[] = Array.isArray(hasPart) ? hasPart : [];

    detailGroups.push([
      typeof name === "string" && name,
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
    .filter((postalAddress) => typeof postalAddress === "string")
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
  const title = document.title;

  const ogImageElement = document.querySelector('meta[property="og:image" i]');
  const iconElement = document.querySelector('link[rel="icon" i]');

  const imageURL =
    getStructuredDataImageURL({ structuredDataList }) ||
    (ogImageElement instanceof HTMLMetaElement && ogImageElement.content) ||
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
    title,
  };

  chrome.runtime.sendMessage(backgroundMessage);
};

sendPage();
addEventListener("load", sendPage);
setInterval(sendPage, 1000);
