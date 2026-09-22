/**
 * Base class for errors carried by a {@linkcode Result}.
 *
 * It deliberately does not extend the global `Error`: no stack trace is
 * captured, and it is meant to be returned, not thrown. `name` is set to the
 * concrete class name so subclasses are recognisable when logged.
 *
 * @typeParam Code - The literal type of the error code.
 *
 * @example
 * ```ts
 * import { error, ResultError } from "@quarzo-life/fp";
 *
 * class NotFound extends ResultError<"NOT_FOUND"> {
 *   constructor(id: string) {
 *     super(`No entity with id ${id}`, "NOT_FOUND");
 *   }
 * }
 *
 * const failed = error(new NotFound("42"));
 * failed.error.code; // "NOT_FOUND"
 * failed.error.name; // "NotFound"
 * ```
 */
export class ResultError<Code extends string> {
  /** The concrete class name. */
  readonly name: string;

  /**
   * Creates an error with a message and a code.
   *
   * @param message - A human-readable description.
   * @param code - A machine-readable code.
   */
  constructor(public readonly message: string, public readonly code: Code) {
    this.name = new.target.name;
  }

  /**
   * Renders the error as its message.
   *
   * @returns The error message.
   */
  toString(): string {
    return this.message;
  }
}
