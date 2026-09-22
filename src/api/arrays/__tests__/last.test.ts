import { describe, expect, test } from "vitest";
import { last } from "../last.ts";

describe("last", () => {
  test("returns the last element", () => {
    expect(last([1, 2, 3])).toBe(3);
  });

  test("returns undefined for an empty array", () => {
    expect(last([])).toBeUndefined();
  });
});
