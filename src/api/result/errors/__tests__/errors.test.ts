import { describe, expect, test } from "vitest";
import { DomainFailure } from "../domain-failure.ts";
import { isFailureKind } from "../is-failure-kind.ts";
import { PermanentTechnicalFailure } from "../permanent-technical-failure.ts";
import { ResultError } from "../result-error.ts";
import { TransientTechnicalFailure } from "../transient-technical-failure.ts";

class NotFound extends ResultError<"NOT_FOUND"> {
  constructor(id: string) {
    super(`No entity with id ${id}`, "NOT_FOUND");
  }
}

class InsufficientFunds extends DomainFailure<"INSUFFICIENT_FUNDS"> {
  constructor() {
    super("Not enough cash on the account", "INSUFFICIENT_FUNDS");
  }
}

describe("ResultError", () => {
  test("exposes message, code and the concrete class name", () => {
    const failure = new NotFound("42");

    expect(failure.message).toBe("No entity with id 42");
    expect(failure.code).toBe("NOT_FOUND");
    expect(failure.name).toBe("NotFound");
    expect(String(failure)).toBe("No entity with id 42");
  });

  test("does not extend the global Error", () => {
    expect(new NotFound("42")).not.toBeInstanceOf(Error);
  });
});

describe("classified failures", () => {
  test("DomainFailure is tagged DOMAIN", () => {
    expect(new InsufficientFunds().failureKind).toBe("DOMAIN");
  });

  test("TransientTechnicalFailure is tagged TRANSIENT_TECHNICAL", () => {
    expect(new TransientTechnicalFailure("Timeout", "TIMEOUT").failureKind)
      .toBe("TRANSIENT_TECHNICAL");
  });

  test("PermanentTechnicalFailure is tagged PERMANENT_TECHNICAL", () => {
    expect(new PermanentTechnicalFailure("Bug", "BUG").failureKind).toBe(
      "PERMANENT_TECHNICAL",
    );
  });
});

describe("isFailureKind", () => {
  test("matches a classified failure of the given kind", () => {
    expect(isFailureKind(new InsufficientFunds(), "DOMAIN")).toBe(true);
  });

  test("rejects a classified failure of another kind", () => {
    expect(isFailureKind(new InsufficientFunds(), "TRANSIENT_TECHNICAL")).toBe(
      false,
    );
  });

  test("rejects an unclassified ResultError", () => {
    expect(isFailureKind(new NotFound("42"), "DOMAIN")).toBe(false);
  });

  test("rejects non-ResultError values", () => {
    expect(isFailureKind("oops", "DOMAIN")).toBe(false);
    expect(isFailureKind({ failureKind: "DOMAIN" }, "DOMAIN")).toBe(false);
    expect(isFailureKind(null, "DOMAIN")).toBe(false);
  });
});
