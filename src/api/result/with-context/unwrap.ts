import { success } from "../success.ts";
import type { Success } from "../types.ts";
import type { WithContext } from "./types.ts";

/**
 * Drops the context and keeps the value, as a `Success`.
 *
 * Typically the last `.bind()` of a context-aware chain, before `.get()`.
 *
 * @typeParam U - The type of the value.
 * @typeParam Context - The type of the context.
 * @param withContext - The value/context pair.
 * @returns A `Success` holding only the value.
 *
 * @example
 * ```ts
 * import { asyncResult, getTestResult, unwrap, wrap } from "@quarzo-life/fp";
 *
 * const result = await asyncResult(wrap({ step: 2 })(1)).bind(unwrap).get();
 * getTestResult(result); // 1
 * ```
 */
export const unwrap = <U, Context>(
  { value }: WithContext<U, Context>,
): Success<U> => success(value);
