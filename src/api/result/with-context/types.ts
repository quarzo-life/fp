import type { MappingFunction } from "../async-result.ts";
import type { Error } from "../types.ts";

/**
 * A value paired with a context that travels alongside it through an
 * asynchronous `Result` chain.
 *
 * @typeParam U - The type of the value.
 * @typeParam Context - The type of the context.
 *
 * @example
 * ```ts
 * import { type WithContext } from "@quarzo-life/fp";
 *
 * const step: WithContext<number, { requestId: string }> = {
 *   value: 1,
 *   context: { requestId: "abc" },
 * };
 * ```
 */
export type WithContext<U, Context> = {
  /** The value. */
  readonly value: U;
  /** The context. */
  readonly context: Context;
};

/**
 * A callback handed to context-aware steps to replace the context for the
 * following steps.
 *
 * @typeParam Context - The type of the new context.
 *
 * @example
 * ```ts
 * import { type UpdateContextFunction } from "@quarzo-life/fp";
 *
 * const update: UpdateContextFunction<{ step: number }> = (context) => {
 *   console.log(context.step);
 * };
 * ```
 */
export type UpdateContextFunction<Context> = (context: Context) => void;

/**
 * What a context-aware step receives: the current context and a callback to
 * update it.
 *
 * @typeParam FromContext - The incoming context type.
 * @typeParam ToContext - The outgoing context type.
 *
 * @example
 * ```ts
 * import { type ContextParameters } from "@quarzo-life/fp";
 *
 * const read = ([context]: ContextParameters<{ step: number }>) => context.step;
 * ```
 */
export type ContextParameters<FromContext, ToContext = FromContext> = [
  FromContext,
  UpdateContextFunction<ToContext>,
];

/**
 * A context-aware mapping step: given the context (and a way to update it),
 * returns the {@linkcode MappingFunction} to apply to the value.
 *
 * Argument type of {@linkcode withContext} and
 * `WithContextAsyncResult.bind`.
 *
 * @typeParam U - The incoming value type.
 * @typeParam V - The outgoing value type.
 * @typeParam F - The error type the step may produce.
 * @typeParam FromContext - The incoming context type.
 * @typeParam ToContext - The outgoing context type.
 *
 * @example
 * ```ts
 * import { type ContextMappingFunction, success } from "@quarzo-life/fp";
 *
 * type Context = { step: number };
 *
 * const add: ContextMappingFunction<number, number, never, Context> =
 *   ([{ step }]) => (n) => success(n + step);
 * ```
 */
export type ContextMappingFunction<
  U,
  V,
  F,
  FromContext,
  ToContext = FromContext,
> = (
  parameters: ContextParameters<FromContext, ToContext>,
) => MappingFunction<U, V, F>;

/**
 * A function mapping an error to another {@linkcode Error}, possibly
 * asynchronously.
 *
 * Argument type of `WithContextAsyncResult.bindError`.
 *
 * @typeParam E - The incoming error type.
 * @typeParam F - The outgoing error type.
 *
 * @example
 * ```ts
 * import { type ErrorMappingFunction, error } from "@quarzo-life/fp";
 *
 * const tag: ErrorMappingFunction<string, { code: string }> = (e) =>
 *   error({ code: e });
 * ```
 */
export type ErrorMappingFunction<E, F> = (
  e: E,
) => Error<F> | Promise<Error<F>>;
