/**
 * Finds index of target in sorted array using comparator.
 * Complexity: O(log n)
 */
export function binarySearch<T>(items: readonly T[], target: T, comparator: (a: T, b: T) => number): number {
  let left = 0;
  let right = items.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const compare = comparator(items[mid], target);
    if (compare === 0) {
      return mid;
    }
    if (compare < 0) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

/**
 * Removes duplicates by projecting each item to a key.
 * Complexity: O(n)
 */
export function uniqueBy<T, K>(items: Iterable<T>, selector: (item: T) => K): T[] {
  const seen = new Set<K>();
  const result: T[] = [];
  for (const item of items) {
    const key = selector(item);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
    }
  }
  return result;
}

/**
 * Performs Kahn's topological sort. Throws if a cycle is detected.
 * Complexity: O(V + E)
 */
export function topologicalSort<T>(nodes: Iterable<T>, edges: Iterable<[T, T]>): T[] {
  const graph = new Map<T, Set<T>>();
  const inDegree = new Map<T, number>();
  for (const node of nodes) {
    graph.set(node, new Set());
    inDegree.set(node, 0);
  }
  for (const [from, to] of edges) {
    if (!graph.has(from)) {
      graph.set(from, new Set());
      inDegree.set(from, 0);
    }
    if (!graph.has(to)) {
      graph.set(to, new Set());
      inDegree.set(to, 0);
    }
    if (!graph.get(from)!.has(to)) {
      graph.get(from)!.add(to);
      inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
    }
  }
  const queue: T[] = [];
  for (const [node, degree] of inDegree) {
    if (degree === 0) {
      queue.push(node);
    }
  }
  const result: T[] = [];
  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
      inDegree.set(neighbor, nextDegree);
      if (nextDegree === 0) {
        queue.push(neighbor);
      }
    }
  }
  if (result.length !== graph.size) {
    throw new Error("topologicalSort: graph has cycles");
  }
  return result;
}

/**
 * Breadth-first search yielding nodes in discovery order.
 * Complexity: O(V + E)
 */
