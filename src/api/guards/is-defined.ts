/**
 * Type guard narrowing out `null` and `undefined`.
 *
 * Handy as an `Array.prototype.filter` callback.
 *
 * @typeParam T - The non-nullish type.
 * @param value - The value to check.
 * @returns `true` when `value` is neither `null` nor `undefined`.
 *
 * @example
 * ```ts
 * import { isDefined } from "@quarzo-life/fp";
 *
 * isDefined(0); // true
 * isDefined(null); // false
 * [1, undefined, 2, null].filter(isDefined); // [1, 2] as number[]
 * ```
 */
export const isDefined = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;
