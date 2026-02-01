/**
 * Type-safe comparison utilities for sorting.
 */

export type Comparator<T> = (a: T, b: T) => number;

/**
 * Creates a comparator based on a property selector or a key.
 * 
 * @example
 * const compareUsers = createComparator<{ age: number }>((u) => u.age);
 * users.sort(compareUsers);
 */
export function createComparator<T, V = any>(
    selector: (item: T) => V,
    order: 'asc' | 'desc' = 'asc'
): Comparator<T> {
    return (a: T, b: T) => {
        const valA = selector(a);
        const valB = selector(b);

        if (valA === valB) return 0;

        const result = valA < valB ? -1 : 1;
        return order === 'asc' ? result : -result;
    };
}

/**
 * Combines multiple comparators into one. If the first comparator returns 0,
 * the second one is used, and so on.
 * 
 * @example
 * const sortByNameAndAge = chainComparators(
 *   createComparator<User>(u => u.name),
 *   createComparator<User>(u => u.age)
 * );
 */
export function chainComparators<T>(...comparators: Comparator<T>[]): Comparator<T> {
    return (a: T, b: T) => {
        for (const compare of comparators) {
            const result = compare(a, b);
            if (result !== 0) return result;
        }
        return 0;
    };
}

/**
 * Inverts the order of a given comparator.
 * 
 * @example
 * const descSort = reverseComparator(createComparator(u => u.id));
 */
export function reverseComparator<T>(comparator: Comparator<T>): Comparator<T> {
    return (a: T, b: T) => -comparator(a, b);
}
