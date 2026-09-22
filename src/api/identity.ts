/**
 * Returns its argument unchanged.
 *
 * Useful as a no-op callback, a default transformer, or the neutral element
 * when composing functions.
 *
 * @typeParam T - The type of the value.
 * @param value - The value to return.
 * @returns The very same `value`.
 *
 * @example Using `identity` as a default mapper
 * ```ts
 * import { identity } from "@quarzo-life/fp";
 *
 * identity(42); // 42
 * [1, 2, 3].map(identity); // [1, 2, 3]
 * ```
 */
export const identity = <T>(value: T): T => value;
