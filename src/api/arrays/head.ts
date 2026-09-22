/**
 * Returns the first element of an array, or `undefined` when it is empty.
 *
 * @typeParam T - The element type.
 * @param array - The array.
 * @returns The first element, if any.
 *
 * @example
 * ```ts
 * import { head } from "@quarzo-life/fp";
 *
 * head([1, 2, 3]); // 1
 * head([]); // undefined
 * ```
 */
export const head = <T>(array: readonly T[]): T | undefined => array[0];
