import { success } from "../success.ts";
import type { Result } from "../types.ts";
import type { WithContext } from "./types.ts";

/**
 * Pairs the success value of a `Promise<Result>` with a context. Errors are
 * forwarded untouched.
 *
 * Curried: `promiseResultWrap(context)` returns a function waiting for the
 * promise.
 *
 * @typeParam Context - The type of the context.
 * @param context - The initial context.
 * @returns A function wrapping the success value of its argument with `context`.
 *
 * @example
 * ```ts
 * import { getTestResult, promiseResultWrap, success } from "@quarzo-life/fp";
 *
 * const result = await promiseResultWrap({ step: 2 })(
 *   Promise.resolve(success(1)),
 * );
 * getTestResult(result); // { value: 1, context: { step: 2 } }
 * ```
 */
export const promiseResultWrap = <Context>(
  context: Context,
): <U, E>(
  promise: Promise<Result<U, E>>,
) => Promise<Result<WithContext<U, Context>, E>> =>
<U, E>(
  promise: Promise<Result<U, E>>,
): Promise<Result<WithContext<U, Context>, E>> =>
  promise.then((result) => result.bind((value) => success({ value, context })));
