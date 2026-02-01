/**
 * Number helpers.
 */

/**
 * Rounds a number to the provided precision.
 * 
 * @example
 * roundTo(3.14159, 2) // 3.14
 */
export function roundTo(value: number, precision = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/**
 * Checks whether the value lies within the provided range.
 * 
 * @example
 * inRange(5, 0, 10) // true
 */
export function inRange(value: number, min: number, max: number, inclusive = true): boolean {
  if (min > max) {
    throw new RangeError("inRange: min cannot be greater than max");
  }
  return inclusive ? value >= min && value <= max : value > min && value < max;
}

/**
 * Converts a part/whole pair into a percentage.
 * 
 * @example
 * toPercent(1, 4) // 25
 */
export function toPercent(part: number, whole: number, precision = 2): number {
  if (whole === 0) {
    throw new RangeError("toPercent: whole cannot be 0");
  }
  return roundTo((part / whole) * 100, precision);
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * 
 * @example
 * randomInt(1, 10) // 7
 */
export function randomInt(min: number, max: number): number {
  if (min > max) {
    throw new RangeError("randomInt: min cannot be greater than max");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Linearly interpolates between two values based on t (0..1).
 * 
 * @example
 * lerp(0, 100, 0.5) // 50
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Normalizes a value from range [min..max] into range [0..1].
 * 
 * @example
 * normalize(50, 0, 100) // 0.5
 */
export function normalize(value: number, min: number, max: number): number {
  if (min === max) return 0;
  return (value - min) / (max - min);
}
