import { describe, expect, it } from "vitest";
import { chainComparators, createComparator, reverseComparator } from "../src/comparators.js";

describe("comparator helpers", () => {
    interface User {
        id: number;
        name: string;
        age: number;
    }

    const users: User[] = [
        { id: 1, name: "Alice", age: 30 },
        { id: 2, name: "Bob", age: 25 },
        { id: 3, name: "Alice", age: 20 },
    ];

    it("creates simple comparators", () => {
        const byAge = createComparator<User>((u) => u.age);
        const sorted = [...users].sort(byAge);
        expect(sorted[0].id).toBe(3); // Alice (20)
        expect(sorted[2].id).toBe(1); // Alice (30)
    });

    it("supports descending order", () => {
        const byAgeDesc = createComparator<User>((u) => u.age, "desc");
        const sorted = [...users].sort(byAgeDesc);
        expect(sorted[0].id).toBe(1); // Alice (30)
        expect(sorted[2].id).toBe(3); // Alice (20)
    });

    it("chains multiple comparators", () => {
        const byNameThenAge = chainComparators(
            createComparator<User>((u) => u.name),
            createComparator<User>((u) => u.age)
        );
        const sorted = [...users].sort(byNameThenAge);
        expect(sorted[0].id).toBe(3); // Alice (20)
        expect(sorted[1].id).toBe(1); // Alice (30)
        expect(sorted[2].id).toBe(2); // Bob (25)
    });

    it("reverses comparators", () => {
        const byAge = createComparator<User>((u) => u.age);
        const byAgeDesc = reverseComparator(byAge);
        const sorted = [...users].sort(byAgeDesc);
        expect(sorted[0].id).toBe(1);
        expect(sorted[2].id).toBe(3);
    });

    it("chainComparators: returns 0 if all equal", () => {
        const compare = chainComparators(
            createComparator<User>(u => u.name),
            createComparator<User>(u => u.age)
        );
        expect(compare(users[0], users[0])).toBe(0);
    });
});
