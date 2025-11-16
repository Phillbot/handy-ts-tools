/**
 * Object-specific helpers.
 */

/**
 * Picks the provided keys from the source object.
 */
export function pick<T extends object, K extends readonly (keyof T)[]>(source: T, keys: K): Pick<T, K[number]> {
  const result: Partial<T> = {};
  for (const key of keys) {
    if (key in source) {
      result[key] = source[key];
    }
  }
  return result as Pick<T, K[number]>;
}

/**
 * Ensures the provided value is a Set (reuses the instance when possible).
 */
export function ensureSet<T>(value: Iterable<T> | Set<T>): Set<T> {
  return value instanceof Set ? value : new Set(value);
}

/**
 * Ensures the provided value is a Map (reuses the instance when possible).
 */
export function ensureMap<K, V>(value: Iterable<readonly [K, V]> | Map<K, V>): Map<K, V> {
  return value instanceof Map ? value : new Map(value);
}

/**
 * Creates a shallow copy without specified keys.
 */
export function omit<T extends object, K extends readonly (keyof T)[]>(source: T, keys: K): Omit<T, K[number]> {
  const result: Partial<T> = {};
  const skip = new Set<keyof T>(keys as readonly string[] as (keyof T)[]);
  for (const key in source) {
    if (!skip.has(key as keyof T)) {
      result[key as keyof T] = source[key];
    }
  }
  return result as Omit<T, K[number]>;
}

/**
 * Shallowly merges multiple objects (later sources override earlier keys).
 */
export function merge<T extends object, U extends object>(target: T, ...sources: U[]): T & U {
  return Object.assign({}, target, ...sources) as T & U;
}

/**
 * Traverses `path` safely, returning `undefined` for missing nodes.
 */
export function deepGet<T extends object, R = unknown>(source: T, path: readonly (keyof any)[]): R | undefined {
  let current: unknown = source;
  for (const key of path) {
    if (current == null) {
      return undefined;
    }
    current = (current as Record<PropertyKey, unknown>)[key];
  }
  return current as R | undefined;
}

/**
 * Writes value at the nested path, creating intermediate objects as needed.
 */
export function deepSet<T extends object, V>(source: T, path: readonly (keyof any)[], value: V): T {
  if (path.length === 0) {
    throw new Error("deepSet: path must not be empty");
  }
  let current: unknown = source;
  path.slice(0, -1).forEach((key) => {
    const bucket = current as Record<PropertyKey, unknown>;
    if (bucket[key] === undefined || bucket[key] === null) {
      bucket[key] = {};
    }
    current = bucket[key];
  });
  (current as Record<PropertyKey, unknown>)[path[path.length - 1]] = value;
  return source;
}
