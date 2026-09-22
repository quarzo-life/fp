import { describe, expect, test } from "vitest";
import { isDefined } from "../is-defined.ts";

describe("isDefined", () => {
  test("returns false for null and undefined", () => {
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });

  test("returns true for falsy but defined values", () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined("")).toBe(true);
    expect(isDefined(false)).toBe(true);
  });

  test("narrows an array when used with filter", () => {
    expect([1, undefined, 2, null].filter(isDefined)).toEqual([1, 2]);
  });
});
