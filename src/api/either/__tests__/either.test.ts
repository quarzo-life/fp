import { describe, expect, test, vi } from "vitest";
import { cautiouslyUseIsNone } from "../cautiously-use-is-none.ts";
import { cautiouslyUseIsSome } from "../cautiously-use-is-some.ts";
import { getTestSome } from "../get-test-some.ts";
import { none } from "../none.ts";
import { some } from "../some.ts";
import type { Either } from "../types.ts";

describe("Either", () => {
  describe("bind", () => {
    test("applies the function when there is a value (Some)", () => {
      const actual = some(0).bind((n) => some(n + 1));

      expect(getTestSome(actual)).toBe(1);
    });

    test("is a no-op when there is no value (None)", () => {
      const actual = none<number>().bind<number>((n) => some(n + 1));

      expect(cautiouslyUseIsNone(actual)).toBe(true);
    });
  });

  describe("bindNone", () => {
    test("applies the function when there is no value (None)", () => {
      const actual = none<number>().bindNone(() => some(1));

      expect(getTestSome(actual)).toBe(1);
    });

    test("is a no-op when there is a value (Some)", () => {
      const actual = some(0).bindNone(() => some(1));

      expect(getTestSome(actual)).toBe(0);
    });
  });

  describe("fold", () => {
    test("calls onSome when there is a value (Some)", () => {
      const someSpy: (n: number) => void = vi.fn();
      const noneSpy: () => void = vi.fn();

      some<number>(0).fold(someSpy, noneSpy);

      expect(someSpy).toHaveBeenCalledExactlyOnceWith(0);
      expect(noneSpy).not.toHaveBeenCalled();
    });

    test("calls onNone when there is no value (None)", () => {
      const someSpy: (n: number) => void = vi.fn();
      const noneSpy: () => void = vi.fn();

      none<number>().fold(someSpy, noneSpy);

      expect(someSpy).not.toHaveBeenCalled();
      expect(noneSpy).toHaveBeenCalledOnce();
    });
  });

  describe("variance", () => {
    test("Either of a subtype is assignable to Either of a supertype", () => {
      const narrow: Either<number> = some(1);
      const wide: Either<number | string> = narrow; // must type-check

      expect(getTestSome(wide)).toBe(1);
    });
  });

  describe("guards", () => {
    test("cautiouslyUseIsSome discriminates", () => {
      expect(cautiouslyUseIsSome(some(1))).toBe(true);
      expect(cautiouslyUseIsSome(none())).toBe(false);
    });

    test("cautiouslyUseIsNone discriminates", () => {
      expect(cautiouslyUseIsNone(none())).toBe(true);
      expect(cautiouslyUseIsNone(some(1))).toBe(false);
    });
  });
});
