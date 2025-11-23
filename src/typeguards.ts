import type { Falsy, Truthy, Opaque } from "./types.js";

/**
 * Type guards for narrowing values at runtime.
 */

/**
 * Checks whether the provided value is neither null nor undefined.
 */
export function isDefined<T>(value: T | null | undefined): value is Exclude<T, null | undefined> {
  return value !== undefined && value !== null;
}

/**
 * Guard that narrows a value to string and excludes empty strings when `allowEmpty` is false.
 */
export function isString(value: unknown, allowEmpty = true): value is string {
  return typeof value === "string" && (allowEmpty || value.length > 0);
}

/**
 * Guard for non-empty strings (shortcut for isString with allowEmpty=false).
 */
export function isNonEmptyString(value: unknown): value is string {
  return isString(value, false);
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d{1,3})?)?(?:Z|[+-][01]\d:[0-5]\d)$/;

/**
 * Guard that accepts UUID v1–v5 strings (canonical 8-4-4-4-12 hex).
 */
export function isUUID(value: unknown): value is string {
  return typeof value === "string" && uuidRegex.test(value);
}

/**
 * Guard for ISO date strings (YYYY-MM-DD) that parse to a valid calendar date.
 */
export function isISODate(value: unknown): value is string {
  if (typeof value !== "string" || !isoDateRegex.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(value);
}

/**
 * Guard for ISO date-time strings with timezone (YYYY-MM-DDTHH:mm[:ss[.sss]]Z|±HH:mm).
 */
export function isISODateTime(value: unknown): value is string {
  if (typeof value !== "string" || !isoDateTimeRegex.test(value)) {
    return false;
  }
  const parsed = new Date(value);
  return !Number.isNaN(parsed.getTime()) && isISODate(value.slice(0, 10));
}

/**
 * Guard that accepts only finite numbers.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

/**
 * Guard that accepts only finite integers.
 */
export function isInteger(value: unknown): value is number {
  return Number.isInteger(value);
}

/**
 * Guard that accepts only finite numbers (alias of isNumber for clarity).
 */
export function isFiniteNumber(value: unknown): value is number {
  return isNumber(value);
}

/**
 * Checks whether a number is greater than zero.
 */
export function isGreaterThanZero(value: unknown): value is number {
  return isNumber(value) && value > 0;
}

/**
 * Alias for positive numbers (> 0).
 */
export function isPositive(value: unknown): value is number {
  return isGreaterThanZero(value);
}

/**
 * Checks whether a number is strictly negative.
 */
export function isNegative(value: unknown): value is number {
  return isNumber(value) && value < 0;
}

/**
 * Checks whether a number is within a range (inclusive by default).
 */
export function isBetween(value: unknown, min: number, max: number, inclusive = true): value is number {
  return isNumber(value) && (inclusive ? value >= min && value <= max : value > min && value < max);
}

/**
 * Checks whether a number is even (finite integer).
 */
export function isEven(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && value % 2 === 0;
}

/**
 * Checks whether a number is odd (finite integer).
 */
export function isOdd(value: unknown): value is number {
  return isNumber(value) && Number.isInteger(value) && Math.abs(value % 2) === 1;
}

/**
 * Checks whether a number is a multiple of the provided divisor.
 */
export function isMultipleOf(value: unknown, divisor: number): value is number {
  if (divisor === 0 || !Number.isFinite(divisor)) {
    throw new RangeError("isMultipleOf: divisor must be a non-zero finite number");
  }
  return isNumber(value) && value % divisor === 0;
}

/**
 * Checks whether a value is a plain object (and not null or an array).
 */
export function isObject(value: unknown): value is Record<PropertyKey, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isPlainObject<T extends object = Record<string, unknown>>(value: unknown): value is T {
  if (!isObject(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Narrow objects that have no enumerable own keys.
 */
export function isEmptyObject(value: unknown): value is Record<PropertyKey, never> {
  return isPlainObject(value) && Object.keys(value as object).length === 0;
}

/**
 * Guard for arrays that must contain at least a single item.
 */
export function isNonEmptyArray<T>(value: readonly T[] | T[] | unknown): value is readonly [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Checks whether a value is an array (includes readonly tuples).
 */
export function isArray<T = unknown>(value: unknown): value is readonly T[] {
  return Array.isArray(value);
}

/**
 * Guard for arrays that are empty.
 */
export function isEmptyArray(value: unknown): value is readonly [] {
  return Array.isArray(value) && value.length === 0;
}

/**
 * Checks whether value is a Set.
 */
export function isSet<T = unknown>(value: unknown): value is Set<T> {
  return value instanceof Set;
}

/**
 * Checks whether value is a Set with at least one entry.
 */
export function isNonEmptySet<T = unknown>(value: unknown): value is Set<T> {
  return value instanceof Set && value.size > 0;
}

/**
 * Checks whether value is a Set with no entries.
 */
export function isEmptySet(value: unknown): value is Set<never> {
  return value instanceof Set && value.size === 0;
}

/**
 * Checks whether value is a Map.
 */
export function isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V> {
  return value instanceof Map;
}

/**
 * Checks whether value is a Map with at least one entry.
 */
export function isNonEmptyMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V> {
  return value instanceof Map && value.size > 0;
}

/**
 * Checks whether value is a Map with zero entries.
 */
export function isEmptyMap(value: unknown): value is Map<never, never> {
  return value instanceof Map && value.size === 0;
}

/**
 * Guard that asserts value is one of the provided literals.
 */
export function isOneOf<T extends readonly unknown[]>(value: unknown, allowed: T): value is T[number] {
  return allowed.includes(value);
}

/**
 * Narrow objects that contain a given key.
 */
export function hasKey<T extends object, K extends PropertyKey>(value: T, key: K): value is T & Record<K, unknown> {
  return value != null && typeof value === "object" && key in value;
}

/**
 * Performs shallow equality on primitives, arrays, and plain objects.
 */
export function isShallowEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!Object.is(a[i], b[i])) return false;
    }
    return true;
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);
    if (aKeys.length !== bKeys.length) {
      return false;
    }
    return aKeys.every((k) => Object.prototype.hasOwnProperty.call(b, k) && Object.is((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]));
  }
  return false;
}

