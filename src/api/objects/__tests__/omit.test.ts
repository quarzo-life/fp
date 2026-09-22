import { describe, expect, test } from "vitest";
import { omit } from "../omit.ts";

describe("omit", () => {
  test("removes the given property", () => {
    expect(omit("password")({ id: 1, password: "secret" })).toEqual({ id: 1 });
  });

  test("does not mutate the original object", () => {
    const original = { id: 1, password: "secret" };
    omit("password")(original);

    expect(original).toEqual({ id: 1, password: "secret" });
  });

  test("leaves the object untouched when the property is absent", () => {
    expect(omit("missing")({ id: 1 })).toEqual({ id: 1 });
  });
});
