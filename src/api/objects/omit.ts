/**
 * Returns a shallow copy of an object without the given property.
 *
 * Curried: `omit(key)` returns a function waiting for the object. Only own
 * enumerable string-keyed properties are copied.
 *
 * @param key - The property to leave out.
 * @returns A function copying its argument without `key`.
 *
 * @example
 * ```ts
 * import { omit } from "@quarzo-life/fp";
 *
 * omit("password")({ id: 1, password: "secret" }); // { id: 1 }
 * ```
 */
export const omit =
  <K extends string>(key: K): <T extends object>(obj: T) => Omit<T, K> =>
  <T extends object>(obj: T): Omit<T, K> =>
    Object.fromEntries(
      Object.entries(obj).filter(([k]) => k !== key),
    ) as Omit<T, K>;
