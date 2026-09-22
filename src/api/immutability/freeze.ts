import type { Immutable } from "./types.ts";

const isObjectLike = (value: unknown): value is Record<PropertyKey, unknown> =>
  typeof value === "object" && value !== null;

const blockMutation = (target: object, method: string): void => {
  if (Object.prototype.hasOwnProperty.call(target, method)) {
    return;
  }

  Object.defineProperty(target, method, {
    value: () => {
      throw new TypeError(
        `Attempted to call "${method}" on an immutable ${
          target.constructor?.name ?? "object"
        }.`,
      );
    },
    writable: false,
    enumerable: false,
    configurable: false,
  });
};

/**
 * Freezes a value at the current level only.
 *
 * Objects and arrays are passed to `Object.freeze`. `Map` and `Set`
 * instances additionally get their mutating methods (`set`/`add`, `delete`,
 * `clear`) replaced by throwing stubs, since `Object.freeze` alone does not
 * block them. Nested values are left untouched: freeze them explicitly to
 * opt in to a deep freeze. Primitives are returned as-is.
 *
 * @typeParam T - The type of the value.
 * @param value - The value to freeze. It is mutated in place.
 * @returns The same value, typed as {@linkcode Immutable}.
 *
 * @example
 * ```ts
 * import { freeze } from "@quarzo-life/fp";
 *
 * const profile = freeze({ name: "Quarzo", stats: { followers: 10 } });
 * Object.isFrozen(profile); // true
 * Object.isFrozen(profile.stats); // false (shallow)
 *
 * const metadata = freeze(new Map([["posts", 2]]));
 * metadata.set("posts", 3); // throws TypeError
 * ```
 */
export const freeze = <T>(value: T): Immutable<T> => {
  if (!isObjectLike(value)) {
    return value as Immutable<T>;
  }

  if (value instanceof Map) {
    blockMutation(value, "set");
    blockMutation(value, "delete");
    blockMutation(value, "clear");
    return Object.freeze(value) as Immutable<T>;
  }

  if (value instanceof Set) {
    blockMutation(value, "add");
    blockMutation(value, "delete");
    blockMutation(value, "clear");
    return Object.freeze(value) as Immutable<T>;
  }

  return Object.freeze(value) as Immutable<T>;
};
