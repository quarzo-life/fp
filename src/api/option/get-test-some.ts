import type { Option, Some } from "./types.ts";

/**
 * Unwraps an {@linkcode Option}, assuming it is a {@linkcode Some}.
 *
 * Intended for tests only: on a `None` it returns `undefined` rather than
 * throwing, so the assertion on the returned value is what fails.
 *
 * @typeParam U - The type of the value.
 * @param option - The `Option` to unwrap.
 * @returns The wrapped value.
 *
 * @example
 * ```ts
 * import { getTestSome, some } from "@quarzo-life/fp";
 *
 * getTestSome(some(1)); // 1
 * ```
 */
export const getTestSome = <U>(option: Option<U>): U =>
  (option as Some<U>).value;
