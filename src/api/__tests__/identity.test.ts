import { describe, expect, test } from "vitest";
import { identity } from "../identity.ts";

describe("identity", () => {
  test("returns a primitive unchanged", () => {
    expect(identity(42)).toBe(42);
  });

  test("returns the same object reference", () => {
    const value = { a: 1 };
    expect(identity(value)).toBe(value);
  });

  test("returns undefined and null as-is", () => {
    expect(identity(undefined)).toBeUndefined();
    expect(identity(null)).toBeNull();
  });
});
