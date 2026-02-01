/**
 * Platform and environment detection guards.
 */

/**
 * Checks if the code is running in a browser environment.
 * 
 * @example
 * if (isBrowser()) {
 *   console.log(window.location.href);
 * }
 */
export function isBrowser(): boolean {
    return typeof window !== "undefined" && typeof window.document !== "undefined";
}

/**
 * Checks if the code is running in a Node.js environment.
 * 
 * @example
 * if (isNode()) {
 *   console.log(process.version);
 * }
 */
export function isNode(): boolean {
    return typeof process !== "undefined" && process.versions?.node !== undefined;
}

/**
 * Checks if the device supports touch events.
 * 
 * @example
 * if (isTouchDevice()) {
 *   // enable touch-specific UI
 * }
 */
export function isTouchDevice(): boolean {
    return isBrowser() && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
}
