import type { Result, Success } from "./types.ts";

/**
 * Unwraps a {@linkcode Result}, assuming it is a {@linkcode Success}.
 *
 * Intended for tests only: on an `Error` it returns `undefined` rather than
 * throwing, so the assertion on the returned value is what fails.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @param result - The `Result` to unwrap.
 * @returns The success value.
 *
 * @example
 * ```ts
 * import { getTestResult, success } from "@quarzo-life/fp";
 *
 * getTestResult(success(1)); // 1
 * ```
 */
export const getTestResult = <U, E>(result: Result<U, E>): U =>
  (result as Success<U>).value;
