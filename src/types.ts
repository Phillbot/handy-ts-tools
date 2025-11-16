/**
 * Type-level utilities for composing safer APIs.
 */

/**
 * Extracts values of an object type.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Requires at least one of the provided keys to be present.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
  ? Pick<T, Exclude<keyof T, Keys>> & Required<Pick<T, Keys>>
  : never;

/**
 * Deeply marks every property as readonly.
 */
export type DeepReadonly<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends readonly unknown[]
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T extends object
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T;

/**
 * Ensures two types match exactly (no extra keys permitted).
 */
export type Exact<T, Shape> = T extends Shape ? (Shape extends T ? T : never) : never;

/**
 * Converts a union into an intersection.
 */
export type UnionToIntersection<T> = (T extends T ? (x: T) => void : never) extends (x: infer R) => void ? R : never;

/** Convenience alias for nullable/undefined. */
export type Nullish = null | undefined;

/** Marks value as optional (null or undefined). */
export type Maybe<T> = T | Nullish;

/** Values treated as falsy in JavaScript. */
export type Falsy = false | 0 | -0 | 0n | "" | null | undefined;

/** Removes falsy values from union. */
export type Truthy<T> = T extends Falsy ? never : T;

/** Tuple with at least one element. */
export type NonEmptyArray<T> = readonly [T, ...T[]];

/** Strips readonly modifiers. */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/** Recursively marks every field as required. */
export type DeepRequired<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;
