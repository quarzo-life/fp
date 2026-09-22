import { success } from "../success.ts";
import type { Success } from "../types.ts";
import type { WithContext } from "./types.ts";

/**
 * Pairs the resolved value of a promise with a context, as a `Success`.
 *
 * Curried: `promiseWrap(context)` returns a function waiting for the promise.
 *
 * @typeParam Context - The type of the context.
 * @param context - The initial context.
 * @returns A function wrapping the resolved value of its argument with `context`.
 *
 * @example
 * ```ts
 * import { asyncResult, getTestResult, promiseWrap } from "@quarzo-life/fp";
 *
 * const result = await asyncResult(
 *   promiseWrap({ step: 2 })(Promise.resolve(1)),
 * ).get();
 * getTestResult(result); // { value: 1, context: { step: 2 } }
 * ```
 */
export const promiseWrap = <Context>(
  context: Context,
): <U>(promise: Promise<U>) => Promise<Success<WithContext<U, Context>>> =>
<U>(promise: Promise<U>): Promise<Success<WithContext<U, Context>>> =>
  promise.then((value) => success({ value, context }));
