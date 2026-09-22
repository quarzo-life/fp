import { describe, expect, test, vi } from "vitest";
import { cautiouslyUseIsError } from "../cautiously-use-is-error.ts";
import { cautiouslyUseIsSuccess } from "../cautiously-use-is-success.ts";
import { error } from "../error.ts";
import { getTestError } from "../get-test-error.ts";
import { getTestResult } from "../get-test-result.ts";
import { success } from "../success.ts";
import { successVoid } from "../success-void.ts";
import type { Result } from "../types.ts";

describe("Result", () => {
  describe("bind", () => {
    test("applies the function on a Success", () => {
      const actual = success(1).bind((n) => success(n + 1));

      expect(getTestResult(actual)).toBe(2);
    });

    test("propagates the error on an Error", () => {
      const actual = error("KO").bind((n: number) => success(n + 1));

      expect(getTestError(actual)).toBe("KO");
    });

    test("can turn a Success into an Error", () => {
      const actual = success(1).bind(() => error("KO"));

      expect(getTestError(actual)).toBe("KO");
    });
  });

  describe("bindError", () => {
    test("is a no-op on a Success", () => {
      const actual = success(1).bindError(() => success(0));

      expect(getTestResult(actual)).toBe(1);
    });

    test("applies the function on an Error", () => {
      const failed: Result<number, string> = error("KO");
      const actual = failed.bindError((e) => error(`${e}!`));

      expect(getTestError(actual)).toBe("KO!");
    });
  });

  describe("fold", () => {
    test("calls onSuccess on a Success", () => {
      const onSuccess: (n: number) => void = vi.fn();
      const onError: (e: string) => void = vi.fn();

      success(1).fold(onSuccess, onError);

      expect(onSuccess).toHaveBeenCalledExactlyOnceWith(1);
      expect(onError).not.toHaveBeenCalled();
    });

    test("calls onError on an Error", () => {
      const onSuccess: (n: number) => void = vi.fn();
      const onError: (e: string) => void = vi.fn();

      error("KO").fold(onSuccess, onError);

      expect(onSuccess).not.toHaveBeenCalled();
      expect(onError).toHaveBeenCalledExactlyOnceWith("KO");
    });
  });

  describe("successVoid", () => {
    test("is a Success carrying undefined", () => {
      expect(cautiouslyUseIsSuccess(successVoid())).toBe(true);
      expect(successVoid().value).toBeUndefined();
    });

    test("binds without an argument", () => {
      const actual = successVoid().bind(() => success(1));

      expect(getTestResult(actual)).toBe(1);
    });
  });

  describe("guards", () => {
    test("cautiouslyUseIsSuccess discriminates", () => {
      expect(cautiouslyUseIsSuccess(success(1))).toBe(true);
      expect(cautiouslyUseIsSuccess(error("KO"))).toBe(false);
    });

    test("cautiouslyUseIsError discriminates", () => {
      expect(cautiouslyUseIsError(error("KO"))).toBe(true);
      expect(cautiouslyUseIsError(success(1))).toBe(false);
    });
  });
});
