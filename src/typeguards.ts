import type { Falsy, Truthy } from "./types.js";

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
 * Guard that accepts only finite numbers.
 */
export function isNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
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
>(value: TUnion | Record<PropertyKey, unknown> | null | undefined, key: TKey, discriminator: TValue): value is Extract<TUnion, Record<TKey, TValue>> {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  return (value as Record<PropertyKey, unknown>)[key] === discriminator;
}