export function bfs<T>(graph: Map<T, Iterable<T>>, start: T): T[] {
  const visited = new Set<T>();
  const queue: T[] = [start];
  const order: T[] = [];
  while (queue.length) {
    const node = queue.shift()!;
    if (visited.has(node)) continue;
    visited.add(node);
    order.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
  return order;
}

/**
 * Depth-first search yielding nodes in visitation order.
 * Complexity: O(V + E)
 */
export function dfs<T>(graph: Map<T, Iterable<T>>, start: T): T[] {
  const visited = new Set<T>();
  const order: T[] = [];
  (function visit(node: T) {
    if (visited.has(node)) return;
    visited.add(node);
    order.push(node);
    for (const neighbor of graph.get(node) ?? []) {
      visit(neighbor);
    }
  })(start);
  return order;
}

/**
 * Selects k-th smallest element without full sorting.
 * Average complexity: O(n)
 */
export function quickSelect<T>(items: T[], k: number, comparator: (a: T, b: T) => number): T {
  if (k < 0 || k >= items.length) {
    throw new RangeError("quickSelect: k out of range");
  }
  const arr = items;
  let left = 0;
  let right = arr.length - 1;
  while (left <= right) {
    const pivotIndex = partition(left, right, Math.floor((left + right) / 2));
    if (pivotIndex === k) {
      return arr[pivotIndex];
    }
    if (pivotIndex < k) {
      left = pivotIndex + 1;
    } else {
      right = pivotIndex - 1;
    }
  }
  return arr[k];

  function partition(lo: number, hi: number, pivotIndex: number): number {
    const pivotValue = arr[pivotIndex];
    [arr[pivotIndex], arr[hi]] = [arr[hi], arr[pivotIndex]];
    let storeIndex = lo;
    for (let i = lo; i < hi; i++) {
      if (comparator(arr[i], pivotValue) < 0) {
        [arr[storeIndex], arr[i]] = [arr[i], arr[storeIndex]];
        storeIndex += 1;
      }
    }
    [arr[hi], arr[storeIndex]] = [arr[storeIndex], arr[hi]];
    return storeIndex;
  }
}

/**
 * Stable merge sort using scratch buffer.
 * Complexity: O(n log n)
 */
export function mergeSort<T>(items: readonly T[], comparator: (a: T, b: T) => number): T[] {
  if (items.length <= 1) return copyArray(items);
  const arr = copyArray(items);
  const buffer = new Array<T>(arr.length);
  splitMerge(arr, buffer, 0, arr.length, comparator);
  return arr;
}

function splitMerge<T>(arr: T[], buffer: T[], start: number, end: number, comparator: (a: T, b: T) => number) {
  if (end - start <= 1) {
    return;
  }
  const mid = Math.floor((start + end) / 2);
  splitMerge(arr, buffer, start, mid, comparator);
  splitMerge(arr, buffer, mid, end, comparator);
  merge(arr, buffer, start, mid, end, comparator);
}

function merge<T>(
  arr: T[],
  buffer: T[],
  start: number,
  mid: number,
  end: number,
  comparator: (a: T, b: T) => number,
) {
  let i = start;
  let j = mid;
  let k = start;
  while (i < mid && j < end) {
    if (comparator(arr[i], arr[j]) <= 0) {
      buffer[k++] = arr[i++];
    } else {
      buffer[k++] = arr[j++];
    }
  }
  while (i < mid) {
    buffer[k++] = arr[i++];
  }
  while (j < end) {
    buffer[k++] = arr[j++];
  }
  for (let idx = start; idx < end; idx++) {
    arr[idx] = buffer[idx];
  }
}

/**
 * Returns the k smallest values using quickselect partitioning.
 * Complexity: O(n) average
 */
export function kSmallest<T>(items: readonly T[], k: number, comparator: (a: T, b: T) => number): T[] {
  if (k <= 0) return [];
  const arr = copyArray(items);
  if (k >= arr.length) {
    return mergeSort(arr, comparator);
  }
  quickSelect(arr, k - 1, comparator);
  const subset = new Array<T>(k);
  for (let i = 0; i < k; i++) {
    subset[i] = arr[i];
  }
  return mergeSort(subset, comparator);
}

/**
 * Basic tree node structure for algorithms.
 */
export interface TreeNode<T> {
  value: T;
  children?: TreeNode<T>[];
}

/**
 * Performs a DFS traversal on a tree structure.
 * Complexity: O(V)
 */
export function traverseTree<T>(root: TreeNode<T>, visitor: (node: TreeNode<T>) => void): void {
  visitor(root);
  for (const child of root.children ?? []) {
    traverseTree(child, visitor);
  }
}

/**
 * Computes mean/median/min/max from numeric iterable.
 * Complexity: O(n log n) due to sorting for median.
 */
export function summarize(values: Iterable<number>) {
  const arr: number[] = [];
  for (const value of values) {
    arr.push(value);
  }
  if (arr.length === 0) {
    throw new Error("summarize: no values provided");
  }
  let sum = 0;
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const value of arr) {
    sum += value;
    if (value < min) min = value;
    if (value > max) max = value;
  }
  const sorted = mergeSort(arr, (a, b) => a - b);
  const mean = sum / arr.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return { min, max, mean, median, sum, count: arr.length };
}

function copyArray<T>(items: readonly T[]): T[] {
  const arr = new Array<T>(items.length);
  for (let i = 0; i < items.length; i++) {
    arr[i] = items[i];
  }
  return arr;
}

/**
 * Min-heap backed priority queue.
 * push/pop complexity: O(log n)
 */
export class PriorityQueue<T> {
  private heap: T[] = [];

  constructor(private comparator: (a: T, b: T) => number) { }

