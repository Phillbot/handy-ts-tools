/**
 * Error helpers.
 */

/**
 * Checks if the value resembles an Error object.
 * 
 * @example
 * isErrorLike(new Error('foo')) // true
 * isErrorLike({ message: 'bar' }) // false (missing name)
 */
export function isErrorLike(value: unknown): value is Error {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "message" in value &&
    typeof (value as { message: unknown }).message === "string"
  );
}

/**
 * Wraps a synchronous or async function and makes sure thrown errors contain the provided message.
 * 
 * @example
 * const safeFetch = wrapError(fetch, 'Fetch failed');
 */
export function wrapError<Args extends unknown[], R>(
  fn: (...args: Args) => R | Promise<R>,
  message: string,
): (...args: Args) => Promise<R> {
  return async (...args: Args): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (isErrorLike(error)) {
        error.message = `${message}: ${error.message}`;
        throw error;
      }
      throw new Error(`${message}: ${String(error)}`);
    }
  };
}

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  shouldRetry?(error: unknown, attempt: number): boolean;
}

/**
 * Retries an async operation with optional delay and predicate hooks.
 * 
 * @example
 * await retry(() => doWork(), { retries: 3, delayMs: 100 })
 */
export async function retry<T>(operation: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const { retries = 3, delayMs = 0, shouldRetry } = options;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      const canRetry = attempt < retries && (!shouldRetry || shouldRetry(error, attempt));
      if (!canRetry) {
        throw error;
      }

      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  // This line is never reached, but TypeScript needs a return.
  /* v8 ignore next 2 */
  throw new Error("retry: unreachable");
}
