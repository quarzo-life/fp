// deno-lint-ignore-file ban-types
import { identity } from "../identity.ts";
import type { AnyFunction } from "./types.ts";

/**
 * Composes functions from left to right.
 *
 * The leftmost function may take any number of arguments; every other
 * function receives the result of the one to its left. With no argument,
 * `pipe()` returns {@linkcode identity}; with a single function it is
 * returned as-is.
 *
 * @returns A function running the given functions from left to right.
 *
 * @example
 * ```ts
 * import { pipe } from "@quarzo-life/fp";
 *
 * const double = (n: number) => n * 2;
 * const addOne = (n: number) => n + 1;
 * const asString = (n: number) => `${n}`;
 *
 * pipe(double, addOne, asString)(3); // "7"
 * ```
 */
export function pipe(): <T>(value: T) => T;
/**
 * Pipes a single function, which is returned unchanged.
 *
 * @param fn - The function.
 * @returns The very same function.
 */
export function pipe<F extends Function>(fn: F): F;
/**
 * Pipes two or more functions from left to right.
 *
 * @param fns - The functions to pipe.
 * @returns A function running `fns` from left to right.
 */
export function pipe(...fns: Function[]): AnyFunction;
export function pipe(...fns: Function[]): AnyFunction {
  const steps = fns as AnyFunction[];
  if (steps.length === 0) {
    return identity;
  }

  if (steps.length === 1) {
    return steps[0];
  }

  return (...args: unknown[]) => {
    let result = steps[0](...args);
    for (let index = 1; index < steps.length; index += 1) {
      result = steps[index](result);
    }

    return result;
  };
}
