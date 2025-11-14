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
export function isPlainObject<T extends object = Record<string, unknown>>(value: unknown): value is T {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Guard for arrays that must contain at least a single item.
 */
export function isNonEmptyArray<T>(value: readonly T[] | T[] | unknown): value is readonly [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Guard that asserts value is one of the provided literals.
 */
export function isOneOf<T extends readonly unknown[]>(value: unknown, allowed: T): value is T[number] {
  return allowed.includes(value);
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
