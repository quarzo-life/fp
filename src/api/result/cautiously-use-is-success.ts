import type { Result, Success } from "./types.ts";

/**
 * Type guard checking whether a {@linkcode Result} is a {@linkcode Success}.
 *
 * Use cautiously: most of the time `.bind()` or `.fold()` express the
 * intent better than branching on the discriminant.
 *
 * @typeParam U - The type of the success value.
 * @typeParam E - The type of the error.
 * @param result - The `Result` to inspect.
 * @returns `true` when `result` is a success.
 *
 * @example
 * ```ts
 * import { cautiouslyUseIsSuccess, error, success } from "@quarzo-life/fp";
 *
 * cautiouslyUseIsSuccess(success(1)); // true
 * cautiouslyUseIsSuccess(error("KO")); // false
 * ```
 */
export const cautiouslyUseIsSuccess = <U, E>(
  result: Result<U, E>,
): result is Success<U> => result.type === "SUCCESS";
