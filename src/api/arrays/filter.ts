/**
 * Filters an array, data-last and optionally curried.
 *
 * `filter(predicate, array)` is `array.filter(predicate)`;
 * `filter(predicate)` returns a function waiting for the array, which
 * composes nicely with `pipe`.
 *
 * @param predicate - The predicate, receiving the value, its index and the whole array.
 * @param target - The array to filter.
 * @returns The elements for which `predicate` returned `true`.
 *
 * @example
 * ```ts
 * import { filter } from "@quarzo-life/fp";
 *
 * filter((n: number) => n % 2 === 0, [1, 2, 3, 4, 5]); // [2, 4]
 * filter((n: number) => n % 2 === 0)([1, 2, 3, 4, 5]); // [2, 4]
 * ```
 */
export function filter<T>(
  predicate: (value: T, index: number, array: T[]) => boolean,
  target: T[],
): T[];
/**
 * Curried form: returns a function filtering the array it receives.
 *
 * @param predicate - The predicate.
 * @returns A function filtering its argument with `predicate`.
 */
export function filter<T>(
  predicate: (value: T, index: number, array: T[]) => boolean,
): (target: T[]) => T[];
export function filter<T>(
  predicate: (value: T, index: number, array: T[]) => boolean,
  ...rest: [] | [T[]]
): T[] | ((target: T[]) => T[]) {
  const apply = (target: T[]): T[] => target.filter(predicate);
  return rest.length === 0 ? apply : apply(rest[0]);
}
