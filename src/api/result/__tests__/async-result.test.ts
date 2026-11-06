import { describe, expect, test, vi } from "vitest";
import { asyncResult } from "../async-result.ts";
import { error } from "../error.ts";
import { getTestError } from "../get-test-error.ts";
import { getTestResult } from "../get-test-result.ts";
import { success } from "../success.ts";
import type { Result } from "../types.ts";

describe("asyncResult", () => {
  test("allows to chain results asynchronously", async () => {
    const increment = (n: number) => Promise.resolve(success(n + 1));
    const square = (n: number) => Promise.resolve(success(n ** 2));

    const actual = await asyncResult(Promise.resolve(success(1)))
      .bind(increment)
      .bind(square)
      .get();

    expect(getTestResult(actual)).toBe(4);
  });

  test("accepts synchronous mapping functions", async () => {
    const actual = await asyncResult(Promise.resolve(success(1)))
      .bind((n) => success(n + 1))
      .get();

    expect(getTestResult(actual)).toBe(2);
  });

  test("short-circuits on error", async () => {
    const fail = (_: number): Promise<Result<number, string>> =>
      Promise.resolve(error("KO"));
    const square = (n: number) => Promise.resolve(success(n ** 2));

    const actual = await asyncResult(Promise.resolve(success(1)))
      .bind(fail)
      .bind(square)
      .get();

    expect(getTestError(actual)).toBe("KO");
  });

  test("maps the success value", async () => {
    const actual = await asyncResult(Promise.resolve(success(1)))
      .map((n) => n + 1)
      .bind((n) => Promise.resolve(success(n ** 2)))
      .get();

    expect(getTestResult(actual)).toBe(4);
  });

  test("map short-circuits on error", async () => {
    const fn: (n: number) => number = vi.fn();

    const actual = await asyncResult<number, string>(
      Promise.resolve(error("KO")),
    )
      .map(fn)
      .get();

    expect(getTestError(actual)).toBe("KO");
    expect(fn).not.toHaveBeenCalled();
  });

  test("bindError recovers from an error", async () => {
    const actual = await asyncResult<number, string>(
      Promise.resolve(error("KO")),
    )
      .bindError(() => Promise.resolve(success(0)))
      .get();

    expect(getTestResult(actual)).toBe(0);
  });
});
