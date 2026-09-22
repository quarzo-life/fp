import type { AnyAsyncFunction } from "./types.ts";

/**
 * Composes asynchronous functions from right to left, awaiting each step.
 *
 * The rightmost function may take any number of arguments; every other
 * function receives the awaited result of the one to its right. With no
 * argument the returned function resolves to its first argument.
 *
 * @typeParam T - The type of the final resolved value.
 * @param fns - The asynchronous functions to compose.
 * @returns An asynchronous function running `fns` from right to left.
 *
 * @example
 * ```ts
 * import { composeAsync } from "@quarzo-life/fp";
 *
 * const sum = async (a: number, b: number) => a + b;
 * const addOne = async (n: number) => n + 1;
 * const double = async (n: number) => n * 2;
 *
 * await composeAsync<number>(double, addOne, sum)(2, 3); // 12
 * ```
 */
export const composeAsync = <T>(
  ...fns: AnyAsyncFunction[]
): (...args: unknown[]) => Promise<T> => {
  if (fns.length === 0) {
    return (...args: unknown[]) => Promise.resolve(args[0] as T);
  }

  if (fns.length === 1) {
    return fns[0] as (...args: unknown[]) => Promise<T>;
  }

  return async (...args: unknown[]): Promise<T> => {
    let result: unknown = await fns[fns.length - 1](...args);
    for (let index = fns.length - 2; index >= 0; index -= 1) {
      result = await fns[index](result);
    }

    return result as T;
  };
};
