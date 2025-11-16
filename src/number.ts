/**
 * Number helpers.
 */

/**
 * Rounds a number to the provided precision.
 */
export function roundTo(value: number, precision = 0): number {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

/**
 * Checks whether the value lies within the provided range.
 */
export function inRange(value: number, min: number, max: number, inclusive = true): boolean {
  if (min > max) {
    throw new RangeError("inRange: min cannot be greater than max");
  }
  return inclusive ? value >= min && value <= max : value > min && value < max;
}

/**
 * Converts a part/whole pair into a percentage.
 */
export function toPercent(part: number, whole: number, precision = 2): number {
  if (whole === 0) {
    throw new RangeError("toPercent: whole cannot be 0");
  }
  return roundTo((part / whole) * 100, precision);
}
