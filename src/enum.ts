/**
 * Helpers for working with TypeScript enums or enum-like records.
 */

export interface ParseEnumOptions<T> {
  caseInsensitive?: boolean;
  fallback?: T;
}

/**
 * Attempts to convert an unknown input into one of the enum values. Returns `undefined`
 * (or provided fallback) when no match is found.
 */
export function parseEnumValue<
  TEnum extends Record<string, string | number>,
  TValue extends TEnum[keyof TEnum] = TEnum[keyof TEnum],
>(
  enumObject: TEnum,
  input: unknown,
  options: ParseEnumOptions<TValue> = {},
): TValue | undefined {
  const { caseInsensitive = false, fallback } = options;
  const values = collectEnumValues(enumObject);

  const equals = (a: string, b: string) => (caseInsensitive ? a.toLowerCase() === b.toLowerCase() : a === b);

  if (typeof input === "string") {
    for (const value of values) {
      if (typeof value === "string" && equals(value, input)) {
        return value as TValue;
      }
      if (typeof value === "number" && equals(String(value), input)) {
        return value as TValue;
      }
    }

    for (const key of Object.keys(enumObject)) {
      if (!Number.isNaN(Number(key))) {
        continue;
      }
      if (equals(key, input)) {
        return enumObject[key as keyof TEnum] as TValue;
      }
    }
  }

  if (typeof input === "number") {
    for (const value of values) {
      if (typeof value === "number" && value === input) {
        return value as TValue;
      }
    }
  }

  return fallback;
}

function collectEnumValues<TEnum extends Record<string, string | number>>(enumObject: TEnum) {
  const result = new Set<TEnum[keyof TEnum]>();
  for (const key of Object.keys(enumObject)) {
    if (!Number.isNaN(Number(key))) {
      // skip reverse numeric mappings
      continue;
    }
    const value = enumObject[key as keyof TEnum];
    if (typeof value === "string" || typeof value === "number") {
      result.add(value as TEnum[keyof TEnum]);
    }
  }
  return Array.from(result);
}
