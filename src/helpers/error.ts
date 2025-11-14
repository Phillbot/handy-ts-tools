/**
 * Error helpers.
 */

/**
 * Checks if the value resembles an Error object.
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
 */
export function wrapError<T extends (...args: any[]) => any>(fn: T, message: string): T {
  const wrapped = (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (isErrorLike(error)) {
        error.message = `${message}: ${error.message}`;
        throw error;
      }
      throw new Error(`${message}: ${String(error)}`);
    }
  }) as T;

  return wrapped;
}

export interface RetryOptions {
  retries?: number;
  delayMs?: number;
  shouldRetry?(error: unknown, attempt: number): boolean;
}

/**
 * Retries an async operation with optional delay and predicate hooks.
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
  throw new Error("retry: unreachable");
}
