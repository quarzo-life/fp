import { success } from "../success.ts";
import type { Success } from "../types.ts";
import type { WithContext } from "./types.ts";

/**
 * Pairs a plain value with a context, as a resolved `Success`.
 *
 * Curried: `wrap(context)` returns a function waiting for the value. This is
 * the usual entry point of a context-aware `asyncResult` chain.
 *
 * @typeParam Context - The type of the context.
 * @param context - The initial context.
 * @returns A function wrapping its argument with `context`.
 *
 * @example
 * ```ts
 * import { asyncResult, getTestResult, wrap } from "@quarzo-life/fp";
 *
 * const result = await asyncResult(wrap({ step: 2 })(1)).get();
 * getTestResult(result); // { value: 1, context: { step: 2 } }
 * ```
 */
export const wrap = <Context>(
  context: Context,
): <U>(value: U) => Promise<Success<WithContext<U, Context>>> =>
<U>(value: U): Promise<Success<WithContext<U, Context>>> =>
  Promise.resolve(success({ value, context }));