/**
 * Checks whether the provided value is truthy.
 */
export function isFalse(value: unknown): value is Falsy {
  if (value === false || value === "" || value === null || value === undefined) {
    return true;
  }
  if (typeof value === "number") {
    return value === 0 || Number.isNaN(value) || Object.is(value, -0);
  }
  if (typeof value === "bigint") {
    return value === 0n;
  }
  return false;
}

export function isTrue<T>(value: T): value is Truthy<T> {
  return !isFalse(value);
}

/**
 * Opposite of isDefined — explicitly matches null or undefined.
 */
export function isNothing(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/**
 * Alias for convenience, equivalent to `isDefined`.
 */
export function isSomething<T>(value: T | null | undefined): value is Exclude<T, null | undefined> {
  return isDefined(value);
}

/**
 * Determines if value is strictly null.
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Determines if value is strictly undefined.
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Creates a type guard for discriminated unions by checking a specific tag value.
 */
export function isDiscriminatedUnionMember<
  TUnion extends Record<TKey, PropertyKey>,
  TKey extends keyof TUnion,
  TValue extends Extract<TUnion[TKey], PropertyKey>,
>(value: TUnion | Record<PropertyKey, unknown> | null | undefined, key: TKey, discriminator: TValue): value is Extract<TUnion, Record<TKey, TValue>>;
export function isDiscriminatedUnionMember(value: unknown, key: PropertyKey, discriminator: PropertyKey): boolean;
export function isDiscriminatedUnionMember(value: unknown, key: PropertyKey, discriminator: PropertyKey): boolean {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (value as Record<PropertyKey, unknown>)[key] === discriminator;
}

/**
 * Creates a lightweight branding helper that marks values and provides a guard for the brand.
 */
export function createBrand<Token extends string | symbol>() {
  const marker = Symbol("brand");

  function brand<Value>(value: Value): Opaque<Value, Token> {
    if (value === null || value === undefined) {
      throw new TypeError("createBrand: cannot brand null or undefined");
    }
    if (typeof value === "object" || typeof value === "function") {
      const obj = value as Record<PropertyKey, unknown>;
      if (!Object.prototype.hasOwnProperty.call(obj, marker)) {
        Object.defineProperty(obj, marker, { value: true, enumerable: false });
      }
      return value as Opaque<Value, Token>;
    }
    const boxed = Object(value) as Record<PropertyKey, unknown>;
    Object.defineProperty(boxed, marker, { value: true, enumerable: false });
    return boxed as unknown as Opaque<Value, Token>;
  }

  function isBrand<Value>(value: unknown): value is Opaque<Value, Token> {
    return typeof value === "object" && value !== null && Boolean((value as Record<PropertyKey, unknown>)[marker]);
  }

  return { brand, isBrand };
}
