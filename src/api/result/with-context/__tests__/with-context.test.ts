import { describe, expect, test } from "vitest";
import { asyncResult } from "../../async-result.ts";
import { getTestResult } from "../../get-test-result.ts";
import { success } from "../../success.ts";
import { promiseWrap } from "../promise-wrap.ts";
import type { ContextMappingFunction } from "../types.ts";
import { unwrap } from "../unwrap.ts";
import { withContext } from "../with-context.ts";
import { wrap } from "../wrap.ts";

describe("withContext", () => {
  test("forwards the context", async () => {
    type Context = { value: string };
    const context: Context = { value: "Hello World!" };
    const increment = () => (n: number) => Promise.resolve(success(n + 1));

    const actual = await asyncResult(wrap(context)(1))
      .bind(withContext(increment))
      .get();

    expect(getTestResult(actual).value).toBe(2);
    expect(getTestResult(actual).context.value).toBe("Hello World!");
  });

  test("allows to read from the context", async () => {
    type Context = { step: number };
    const context: Context = { step: 2 };
    const increment: ContextMappingFunction<number, number, never, Context> =
      ([{ step }]) => (n) => Promise.resolve(success(n + step));

    const actual = await asyncResult(wrap(context)(1))
      .bind(withContext(increment))
      .bind(unwrap)
      .get();

    expect(getTestResult(actual)).toBe(3);
  });

  test("allows to read from the context, starting from a Promise", async () => {
    type Context = { step: number };
    const context: Context = { step: 2 };
    const increment: ContextMappingFunction<number, number, never, Context> =
      ([{ step }]) => (n) => Promise.resolve(success(n + step));

    const actual = await asyncResult(promiseWrap(context)(Promise.resolve(1)))
      .bind(withContext(increment))
      .bind(unwrap)
      .get();

    expect(getTestResult(actual)).toBe(3);
  });

  test("allows to read from the context, starting from a Promise of Result", async () => {
    type Context = { step: number };
    const context: Context = { step: 2 };
    const increment: ContextMappingFunction<number, number, never, Context> =
      ([{ step }]) => (n) => Promise.resolve(success(n + step));

    const actual = await asyncResult(Promise.resolve(success(1)))
      .bind(wrap(context))
      .bind(withContext(increment))
      .bind(unwrap)
      .get();

    expect(getTestResult(actual)).toBe(3);
  });

  test("allows to write into the context", async () => {
    type Context = { value: string };
    const context: Context = { value: "Hello World!" };
    const increment: ContextMappingFunction<number, number, never, Context> =
      ([_, updateContext]) => (n) => {
        updateContext({ value: "Hello Guys!" });
        return Promise.resolve(success(n + 1));
      };

    const actual = await asyncResult(wrap(context)(1))
      .bind(withContext(increment))
      .get();

    expect(getTestResult(actual).value).toBe(2);
    expect(getTestResult(actual).context.value).toBe("Hello Guys!");
  });

  test("allows to change the type of the context", async () => {
    type FromContext = { value: number };
    type ToContext = { value: string };
    const context: FromContext = { value: 0 };
    const increment: ContextMappingFunction<
      number,
      number,
      never,
      FromContext,
      ToContext
    > = ([context, updateContext]) => (n) => {
      updateContext({ value: context.value.toString() });
      return Promise.resolve(success(n + 1));
    };

    const actual = await asyncResult(wrap(context)(0))
      .bind(withContext(increment))
      .get();

    expect(getTestResult(actual).context.value).toBe("0");
  });
});
