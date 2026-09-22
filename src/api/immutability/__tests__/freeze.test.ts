import { describe, expect, test } from "vitest";
import { freeze } from "../freeze.ts";

type MutableProfile = {
  name: string;
  stats: {
    followers: number;
  };
  tags: string[];
  metadata: Map<string, number>;
};

const makeProfile = (): MutableProfile => ({
  name: "Quarzo",
  stats: { followers: 10 },
  tags: ["wealth", "insurance"],
  metadata: new Map([["posts", 2]]),
});

describe("freeze", () => {
  test("freezes only the provided level", () => {
    const frozen = freeze(makeProfile());

    expect(Object.isFrozen(frozen)).toBe(true);
    expect(Object.isFrozen(frozen.stats)).toBe(false);
    expect(Object.isFrozen(frozen.tags)).toBe(false);
    expect(Object.isFrozen(frozen.metadata)).toBe(false);

    expect(() => {
      // @ts-expect-error Runtime guard should reject writes
      frozen.name = "Quarzo 2";
    }).toThrowError(TypeError);

    const mutableStats = frozen.stats as unknown as MutableProfile["stats"];
    mutableStats.followers = 11;
    expect(mutableStats.followers).toBe(11);

    freeze(mutableStats);
    expect(Object.isFrozen(frozen.stats)).toBe(true);
  });

  test("blocks mutating methods on a Map", () => {
    const metadata = freeze(new Map([["posts", 2]]));

    expect(() => metadata.set("posts", 3)).toThrowError(TypeError);
    expect(() => metadata.delete("posts")).toThrowError(TypeError);
    expect(() => metadata.clear()).toThrowError(TypeError);
    expect(metadata.get("posts")).toBe(2);
  });

  test("blocks mutating methods on a Set", () => {
    const tags = freeze(new Set(["wealth"]));

    expect(() => tags.add("insurance")).toThrowError(TypeError);
    expect(() => tags.delete("wealth")).toThrowError(TypeError);
    expect(() => tags.clear()).toThrowError(TypeError);
    expect(tags.has("wealth")).toBe(true);
  });

  test("returns primitives as-is", () => {
    expect(freeze(42)).toBe(42);
    expect(freeze("foo")).toBe("foo");
    expect(freeze(null)).toBeNull();
  });

  test("deep freeze freezes the whole object when applied at each level", () => {
    const profile = makeProfile();
    const deepFreeze = freeze({
      ...profile,
      stats: freeze(profile.stats),
      tags: freeze(profile.tags),
      metadata: freeze(profile.metadata),
    });

    expect(Object.isFrozen(deepFreeze)).toBe(true);
    expect(Object.isFrozen(deepFreeze.stats)).toBe(true);
    expect(Object.isFrozen(deepFreeze.tags)).toBe(true);
    expect(Object.isFrozen(deepFreeze.metadata)).toBe(true);
  });
});
