/**
 * Functional helpers that are not tied to a specific domain.
 */

/**
 * Returns the provided value. Useful as a default transform or placeholder resolver.
 * 
 * @example
 * [1, 2].map(identity) // [1, 2]
 */
export const identity = <T>(value: T): T => value;

/**
 * A function that does nothing. Handy as a default callback or placeholder dependency.
 * 
 * @example
 * const onClick = noop;
 */
export const noop = (): void => { };

/**
 * Pipes a value through a list of unary functions from left to right.
 * 
 * @example
 * const val = pipe(10, (x) => x * 2, (x) => x + 1); // 21
 */
export function pipe<T>(value: T): T;
export function pipe<T, A>(value: T, fn1: (input: T) => A): A;
export function pipe<T, A, B>(value: T, fn1: (input: T) => A, fn2: (input: A) => B): B;
export function pipe<T, A, B, C>(
  value: T,
  fn1: (input: T) => A,
  fn2: (input: A) => B,
  fn3: (input: B) => C,
): C;
export function pipe<T, A, B, C, D>(
  value: T,
  fn1: (input: T) => A,
  fn2: (input: A) => B,
  fn3: (input: B) => C,
  fn4: (input: C) => D,
): D;
export function pipe<T>(value: T, ...fns: Array<(input: unknown) => unknown>): unknown {
  return fns.reduce<unknown>((acc, fn) => fn(acc), value);
}

/**
 * Composes functions from right to left.
 * 
 * @example
 * const fn = compose((x: number) => x + 1, (x: number) => x * 2);
 * fn(10) // 21
 */
export function compose<T>(): (value: T) => T;
export function compose<T, A>(fn1: (input: T) => A): (value: T) => A;
export function compose<T, A, B>(fn1: (input: A) => B, fn2: (input: T) => A): (value: T) => B;
export function compose<T, A, B, C>(
  fn1: (input: B) => C,
  fn2: (input: A) => B,
  fn3: (input: T) => A,
): (value: T) => C;
export function compose<T, A, B, C, D>(
  fn1: (input: C) => D,
  fn2: (input: B) => C,
  fn3: (input: A) => B,
  fn4: (input: T) => A,
): (value: T) => D;
export function compose<T>(...fns: Array<(input: unknown) => unknown>) {
  return (value: T): unknown => fns.reduceRight<unknown>((acc, fn) => fn(acc), value);
}

/**
 * Restricts a number to stay within the provided range.
 * 
 * @example
 * clamp(10, 0, 5) // 5
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new RangeError("clamp: min cannot be greater than max");
  }

  return Math.min(Math.max(value, min), max);
}

/**
 * Wraps a function so it can only run once.
 * 
 * @example
 * const init = once(() => console.log('init'));
 * init(); // logs 'init'
 * init(); // nothing
 */
export function once<Args extends unknown[], R>(fn: (...args: Args) => R): (...args: Args) => R {
  let called = false;
  let result: R;
  return (...args: Args): R => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result!;
  };
}

/**
 * Memoizes a function using optional resolver for cache keys.
 * 
 * @example
 * const slow = (n: number) => n * 2;
 * const memo = memoize(slow);
 */
export function memoize<Args extends unknown[], R>(
  fn: (...args: Args) => R,
  resolver?: (...args: Args) => unknown,
): (...args: Args) => R {
  const cache = new Map<unknown, R>();
  return (...args: Args): R => {
    const key = resolver ? resolver(...args) : args[0];
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    const value = fn(...args);
    cache.set(key, value);
    return value;
  };
}
