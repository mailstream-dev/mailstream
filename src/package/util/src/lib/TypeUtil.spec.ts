import { isNonEmptyString } from "./TypeUtil";

describe("TypeUtil", () => {
  describe(isNonEmptyString, () => {
    test("Detects Strings", () => {
      expect(isNonEmptyString("Hello World")).toBeTruthy();
      expect(isNonEmptyString("")).toBeFalsy();
    });

    test("Doesn't pass for arrays", () => {
      expect(isNonEmptyString(["a", "s", "d", "f"])).toBeFalsy();
      expect(isNonEmptyString([1, 2, 3, 4])).toBeFalsy();
    });

    test("Doesn't pass for undefined or null", () => {
      expect(isNonEmptyString(null)).toBeFalsy();
      expect(isNonEmptyString(undefined)).toBeFalsy();
    });
  });
});
