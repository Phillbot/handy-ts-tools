import { describe, expect, it } from "vitest";
import {
  bfs,
  binarySearch,
  bubbleSort,
  combinations,
  dfs,
  dijkstra,
  kSmallest,
  mergeSort,
  permutations,
  PriorityQueue,
  quickSelect,
  summarize,
  topologicalSort,
  traverseTree,
  uniqueBy,
  UnionFind,
} from "../src/algorithms.js";

describe("algorithms", () => {
  it("binarySearch: finds elements", () => {
    const arr = [1, 2, 3, 4, 5];
    const comp = (a: number, b: number) => a - b;
    expect(binarySearch(arr, 3, comp)).toBe(2);
    expect(binarySearch(arr, 1, comp)).toBe(0); // left side
    expect(binarySearch(arr, 6, comp)).toBe(-1);
  });

  it("uniqueBy: removes duplicates", () => {
    const data = [{ id: 1 }, { id: 2 }, { id: 1 }];
    expect(uniqueBy(data, (x: any) => x.id)).toHaveLength(2);
  });

  it("topologicalSort: performs sort", () => {
    const nodes = [1, 2, 3];
    const edges: [number, number][] = [[1, 2], [2, 3]];
    expect(topologicalSort(nodes, edges)).toEqual([1, 2, 3]);
  });

  it("topologicalSort: adds nodes and edges dynamically", () => {
    expect(topologicalSort([], [[1, 2]])).toEqual([1, 2]);
  });

  it("topologicalSort: throws on cycle", () => {
    expect(() => topologicalSort([1, 2], [[1, 2], [2, 1]])).toThrow("topologicalSort: graph has cycles");
  });

  it("bfs and dfs: traverse graphs", () => {
    const graph = new Map([
      [1, [2, 3]],
      [2, [4]],
      [3, [4]],
      [4, []],
    ]);
    expect(bfs(graph, 1)).toEqual([1, 2, 3, 4]);
    expect(dfs(graph, 1)).toEqual([1, 2, 4, 3]);

    expect(bfs(new Map<string, string[]>(), "missing")).toEqual(["missing"]);
    expect(dfs(new Map<string, string[]>(), "missing")).toEqual(["missing"]);
  });

  it("quickSelect: finds k-th element", () => {
    const arr = [3, 1, 2, 5, 4];
    const comp = (a: number, b: number) => a - b;
    expect(quickSelect([...arr], 0, comp)).toBe(1);
    expect(quickSelect([...arr], 2, comp)).toBe(3);
    expect(quickSelect([...arr], 4, comp)).toBe(5);
  });

  it("quickSelect: throws on k out of range", () => {
    expect(() => quickSelect([1, 2], -1, (a, b) => a - b)).toThrow(RangeError);
    expect(() => quickSelect([1, 2], 3, (a, b) => a - b)).toThrow(RangeError);
  });

  it("mergeSort and bubbleSort: sort arrays", () => {
    const arr = [3, 1, 2];
    const comp = (a: number, b: number) => a - b;
    expect(mergeSort(arr, comp)).toEqual([1, 2, 3]);
    expect(bubbleSort(arr, comp)).toEqual([1, 2, 3]);
  });

  it("mergeSort: handles short arrays", () => {
    const comp = (a: number, b: number) => a - b;
    expect(mergeSort([1], comp)).toEqual([1]);
    expect(mergeSort([], comp)).toEqual([]);
  });

  it("kSmallest: returns leading elements", () => {
    const arr = [3, 1, 2, 5, 4];
    const comp = (a: number, b: number) => a - b;
    expect(kSmallest(arr, 2, comp)).toEqual([1, 2]);
    expect(kSmallest(arr, 0, comp)).toEqual([]);
    expect(kSmallest(arr, 10, comp)).toEqual([1, 2, 3, 4, 5]);
  });

  it("traverseTree: visits nodes", () => {
    const tree = { value: 1, children: [{ value: 2 }, { value: 3 }] };
    const visited: number[] = [];
    traverseTree(tree, (n) => visited.push(n.value));
    expect(visited).toEqual([1, 2, 3]);
  });

  it("summarize: computes stats", () => {
    const data = [1, 2, 3, 4, 5];
    const stats = summarize(data);
    expect(stats.min).toBe(1);
    expect(stats.max).toBe(5);
    expect(stats.mean).toBe(3);
    expect(stats.median).toBe(3);
    expect(stats.sum).toBe(15);
  });

  it("summarize: throws on empty values", () => {
    expect(() => summarize([])).toThrow("summarize: no values provided");
  });

  it("PriorityQueue: manages priorities", () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.push(10);
    pq.push(5);
    pq.push(15);
    expect(pq.size).toBe(3);
    expect(pq.peek()).toBe(5);
    expect(pq.pop()).toBe(5);
    expect(pq.pop()).toBe(10);
    expect(pq.pop()).toBe(15);
    expect(pq.pop()).toBeUndefined();

    const pq2 = new PriorityQueue<number>((a, b) => a - b);
    [5, 10, 3, 15, 12].forEach(n => pq2.push(n));
    expect(pq2.pop()).toBe(3);
    expect(pq2.pop()).toBe(5);
  });

  it("UnionFind: tracks disjoint sets", () => {
    const uf = new UnionFind<number>();
    uf.union(1, 2);
    uf.union(3, 4);
    expect(uf.find(1)).toBe(uf.find(2));
    expect(uf.find(1)).not.toBe(uf.find(3));
    uf.union(1, 3);
    expect(uf.find(1)).toBe(uf.find(4));

    // Path compression
    uf.union(4, 5);
    uf.union(5, 6);
    expect(uf.find(1)).toBe(uf.find(6));
    expect(uf.find(1)).toBe(uf.find(6)); // second find uses compressed path
  });

  it("dijkstra: finds shortest paths", () => {
    const graph = new Map<number, [number, number][]>([
      [1, [[2, 1], [3, 4]]],
      [2, [[3, 2]]],
      [3, []],
    ]);
    const dists = dijkstra(graph, 1);
    expect(dists.get(1)).toBe(0);
    expect(dists.get(2)).toBe(1);
    expect(dists.get(3)).toBe(3);
  });

  it("combinations and permutations: generate sets", () => {
    expect(combinations([1, 2, 3], 2)).toHaveLength(3);
    expect(combinations([1, 2], 3)).toEqual([]);
    expect(permutations([1, 2])).toHaveLength(2);
  });
});
