import { describe, expect, test } from "vitest";
import { curry } from "../curry.ts";

describe("curry", () => {
  test("curries a multi-argument function", () => {
    const join = (a: string, b: string, c: string) => `${a}-${b}-${c}`;

    expect(curry(join)("a")("b")("c")).toBe("a-b-c");
  });

  test("supports zero argument functions", () => {
    expect(curry(() => 42)()).toBe(42);
  });

  test("honours an explicit number of required arguments", () => {
    const add = (a: number, b = 0) => a + b; // add.length is 1
    // The static type follows the declared parameters, hence the cast.
    const curriedAdd = curry(add, 2) as unknown as (
      a: number,
    ) => (b: number) => number;

    expect(curriedAdd(1)(2)).toBe(3);
  });
});
