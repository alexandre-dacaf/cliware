/**
 * Debounce a function by delaying its execution until after a specified delay
 * has elapsed since the last time it was invoked.
 *
 * @param func - The function to debounce.
 * @param delay - The delay in milliseconds.
 * @returns A debounced version of the provided function.
 */
export function debounce<Args extends any[]>(
    func: (...args: Args) => void,
    delay: number
): (...args: Args) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    return function (...args: Args) {
        if (timeoutId !== null) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func(...args);
            timeoutId = null;
        }, delay);
    };
}

/**
 * Throttle a function by ensuring it is only called at most once every
 * specified interval.
 *
 * @param func - The function to throttle.
 * @param limit - The interval in milliseconds.
 * @returns A throttled version of the provided function.
 */
export function throttle<Args extends any[]>(
    func: (...args: Args) => void,
    limit: number
): (...args: Args) => void {
    let lastFunc: ReturnType<typeof setTimeout> | null = null;
    let lastRan: number | null = null;

    return function (this: unknown, ...args: Args) {
        const context = this;
        const now = Date.now();

        if (!lastRan) {
            func.apply(context, args);
            lastRan = now;
        } else {
            if (lastFunc) {
                clearTimeout(lastFunc);
            }
            lastFunc = setTimeout(function () {
                if (Date.now() - (lastRan as number) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (now - (lastRan as number)));
        }
    };
}

/**
 * Memoize a function by caching its results based on the arguments provided.
 *
 * @param func - The function to memoize.
 * @returns A memoized version of the provided function.
 */
export function memoize<Args extends any[], Return>(
    func: (...args: Args) => Return
): (...args: Args) => Return {
    const cache = new Map<string, Return>();

    return function (...args: Args): Return {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key) as Return;
        }
        const result = func(...args);
        cache.set(key, result);
        return result;
    };
}

/**
 * Compose multiple functions into a single function, executing them from right to left.
 *
 * @param funcs - The functions to compose.
 * @returns A function obtained by composing the argument functions from right to left.
 */
export function compose<T>(...funcs: Function[]): (arg: T) => T {
    return (arg: T) => funcs.reduceRight((acc, fn) => fn(acc), arg);
}

/**
 * Pipe multiple functions into a single function, executing them from left to right.
 *
 * @param funcs - The functions to pipe.
 * @returns A function obtained by piping the argument functions from left to right.
 */
export function pipe<T>(...funcs: Function[]): (arg: T) => T {
    return (arg: T) => funcs.reduce((acc, fn) => fn(acc), arg);
}

/**
 * Create a logging decorator for a function to log its execution and arguments.
 *
 * @param func - The function to decorate.
 * @returns A decorated function that logs its execution.
 */
export function withLogging<Args extends any[]>(
    func: (...args: Args) => void
): (...args: Args) => void {
    return function (this: unknown, ...args: Args) {
        console.log(`Executing ${func.name} with arguments:`, args);
        func.apply(this, args);
    };
}
