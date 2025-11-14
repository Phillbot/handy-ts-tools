/**
 * Core helpers that are not tied to a specific domain.
 */

/**
 * Returns the provided value. Useful as a default transform or placeholder resolver.
 */
export const identity = <T>(value: T): T => value;

/**
 * A function that does nothing. Handy as a default callback or placeholder dependency.
 */
export const noop = (): void => {};

/**
 * Pipes a value through a list of unary functions from left to right.
 */
export function pipe<T>(value: T, ...fns: Array<(input: any) => any>): unknown {
  return fns.reduce<unknown>((acc, fn) => fn(acc), value);
}

/**
 * Restricts a number to stay within the provided range.
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError("clamp: min cannot be greater than max");
  }

  return Math.min(Math.max(value, min), max);
}
