import { isNonEmptyString } from "./TypeUtil";

describe("TypeUtil", () => {
  describe(isNonEmptyString, () => {
    test("Detects Strings", () => {
      expect(isNonEmptyString("Hello World")).toBe(true);
      expect(isNonEmptyString("")).toBe(false);
    });

    test("Doesn't pass for arrays", () => {
      expect(isNonEmptyString(["a", "s", "d", "f"])).toBe(false);
      expect(isNonEmptyString([1, 2, 3, 4])).toBe(false);
    });

    test("Doesn't pass for undefined or null", () => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
    });
  });
});
