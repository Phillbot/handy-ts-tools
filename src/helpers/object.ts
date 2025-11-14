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
