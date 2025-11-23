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
  isOdd,
  isEven,
  isInteger,
  isFiniteNumber,
  isPositive,
  isNegative,
  isBetween,
  isMultipleOf,
  isObject,
  isNonEmptyString,
  isUUID,
  isISODate,
  isISODateTime,
  isOneOf,
  isPlainObject,
  isSet,
  isNonEmptySet,
  isSomething,
  isString,
  isTrue,
  isNull,
  isUndefined,
  isGreaterThanZero,
  isNonEmptyMap,
  hasKey,
  isShallowEqual,
  createBrand,
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
    expect(isFiniteNumber(2)).toBe(true);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isInteger(3)).toBe(true);
    expect(isInteger(3.14)).toBe(false);
    expect(isEven(2)).toBe(true);
    expect(isEven(-2)).toBe(true);
    expect(isEven(3)).toBe(false);
    expect(isEven(2.5)).toBe(false);
    expect(isOdd(3)).toBe(true);
    expect(isOdd(-3)).toBe(true);
    expect(isOdd(4)).toBe(false);
    expect(isOdd(3.5)).toBe(false);
    expect(isPositive(1)).toBe(true);
    expect(isPositive(0)).toBe(false);
    expect(isNegative(-1)).toBe(true);
    expect(isNegative(0)).toBe(false);
    expect(isBetween(5, 0, 5)).toBe(true);
    expect(isBetween(5, 0, 5, false)).toBe(false);
    expect(isMultipleOf(10, 5)).toBe(true);
    expect(isMultipleOf(-9, 3)).toBe(true);
    expect(() => isMultipleOf(2, 0)).toThrow();
    expect(isGreaterThanZero(1)).toBe(true);
    expect(isGreaterThanZero(0)).toBe(false);
    expect(isGreaterThanZero(-1)).toBe(false);
    expect(isGreaterThanZero(NaN)).toBe(false);
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
    expect(isNonEmptySet(filledSet)).toBe(true);
    expect(isNonEmptySet(emptySet)).toBe(false);
    const filledMap = new Map([["a", 1]]);
    const emptyMap = new Map();
    expect(isMap(filledMap)).toBe(true);
    expect(isMap({})).toBe(false);
    expect(isEmptyMap(emptyMap)).toBe(true);
    expect(isEmptyMap(filledMap)).toBe(false);
    expect(isNonEmptyMap(filledMap)).toBe(true);
    expect(isNonEmptyMap(emptyMap)).toBe(false);
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

  it("validates string patterns", () => {
    expect(isNonEmptyString("hello")).toBe(true);
    expect(isNonEmptyString("")).toBe(false);
    expect(isUUID("123e4567-e89b-12d3-a456-426614174000")).toBe(true);
    expect(isUUID("not-a-uuid")).toBe(false);
    expect(isISODate("2023-02-28")).toBe(true);
    expect(isISODate("2023-02-30")).toBe(false);
    expect(isISODateTime("2023-02-28T12:30:00Z")).toBe(true);
    expect(isISODateTime("2023-02-28T25:00:00Z")).toBe(false);
  });

  it("narrows objects containing keys", () => {
    const obj: { a?: number } = { a: 1 };
    if (hasKey(obj, "a")) {
      expect(obj.a).toBe(1);
    }
    expect(hasKey({ b: 2 }, "a" as const)).toBe(false);
  });

  it("performs shallow equality", () => {
    expect(isShallowEqual([1, 2], [1, 2])).toBe(true);
    expect(isShallowEqual([1, 2], [2, 1])).toBe(false);
    expect(isShallowEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
    expect(isShallowEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(isShallowEqual("a", "a")).toBe(true);
    expect(isShallowEqual("a", "b")).toBe(false);
  });

  it("brands and guards values", () => {
    const { brand, isBrand } = createBrand<"UserId">();
    const rawObj = { id: 42 };
    const brandedObj = brand(rawObj);
    expect(isBrand(brandedObj)).toBe(true);
    expect(isBrand({ id: 42 })).toBe(false);

    const rawStr = "42";
    const brandedStr = brand(rawStr);
    expect(isBrand(brandedStr)).toBe(true);
    expect(isBrand(rawStr)).toBe(false);
    expect(String(brandedStr)).toBe(rawStr); // boxed primitive still coerces correctly
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
    expect(isDiscriminatedUnionMember(null as any, "kind", "circle")).toBe(false);
    expect(isDiscriminatedUnionMember(() => {}, "kind" as any, "circle")).toBe(false);
  });

  it("rejects functions as objects", () => {
    expect(isObject(() => {})).toBe(false);
  });
});
