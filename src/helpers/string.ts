/**
 * String helpers.
 */

/**
 * Ensures a string starts with the provided prefix.
 */
export function ensurePrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value : `${prefix}${value}`;
}

/**
 * Ensures a string ends with the provided suffix.
 */
export function ensureSuffix(value: string, suffix: string): string {
  return value.endsWith(suffix) ? value : `${value}${suffix}`;
}

/**
 * Capitalizes the first character of the string.
 */
export function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1);
}

/**
 * Truncates the string to a certain length and adds an ellipsis if needed.
 */
export function truncate(value: string, maxLength: number, ellipsis = "..."): string {
  if (maxLength < 0) {
    throw new RangeError("truncate: maxLength must be >= 0");
  }

  if (value.length <= maxLength) {
    return value;
  }

  if (maxLength === 0) {
    return "";
  }

  if (maxLength <= ellipsis.length) {
    return ellipsis.slice(0, maxLength);
  }

  return `${value.slice(0, maxLength - ellipsis.length)}${ellipsis}`;
}
