// deno-lint-ignore-file ban-types
import { identity } from "../identity.ts";
import type { AnyFunction } from "./types.ts";

/**
 * Composes functions from right to left.
 *
 * The rightmost function may take any number of arguments; every other
 * function receives the result of the one to its right. With no argument,
 * `compose()` returns {@linkcode identity}; with a single function it is
 * returned as-is.
 *
 * @returns A function running the given functions from right to left.
 *
 * @example
 * ```ts
 * import { compose } from "@quarzo-life/fp";
 *
 * const sum = (a: number, b: number) => a + b;
 * const addOne = (n: number) => n + 1;
 * const double = (n: number) => n * 2;
 *
 * compose(double, addOne, sum)(2, 3); // 12
 * compose()("foo"); // "foo"
 * ```
 */
export function compose(): <T>(value: T) => T;
/**
 * Composes a single function, which is returned unchanged.
 *
 * @param fn - The function.
 * @returns The very same function.
 */
export function compose<F extends Function>(fn: F): F;
/**
 * Composes two or more functions from right to left.
 *
 * @param fns - The functions to compose.
 * @returns A function running `fns` from right to left.
 */
export function compose(...fns: Function[]): AnyFunction;
export function compose(...fns: Function[]): AnyFunction {
  const steps = fns as AnyFunction[];
  if (steps.length === 0) {
    return identity;
  }

  if (steps.length === 1) {
    return steps[0];
  }

  return (...args: unknown[]) => {
    let result = steps[steps.length - 1](...args);
    for (let index = steps.length - 2; index >= 0; index -= 1) {
      result = steps[index](result);
    }

    return result;
  };
}
