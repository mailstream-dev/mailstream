export const isNonEmptyString = (s: any): s is string => {
  return s?.length && typeof s === "string";
};
