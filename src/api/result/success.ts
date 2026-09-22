import type { ResultMappingFunction, Success } from "./types.ts";

/**
 * Builds a {@linkcode Success}: a {@linkcode Result} holding `value`.
 *
 * `bind` applies its function to the value; `bindError` is a no-op; `fold`
 * calls `onSuccess`.
 *
 * @typeParam U - The type of the value.
 * @param value - The value.
 * @returns A `Success` wrapping `value`.
 *
 * @example
 * ```ts
 * import { getTestResult, success } from "@quarzo-life/fp";
 *
 * const result = success(1).bind((n) => success(n + 1));
 * getTestResult(result); // 2
 * ```
 */
export const success = <U>(value: U): Success<U> => ({
  type: "SUCCESS",
  value,
  bind: <V, F>(fn: ResultMappingFunction<U, V, F>) => fn(value),
  bindError: () => success(value),
  fold: <R>(onSuccess: (u: U) => R) => onSuccess(value),
});
