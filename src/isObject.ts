export const isObject = (
  unknown: unknown
): unknown is Record<string, unknown> =>
  typeof unknown === "object" && unknown !== null;
