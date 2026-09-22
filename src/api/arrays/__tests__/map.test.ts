import { describe, expect, test } from "vitest";
import { map } from "../map.ts";

describe("map", () => {
  describe("uncurried", () => {
    test("maps over an array", () => {
      expect(map((x: number) => x * 2, [2, 3, 4])).toEqual([4, 6, 8]);
    });
  });

  describe("curried", () => {
    test("returns a function mapping over its argument", () => {
      const double = map((x: number) => x * 2);

      expect(double([2, 3, 4])).toEqual([4, 6, 8]);
    });
  });

  test("passes the index to the mapper", () => {
    expect(map((_: string, index: number) => index, ["a", "b"])).toEqual([
      0,
      1,
    ]);
  });
});
