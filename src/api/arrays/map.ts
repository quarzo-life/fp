/**
 * Maps over an array, data-last and optionally curried.
 *
 * `map(mapper, array)` is `array.map(mapper)`; `map(mapper)` returns a
 * function waiting for the array, which composes nicely with `pipe`.
 *
 * @param mapper - The mapping function, receiving the value, its index and the whole array.
 * @param target - The array to map over.
 * @returns The mapped array.
 *
 * @example
 * ```ts
 * import { map } from "@quarzo-life/fp";
 *
 * map((n: number) => n * 2, [2, 3, 4]); // [4, 6, 8]
 * map((n: number) => n * 2)([2, 3, 4]); // [4, 6, 8]
 * ```
 */
export function map<T, U>(
  mapper: (value: T, index: number, array: T[]) => U,
  target: T[],
): U[];
/**
 * Curried form: returns a function mapping over the array it receives.
 *
 * @param mapper - The mapping function.
 * @returns A function mapping `mapper` over its argument.
 */
export function map<T, U>(
  mapper: (value: T, index: number, array: T[]) => U,
): (target: T[]) => U[];
export function map<T, U>(
  mapper: (value: T, index: number, array: T[]) => U,
  ...rest: [] | [T[]]
): U[] | ((target: T[]) => U[]) {
  const apply = (target: T[]): U[] => target.map(mapper);
  return rest.length === 0 ? apply : apply(rest[0]);
}
