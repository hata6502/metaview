import { Thing, WithContext } from "schema-dts";
import { isObject } from "./isObject";

export const getArticleStructuredData = ({
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

export const getProductStructuredData = ({
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

export const getLocalBusinessStructuredData = ({
  structuredDataList,
}: {
  structuredDataList: WithContext<Thing>[];
}) => {
  const localBusinessStructuredDataList = structuredDataList.flatMap(
    (structuredData) => {
      return "@id" in structuredData &&
        "address" in structuredData &&
        "name" in structuredData
        ? [structuredData]
        : [];
    }
  );

  if (localBusinessStructuredDataList.length < 1) {
    return;
  }

  return localBusinessStructuredDataList[0];
};

export const isStructuredData = (
  unknown: unknown
): unknown is WithContext<Thing> => {
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
