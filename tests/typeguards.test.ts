import { describe, expect, it } from "vitest";
import {
  isArray,
  isDefined,
  isDiscriminatedUnionMember,
  isEmptyArray,
  isEmptyMap,
  isEmptyObject,
  isEmptySet,
  isFalse,
  isMap,
  isNonEmptyArray,
  isNothing,
  isNumber,
  isObject,
  isOneOf,
  isPlainObject,
  isSet,
  isSomething,
  isString,
  isTrue,
  isNull,
  isUndefined,
} from "../src/typeguards.js";

describe("typeguards", () => {
  it("detects defined values", () => {
    expect(isDefined("value")).toBe(true);
    expect(isDefined(null)).toBe(false);
  });

  it("checks strings and non-empty option", () => {
    expect(isString("hello")).toBe(true);
    expect(isString("", false)).toBe(false);
  });

  it("checks numbers and arrays", () => {
    expect(isNumber(42)).toBe(true);
    expect(isNumber(NaN)).toBe(false);
    expect(isNonEmptyArray([1])).toBe(true);
    expect(isNonEmptyArray([])).toBe(false);
  });

  it("validates plain objects and literal sets", () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject(null)).toBe(false);
    expect(isOneOf("a", ["a", "b"] as const)).toBe(true);
    expect(isOneOf("c", ["a", "b"] as const)).toBe(false);
    expect(isObject({ a: 1 })).toBe(true);
    expect(isObject(null)).toBe(false);
    expect(isObject([])).toBe(false);
    expect(isEmptyObject({})).toBe(true);
    expect(isEmptyObject({ x: 1 })).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(Object.create(null))).toBe(true);
    expect(isArray([1, 2])).toBe(true);
    expect(isArray("nope")).toBe(false);
    expect(isEmptyArray([])).toBe(true);
    expect(isEmptyArray([1])).toBe(false);
    const filledSet = new Set([1]);
    const emptySet = new Set();
    expect(isSet(filledSet)).toBe(true);
    expect(isSet([])).toBe(false);
    expect(isEmptySet(emptySet)).toBe(true);
    expect(isEmptySet(filledSet)).toBe(false);
    const filledMap = new Map([["a", 1]]);
    const emptyMap = new Map();
    expect(isMap(filledMap)).toBe(true);
    expect(isMap({})).toBe(false);
    expect(isEmptyMap(emptyMap)).toBe(true);
    expect(isEmptyMap(filledMap)).toBe(false);
  });

  it("checks booleans and nullish helpers", () => {
    expect(isTrue(true)).toBe(true);
    expect(isTrue("value")).toBe(true);
    expect(isTrue(0)).toBe(false);
    expect(isTrue(false)).toBe(false);
    expect(isFalse(false)).toBe(true);
    expect(isFalse(true)).toBe(false);
    expect(isFalse(0)).toBe(true);
    expect(isFalse("")).toBe(true);
    expect(isFalse(-0)).toBe(true);
    expect(isFalse(0n)).toBe(true);
    expect(isFalse(NaN)).toBe(true);
    expect(isTrue(NaN)).toBe(false);
    expect(isNothing(undefined)).toBe(true);
    expect(isNothing(null)).toBe(true);
    expect(isNothing("")).toBe(false);
    expect(isSomething("value")).toBe(true);
    expect(isSomething(undefined)).toBe(false);
    expect(isNull(null)).toBe(true);
    expect(isNull(undefined)).toBe(false);
    expect(isUndefined(undefined)).toBe(true);
    expect(isUndefined(null)).toBe(false);
  });

  it("narrows discriminated unions by tag", () => {
    type Shape = { kind: "circle"; radius: number } | { kind: "square"; size: number };
    const circle: Shape = { kind: "circle", radius: 5 };
    const square: Shape = { kind: "square", size: 10 };

    if (isDiscriminatedUnionMember(circle, "kind", "circle")) {
      expect(circle.radius).toBe(5);
    } else {
      throw new Error("circle should be narrowed");
    }

    expect(isDiscriminatedUnionMember(square, "kind", "circle")).toBe(false);
  });
});
