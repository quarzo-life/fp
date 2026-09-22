import { describe, expect, test } from "vitest";
import { compose } from "../compose.ts";

describe("compose", () => {
  test("runs functions from right to left", () => {
    const sum = (a: number, b: number) => a + b;
    const addOne = (value: number) => value + 1;
    const double = (value: number) => value * 2;

    expect(compose(double, addOne, sum)(2, 3)).toBe(12);
  });

  test("returns the function itself when a single one is provided", () => {
    const double = (value: number) => value * 2;

    expect(compose(double)).toBe(double);
  });

  test("falls back to identity when no functions are provided", () => {
    expect(compose()("foo")).toBe("foo");
  });
});
