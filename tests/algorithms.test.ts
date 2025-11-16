import { describe, expect, it } from "vitest";
import {
  PriorityQueue,
  UnionFind,
  bfs,
  binarySearch,
  bubbleSort,
  combinations,
  dfs,
  dijkstra,
  kSmallest,
  mergeSort,
  permutations,
  quickSelect,
  summarize,
  topologicalSort,
  traverseTree,
  type TreeNode,
  uniqueBy,
} from "../src/algorithms.js";

describe("algorithms helpers", () => {
  it("runs binary search over sorted values", () => {
    const arr = [1, 3, 5, 7, 9];
    const compare = (a: number, b: number) => a - b;
    expect(binarySearch(arr, 5, compare)).toBe(2);
    expect(binarySearch(arr, 4, compare)).toBe(-1);
  });

  it("deduplicates by selector", () => {
    const items = [
      { id: 1, value: "a" },
      { id: 1, value: "b" },
      { id: 2, value: "c" },
    ];
    expect(uniqueBy(items, (item) => item.id)).toEqual([
      { id: 1, value: "a" },
      { id: 2, value: "c" },
    ]);
  });

  it("topologically sorts DAGs", () => {
    const nodes = ["a", "b", "c", "d"];
    const edges: Array<[string, string]> = [
      ["a", "b"],
      ["b", "c"],
      ["a", "d"],
    ];
    const order = topologicalSort(nodes, edges);
    expect(order.indexOf("a")).toBeLessThan(order.indexOf("b"));
    expect(order.indexOf("b")).toBeLessThan(order.indexOf("c"));
  });

  it("runs bfs/dfs and quickSelect", () => {
    const graph = new Map<string, string[]>([
      ["a", ["b", "c"]],
      ["b", ["d"]],
      ["c", []],
      ["d", []],
    ]);
    expect(bfs(graph, "a")).toEqual(["a", "b", "c", "d"]);
    expect(dfs(graph, "a")).toEqual(["a", "b", "d", "c"]);

    expect(quickSelect([9, 1, 5, 3], 1, (a, b) => a - b)).toBe(3);
    expect(kSmallest([9, 1, 5, 3], 2, (a, b) => a - b)).toEqual([1, 3]);
    expect(mergeSort([3, 1, 2], (a, b) => a - b)).toEqual([1, 2, 3]);
    expect(bubbleSort([3, 2, 1], (a, b) => a - b)).toEqual([1, 2, 3]);

    const sum = summarize([1, 2, 3, 4]);
    expect(sum).toMatchObject({ min: 1, max: 4, mean: 2.5, median: 2.5, count: 4 });

    const nodes: TreeNode<string> = { value: "root", children: [{ value: "a" }, { value: "b" }] };
    const visited: string[] = [];
    traverseTree(nodes, (node) => visited.push(node.value));
    expect(visited).toEqual(["root", "a", "b"]);

    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.push(5);
    pq.push(1);
    pq.push(3);
    expect([pq.pop(), pq.pop(), pq.pop()]).toEqual([1, 3, 5]);
    expect(pq.pop()).toBeUndefined();
    expect(pq.peek()).toBeUndefined();
    expect(pq.size).toBe(0);

    const uf = new UnionFind<number>();
    uf.union(1, 2);
    expect(uf.find(1)).toBe(uf.find(2));
    expect(uf.find(3)).not.toBe(uf.find(1));
    uf.union(2, 3);
    expect(uf.find(1)).toBe(uf.find(3));

    const weighted = new Map<string, Array<[string, number]>>([
      ["a", [["b", 1]]],
      ["b", [["c", 2]]],
      ["c", []],
    ]);
    expect(dijkstra(weighted, "a").get("c")).toBe(3);
    const cyclic = new Map<string, Array<[string, number]>>([
      ["a", [["a", 0]]],
      ["b", []],
    ]);
    expect(dijkstra(cyclic, "a").get("a")).toBe(0);
    expect(dijkstra(cyclic, "b").get("a")).toBeUndefined();

    expect(combinations([1, 2, 3], 2)).toEqual([
      [1, 2],
      [1, 3],
      [2, 3],
    ]);
    expect(permutations([1, 2, 3]).length).toBe(6);
    expect(combinations([1, 2], 0)).toEqual([[]]);
    expect(combinations([1, 2], 5)).toEqual([]);
    expect(permutations([])).toEqual([[]]);
    expect(mergeSort([], (a, b) => a - b)).toEqual([]);
    expect(bubbleSort([1], (a, b) => a - b)).toEqual([1]);

    expect(bfs(new Map<string, string[]>(), "missing")).toEqual(["missing"]);
    expect(dfs(new Map<string, string[]>(), "missing")).toEqual(["missing"]);
  });
});
