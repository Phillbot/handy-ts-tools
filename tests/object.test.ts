import { describe, expect, it } from "vitest";
import { deepGet, deepSet, ensureMap, ensureSet, merge, omit, pick } from "../src/object.js";

describe("object helpers", () => {
  it("picks provided keys from source object", () => {
    const source = { a: 1, b: 2, c: 3 };
    expect(pick(source, ["a", "c"])).toEqual({ a: 1, c: 3 });
  });

  it("ensures set/map instances", () => {
    const existingSet = new Set([1]);
    expect(ensureSet(existingSet)).toBe(existingSet);
    expect(Array.from(ensureSet([1, 2, 2]))).toEqual([1, 2]);

    const existingMap = new Map([["a", 1]]);
    expect(ensureMap(existingMap)).toBe(existingMap);
    expect(Array.from(ensureMap([["a", 1], ["a", 2]]))).toEqual([["a", 2]]);
  });

  it("omits and merges objects", () => {
    const source = { a: 1, b: 2, c: 3 };
    expect(omit(source, ["b"])).toEqual({ a: 1, c: 3 });
    expect(merge({ a: 1 }, { b: 2 }, { a: 3 })).toEqual({ a: 3, b: 2 });
  });

  it("gets and sets deep paths", () => {
    const obj: any = { user: { profile: { name: "Ann" } } };
    expect(deepGet(obj, ["user", "profile", "name"])).toBe("Ann");
    expect(deepGet(obj, ["missing", "path"])).toBeUndefined();
    deepSet(obj, ["user", "profile", "age"], 30);
    expect(obj.user.profile.age).toBe(30);
  });
});
