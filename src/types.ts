/**
 * Type-level utilities for composing safer APIs.
 */

/**
 * Extracts values of an object type.
 * 
 * @example
 * type User = { id: number; name: string };
 * type Values = ValueOf<User>; // number | string
 */
export type ValueOf<T> = T[keyof T];

/**
 * Requires at least one of the provided keys to be present.
 * 
 * @example
 * type Options = RequireAtLeastOne<{ a?: string; b?: number }, 'a' | 'b'>;
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Keys extends keyof T
  ? Pick<T, Exclude<keyof T, Keys>> & Required<Pick<T, Keys>>
  : never;

/**
 * Deeply marks every property as readonly.
 * 
 * @example
 * type ReadonlyUser = DeepReadonly<{ profile: { name: string } }>;
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
 * 
 * @example
 * type Strict = Exact<{ a: 1 }, { a: 1 }>;
 */
export type Exact<T, Shape> = T extends Shape ? (Shape extends T ? T : never) : never;

/**
 * Converts a union into an intersection.
 * 
 * @example
 * type Combined = UnionToIntersection<{ a: 1 } | { b: 2 }>; // { a: 1 } & { b: 2 }
 */
export type UnionToIntersection<T> = (T extends T ? (x: T) => void : never) extends (x: infer R) => void ? R : never;

/** Convenience alias for nullable/undefined. */
export type Nullish = null | undefined;

/**
 * Marks value as optional (null or undefined).
 * 
 * @example
 * type MaybeString = Maybe<string>; // string | null | undefined
 */
export type Maybe<T> = T | Nullish;

/** Values treated as falsy in JavaScript. */
export type Falsy = false | 0 | -0 | 0n | "" | null | undefined;

/**
 * Removes falsy values from union.
 * 
 * @example
 * type Active = Truthy<string | null>; // string
 */
export type Truthy<T> = T extends Falsy ? never : T;

/**
 * Tuple with at least one element.
 * 
 * @example
 * type Items = NonEmptyArray<number>;
 */
export type NonEmptyArray<T> = readonly [T, ...T[]];

/**
 * Readonly Record alias for constrained keys/values.
 * 
 * @example
 * type Config = ReadonlyRecord<string, number>;
 */
export type ReadonlyRecord<K extends PropertyKey, V> = Readonly<Record<K, V>>;

/** Non-empty Set shape (size > 0 at runtime). */
export type NonEmptySet<T> = ReadonlySet<T> & { readonly size: number };

/** Non-empty Map shape (size > 0 at runtime). */
export type NonEmptyMap<K, V> = ReadonlyMap<K, V> & { readonly size: number };

/** Strips readonly modifiers. */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/** Alias for removing readonly (inverse of Readonly). */
export type Writable<T> = Mutable<T>;

/** Recursively makes every property optional. */
export type DeepPartial<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

/** Recursively marks every field as required. */
export type DeepRequired<T> = T extends (...args: unknown[]) => unknown
  ? T
  : T extends object
  ? { [K in keyof T]-?: DeepRequired<T[K]> }
  : T;

/**
 * Opaque/brand type to prevent mixing structurally-identical values.
 * 
 * @example
 * type UserId = Opaque<string, 'UserId'>;
 */
export type Opaque<Type, Token extends string | symbol> = Type & { readonly __brand: Token };
