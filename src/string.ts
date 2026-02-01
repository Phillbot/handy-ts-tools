/**
 * String helpers.
 */

/**
 * Ensures a string starts with the provided prefix.
 * 
 * @example
 * ensurePrefix('foo', 'pre-') // 'pre-foo'
 */
export function ensurePrefix(value: string, prefix: string): string {
  return value.startsWith(prefix) ? value : `${prefix}${value}`;
}

/**
 * Ensures a string ends with the provided suffix.
 * 
 * @example
 * ensureSuffix('foo', '-post') // 'foo-post'
 */
export function ensureSuffix(value: string, suffix: string): string {
  return value.endsWith(suffix) ? value : `${value}${suffix}`;
}

/**
 * Capitalizes the first character of the string.
 * 
 * @example
 * capitalize('hello') // 'Hello'
 */
export function capitalize(value: string): string {
  if (!value) {
    return value;
  }
  return value[0].toUpperCase() + value.slice(1);
}

/**
 * Truncates the string to a certain length and adds an ellipsis if needed.
 * 
 * @example
 * truncate('hello world', 5) // 'he...'
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

/**
 * Splits a string into words accounting for casing and separators.
 */
function splitWords(value: string): string[] {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_\-\s]+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);
}

/**
 * Converts text to camelCase (`handy_ts-tools` -> `handyTsTools`).
 * 
 * @example
 * camelCase('handy_ts-tools') // 'handyTsTools'
 */
export function camelCase(value: string): string {
  const words = splitWords(value.toLowerCase());
  if (words.length === 0) {
    return "";
  }
  return words[0] + words.slice(1).map((word) => capitalize(word)).join("");
}

/**
 * Converts text to kebab-case.
 * 
 * @example
 * kebabCase('handyTsTools') // 'handy-ts-tools'
 */
export function kebabCase(value: string): string {
  return splitWords(value).map((word) => word.toLowerCase()).join("-");
}

/**
 * Converts text to snake_case.
 * 
 * @example
 * snakeCase('handyTsTools') // 'handy_ts_tools'
 */
export function snakeCase(value: string): string {
  return splitWords(value).map((word) => word.toLowerCase()).join("_");
}

/**
 * Converts text to Title Case.
 * 
 * @example
 * titleCase('hello-world') // 'Hello World'
 */
export function titleCase(value: string): string {
  return splitWords(value)
    .map((word) => capitalize(word.toLowerCase()))
    .join(" ");
}
