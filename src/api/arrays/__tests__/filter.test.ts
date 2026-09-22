import { describe, expect, test } from "vitest";
import { filter } from "../filter.ts";

describe("filter", () => {
  describe("uncurried", () => {
    test("filters an array", () => {
      expect(filter((x: number) => x % 2 === 0, [1, 2, 3, 4, 5])).toEqual([
        2,
        4,
      ]);
    });
  });

  describe("curried", () => {
    test("returns a function filtering its argument", () => {
      const evens = filter((x: number) => x % 2 === 0);

      expect(evens([1, 2, 3, 4, 5])).toEqual([2, 4]);
    });
  });
});
