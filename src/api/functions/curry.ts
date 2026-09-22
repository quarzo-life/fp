import type { AnyFunction } from "./types.ts";

/**
 * The curried form of a function taking `Args` and returning `R`.
 *
 * A zero-argument function stays a zero-argument function; otherwise each
 * argument is taken by a successive unary call.
 *
 * @example
 * ```ts
 * import { type CurryResult } from "@quarzo-life/fp";
 *
 * type Join = CurryResult<[string, string], string>;
 * // (arg: string) => (arg: string) => string
 * ```
 */
export type CurryResult<Args extends unknown[], R> = Args extends [] ? () => R
  : CurryResultNonEmpty<Args, R>;

/**
 * The curried form of a function taking at least one argument.
 *
 * Building block of {@linkcode CurryResult}.
 *
 * @example
 * ```ts
 * import { type CurryResultNonEmpty } from "@quarzo-life/fp";
 *
 * type Add = CurryResultNonEmpty<[number, number], number>;
 * // (arg: number) => (arg: number) => number
 * ```
 */
export type CurryResultNonEmpty<Args extends unknown[], R> = Args extends
  [infer Head, ...infer Rest] ? (
    arg: Head,
  ) => Rest extends [] ? R : CurryResultNonEmpty<Rest, R>
  : R;

/**
 * Curries a function: the result takes its arguments one call at a time and
 * invokes the original function once `requiredArgs` arguments were received.
 *
 * `requiredArgs` defaults to the function's declared arity (`fn.length`); pass
 * it explicitly for variadic or defaulted-parameter functions. Note that the
 * static return type always follows the declared parameters, so an explicit
 * `requiredArgs` that differs from them needs a cast on the caller's side.
 *
 * @param fn - The function to curry.
 * @param requiredArgs - How many arguments to collect before calling `fn`.
 * @returns The curried function.
 *
 * @example
 * ```ts
 * import { curry } from "@quarzo-life/fp";
 *
 * const join = (a: string, b: string, c: string) => `${a}-${b}-${c}`;
 *
 * curry(join)("a")("b")("c"); // "a-b-c"
 * curry(() => 42)(); // 42
 * ```
 */
export function curry<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  requiredArgs?: number,
): CurryResult<Args, R>;
export function curry(
  fn: AnyFunction,
  requiredArgs: number = fn.length,
): AnyFunction {
  const curried = (...args: unknown[]): unknown => {
    if (args.length >= requiredArgs) {
      return fn(...args);
    }

    return (nextArg: unknown) => curried(...args, nextArg);
  };

  return curried;
}
