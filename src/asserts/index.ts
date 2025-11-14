/**
 * Runtime assertion helpers. They throw typed errors so callers can signal invalid states immediately.
 */

export class AssertionError extends Error {
  constructor(message?: string) {
    super(message ?? "Assertion failed");
    this.name = "AssertionError";
  }
}

/**
 * Minimal assertion helper that narrows `condition` within the current scope.
 */
export function assert(condition: unknown, message?: string): asserts condition {
  if (!condition) {
    throw new AssertionError(message);
  }
}

/**
 * Ensures a value is defined (non-nullish) and returns it to avoid re-checking.
 */
export function assertDefined<T>(value: T | null | undefined, message?: string): T {
  if (value === null || value === undefined) {
    throw new AssertionError(message ?? "Expected value to be defined");
  }

  return value;
}

/**
 * Helper for exhaustive switch statements.
 */
export function assertNever(value: never, message?: string): never {
  throw new AssertionError(message ?? `Unexpected value: ${String(value)}`);
}