  push(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.bubbleDown(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  get size(): number {
    return this.heap.length;
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.comparator(this.heap[index], this.heap[parent]) >= 0) {
        break;
      }
      [this.heap[index], this.heap[parent]] = [this.heap[parent], this.heap[index]];
      index = parent;
    }
  }

  private bubbleDown(index: number) {
    const length = this.heap.length;
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;
      if (left < length && this.comparator(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < length && this.comparator(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }
      if (smallest === index) {
        break;
      }
      [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }
}

/**
 * Union-find (disjoint set) structure with path compression/rank.
 * find/union amortized complexity: ~O(α(n))
 */
export class UnionFind<T> {
  private parent = new Map<T, T>();
  private rank = new Map<T, number>();

  find(value: T): T {
    if (!this.parent.has(value)) {
      this.parent.set(value, value);
      this.rank.set(value, 0);
      return value;
    }
    const parent = this.parent.get(value)!;
    if (parent !== value) {
      this.parent.set(value, this.find(parent));
    }
    return this.parent.get(value)!;
  }

  union(a: T, b: T): void {
    const rootA = this.find(a);
    const rootB = this.find(b);
    if (rootA === rootB) return;
    const rankA = this.rank.get(rootA)!;
    const rankB = this.rank.get(rootB)!;
    if (rankA < rankB) {
      this.parent.set(rootA, rootB);
    } else if (rankA > rankB) {
      this.parent.set(rootB, rootA);
    } else {
      this.parent.set(rootB, rootA);
      this.rank.set(rootA, rankA + 1);
    }
  }
}

/**
 * Dijkstra shortest path for weighted graphs.
 * Complexity: O(E log V)
 */
export function dijkstra<T>(graph: Map<T, Array<[T, number]>>, start: T): Map<T, number> {
  const distances = new Map<T, number>();
  const pq = new PriorityQueue<[T, number]>((a, b) => a[1] - b[1]);
  distances.set(start, 0);
  pq.push([start, 0]);
  while (pq.size > 0) {
    const [node, dist] = pq.pop()!;
    if (dist > (distances.get(node) ?? Infinity)) continue;
    for (const [neighbor, weight] of graph.get(node) ?? []) {
      const nextDist = dist + weight;
      if (nextDist < (distances.get(neighbor) ?? Infinity)) {
        distances.set(neighbor, nextDist);
        pq.push([neighbor, nextDist]);
      }
    }
  }
  return distances;
}

/**
 * Generates all k-combinations without recursion.
 * Complexity: O(C(n, k))
 */
export function combinations<T>(items: readonly T[], k: number): T[][] {
  if (k <= 0) return [[]];
  if (k > items.length) return [];
  const result: T[][] = [];
  const indices = Array.from({ length: k }, (_, i) => i);
  while (true) {
    result.push(indices.map((index) => items[index]));
    let i = k - 1;
    while (i >= 0 && indices[i] === items.length - k + i) {
      i -= 1;
    }
    if (i < 0) break;
    indices[i] += 1;
    for (let j = i + 1; j < k; j++) {
      indices[j] = indices[j - 1] + 1;
    }
  }
  return result;
}

/**
 * Generates all permutations using Heap's algorithm.
 * Complexity: O(n!)
 */
export function permutations<T>(items: readonly T[]): T[][] {
  const arr = copyArray(items);
  const c = new Array(arr.length).fill(0);
  const result: T[][] = [arr.slice()];
  let i = 0;
  while (i < arr.length) {
    if (c[i] < i) {
      if (i % 2 === 0) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
      } else {
        [arr[c[i]], arr[i]] = [arr[i], arr[c[i]]];
      }
      result.push(arr.slice());
      c[i] += 1;
      i = 0;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
  return result;
}

/**
 * Bubble sort for educational purposes.
 * Complexity: O(n^2)
 */
export function bubbleSort<T>(items: readonly T[], comparator: (a: T, b: T) => number): T[] {
  const arr = copyArray(items);
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (comparator(arr[j], arr[j + 1]) > 0) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break;
  }
  return arr;
}
