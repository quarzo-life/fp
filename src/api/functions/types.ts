// deno-lint-ignore-file no-explicit-any

/**
 * A function taking any arguments and returning anything.
 *
 * This is the loosest signature accepted by the variadic composition helpers
 * ({@linkcode compose}, {@linkcode pipe}, {@linkcode curry}); it is only used
 * when the type system cannot track the composed types precisely.
 *
 * @example
 * ```ts
 * import { type AnyFunction } from "@quarzo-life/fp";
 *
 * const log: AnyFunction = (...args) => console.log(...args);
 * ```
 */
export type AnyFunction = (...args: any[]) => any;

/**
 * A function taking any arguments and returning a `Promise`.
 *
 * Used by {@linkcode composeAsync}.
 *
 * @example
 * ```ts
 * import { type AnyAsyncFunction } from "@quarzo-life/fp";
 *
 * const fetchJson: AnyAsyncFunction = (url) => fetch(url).then((r) => r.json());
 * ```
 */
export type AnyAsyncFunction = (...args: any[]) => Promise<unknown>;
