/**
 * The type of property `K` on `T`, or `undefined` when `T` is nullish or has
 * no such property.
 *
 * Return type of {@linkcode prop}.
 *
 * @example
 * ```ts
 * import { type PropValue } from "@quarzo-life/fp";
 *
 * type Id = PropValue<{ id: string }, "id">; // string
 * type Missing = PropValue<{ id: string }, "name">; // undefined
 * ```
 */
export type PropValue<T, K extends PropertyKey> = T extends null | undefined
  ? undefined
  : K extends keyof T ? T[K]
  : undefined;

/**
 * Reads a property from an object, data-last and optionally curried.
 *
 * Nullish targets yield `undefined` instead of throwing.
 *
 * @param key - The property name.
 * @param target - The object to read from.
 * @returns The property value, or `undefined`.
 *
 * @example
 * ```ts
 * import { prop } from "@quarzo-life/fp";
 *
 * const user = { id: "123", name: "Case" };
 *
 * prop("id", user); // "123"
 * prop("name")(user); // "Case"
 * prop("count")(undefined); // undefined
 * ```
 */
export function prop<K extends PropertyKey>(
  key: K,
): <T>(target: T) => PropValue<T, K>;
/**
 * Uncurried form: reads `key` from `target` immediately.
 *
 * @param key - The property name.
 * @param target - The object to read from.
 * @returns The property value, or `undefined`.
 */
export function prop<T, K extends PropertyKey>(
  key: K,
  target: T,
): PropValue<T, K>;
export function prop<K extends PropertyKey, T>(
  key: K,
  ...rest: [] | [T]
): unknown {
  const getter = (input: T): unknown => {
    if (input === null || input === undefined) {
      return undefined;
    }

    return (input as Record<PropertyKey, unknown>)[key];
  };

  return rest.length === 0 ? getter : getter(rest[0]);
}
