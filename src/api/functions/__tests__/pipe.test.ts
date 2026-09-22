import { describe, expect, test } from "vitest";
import { pipe } from "../pipe.ts";

describe("pipe", () => {
  test("runs functions from left to right", () => {
    const double = (value: number) => value * 2;
    const addOne = (value: number) => value + 1;
    const asString = (value: number) => `${value}`;

    expect(pipe(double, addOne, asString)(3)).toBe("7");
  });

  test("returns the function itself when a single one is provided", () => {
    const double = (value: number) => value * 2;

    expect(pipe(double)).toBe(double);
  });

  test("falls back to identity when no functions are provided", () => {
    expect(pipe()("foo")).toBe("foo");
  });
});
