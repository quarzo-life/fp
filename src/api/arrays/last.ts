/**
 * Returns the last element of an array, or `undefined` when it is empty.
 *
 * @typeParam T - The element type.
 * @param array - The array.
 * @returns The last element, if any.
 *
 * @example
 * ```ts
 * import { last } from "@quarzo-life/fp";
 *
 * last([1, 2, 3]); // 3
 * last([]); // undefined
 * ```
 */
export const last = <T>(array: readonly T[]): T | undefined =>
  array[array.length - 1];
