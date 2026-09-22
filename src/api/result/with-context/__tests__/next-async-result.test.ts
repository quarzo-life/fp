import { describe, expect, test } from "vitest";
import { error } from "../../error.ts";
import { getTestError } from "../../get-test-error.ts";
import { getTestResult } from "../../get-test-result.ts";
import { success } from "../../success.ts";
import { nextAsyncResult } from "../next-async-result.ts";
import type { ContextMappingFunction } from "../types.ts";

describe("nextAsyncResult", () => {
  test("makes context management fully implicit (no context)", async () => {
    const increment: ContextMappingFunction<
      number,
      number,
      never,
      Record<string, never>
    > = () => (n) => Promise.resolve(success(n + 1));

    const actual = await nextAsyncResult<number, never>(
      Promise.resolve(success(1)),
    )
      .bind(increment)
      .get();

    expect(getTestResult(actual)).toBe(2);
  });

  test("makes context management fully implicit", async () => {
    type Context = { step: number };
    const increment: ContextMappingFunction<number, number, never, Context> =
      ([{ step }]) => (n) => Promise.resolve(success(n + step));

    const actual = await nextAsyncResult<number, never, Context>(
      Promise.resolve(success(1)),
      { step: 2 },
    )
      .bind(increment)
      .get();

    expect(getTestResult(actual)).toBe(3);
  });

  test("short-circuits on error and lets bindError recover", async () => {
    const fail: ContextMappingFunction<
      number,
      number,
      string,
      Record<string, never>
    > = () => () => Promise.resolve(error("KO"));
    const increment: ContextMappingFunction<
      number,
      number,
      never,
      Record<string, never>
    > = () => (n) => Promise.resolve(success(n + 1));

    const failed = await nextAsyncResult<number, never>(
      Promise.resolve(success(1)),
    )
      .bind(fail)
      .bind(increment)
      .get();
    expect(getTestError(failed)).toBe("KO");

    const recovered = await nextAsyncResult<number, never>(
      Promise.resolve(success(1)),
    )
      .bind(fail)
      .bindError((e) => Promise.resolve(error(`${e}!`)))
      .get();
    expect(getTestError(recovered)).toBe("KO!");
  });
});
