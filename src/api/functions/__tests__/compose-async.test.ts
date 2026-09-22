import { describe, expect, test } from "vitest";
import { composeAsync } from "../compose-async.ts";

describe("composeAsync", () => {
  test("runs async functions from right to left", async () => {
    const sum = async (a: number, b: number) => await Promise.resolve(a + b);
    const addOne = async (value: number) => await Promise.resolve(value + 1);
    const double = async (value: number) => await Promise.resolve(value * 2);

    expect(await composeAsync<number>(double, addOne, sum)(2, 3)).toBe(12);
  });

  test("resolves to the first argument when no functions are provided", async () => {
    expect(await composeAsync<string>()("foo")).toBe("foo");
  });
});
