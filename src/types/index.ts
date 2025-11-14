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
export type Exact<T, Shape extends T> = T & Record<Exclude<keyof T, keyof Shape>, never>;

/**
 * Converts a union into an intersection.
 */
export type UnionToIntersection<T> = (T extends T ? (x: T) => void : never) extends (x: infer R) => void ? R : never;
