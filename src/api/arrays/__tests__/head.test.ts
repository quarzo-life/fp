import { describe, expect, test } from "vitest";
import { head } from "../head.ts";

describe("head", () => {
  test("returns the first element", () => {
    expect(head([1, 2, 3])).toBe(1);
  });

  test("returns undefined for an empty array", () => {
    expect(head([])).toBeUndefined();
  });
});
