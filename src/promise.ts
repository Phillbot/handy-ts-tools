/**
 * Promise helpers.
 */

/**
 * Creates a lazily resolved promise and exposes resolve/reject hooks.
 * 
 * @example
 * const { promise, resolve } = createDeferred<number>();
 * resolve(42);
 * await promise; // 42
 */
export function createDeferred<T = void>() {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

/**
 * Returns a promise that resolves after the given milliseconds.
 * 
 * @example
 * await sleep(100);
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps a promise with a timeout. Rejects if the promise doesn't 
 * resolve within the specified limit.
 * 
 * @example
 * await timeout(fetch('/api'), 1000);
 */
export async function timeout<T>(promise: Promise<T>, ms: number, message = 'Operation timed out'): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    clearTimeout(timer);
  }
}
