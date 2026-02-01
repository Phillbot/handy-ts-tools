/**
 * Asynchronous execution control utilities.
 */

/**
 * Creates a debounced version of a function that delays execution until after
 * `waitMs` milliseconds have elapsed since the last time it was invoked.
 * 
 * @example
 * const log = debounce(() => console.log('hi'), 100);
 * log(); log(); // only one 'hi' after 100ms
 */
export function debounce<Args extends any[], R>(
    fn: (...args: Args) => R,
    waitMs: number
): (...args: Args) => void {
    let timeoutId: any;

    return (...args: Args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
            timeoutId = undefined;
        }, waitMs);
    };
}

/**
 * Creates a throttled version of a function that only triggers at most once 
 * per `limitMs` milliseconds.
 * 
 * @example
 * const log = throttle(() => console.log('hi'), 100);
 * log(); log(); // 'hi' prints immediately, subsequent calls ignored for 100ms
 */
export function throttle<Args extends any[], R>(
    fn: (...args: Args) => R,
    limitMs: number
): (...args: Args) => void {
    let lastRun = 0;
    let timeoutId: any;

    return (...args: Args) => {
        const now = Date.now();
        const remaining = limitMs - (now - lastRun);

        if (remaining <= 0 || remaining > limitMs) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
            lastRun = now;
            fn(...args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastRun = Date.now();
                timeoutId = undefined;
                fn(...args);
            }, remaining);
        }
    };
}
