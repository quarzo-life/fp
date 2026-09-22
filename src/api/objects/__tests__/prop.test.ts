import { describe, expect, test } from "vitest";
import { prop } from "../prop.ts";

describe("prop", () => {
  const user = { id: "123", name: "Case" };

  describe("uncurried", () => {
    test("returns a property from an object", () => {
      expect(prop("id", user)).toBe("123");
    });
  });

  describe("curried", () => {
    test("returns a property from an object", () => {
      expect(prop("name")(user)).toBe("Case");
    });

    test("gracefully handles missing objects", () => {
      expect(prop("count")(undefined)).toBeUndefined();
      expect(prop("count")(null)).toBeUndefined();
    });
  });
});
