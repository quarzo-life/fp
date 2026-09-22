import { describe, expect, test } from "vitest";
import { identityFunctor } from "../identity-functor.ts";

describe("identityFunctor", () => {
  test("allows to map fluently", () => {
    const actual = identityFunctor(0)
      .map((n) => n + 1)
      .map((n) => n * 3)
      .map((n) => n ** 2)
      .get();

    expect(actual).toBe(9);
  });

  test("get returns the wrapped value unchanged", () => {
    const value = { a: 1 };

    expect(identityFunctor(value).get()).toBe(value);
  });
});
