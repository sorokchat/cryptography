import { BinaryTree, Equals, type Comparator } from "./binary-tree.abstract";

export class LeftBalancedBinaryTree<K, T extends K> extends BinaryTree<K, T> {
  private array: T[];

  constructor(comparator: Comparator<K, T>) {
    super(comparator);
    this.array = [];
  }

  public insert(data: T): void {
    this.array[this.array.length] = this.copyItem(data);
    this.siftUp(this.array.length - 1);
  }

  public find(key: K): T | null {
    const founded = this.array.find(
      (item) => this.comparator(item, key) === Equals.EQUAL,
    );
    if (founded) return this.copyItem(founded);
    return null;
  }

  public update(key: K, newData: T): boolean {
    const index: number = this.array.findIndex(
      (item) => this.comparator(item, key) === Equals.EQUAL,
    );
    if (index === -1) return false;
    this.array[index] = this.copyItem(newData);
    this.siftUp(index);
    this.siftDown(index);
    return true;
  }

  public delete(key: K): boolean {
    const index: number = this.array.findIndex(
      (item) => this.comparator(item, key) === Equals.EQUAL,
    );
    if (index === -1) return false;
    const lastIndex: number = this.array.length - 1;
    if (index < lastIndex) {
      this.array[index] = this.array[lastIndex];
      this.array.pop();
      this.siftUp(index);
      this.siftDown(index);
    } else {
      this.array.pop();
    }
    return true;
  }

  public height(key?: K | undefined): number {
    if (this.array.length === 0) return 0;
    if (!key) return Math.floor(Math.log2(this.array.length)) + 1;
    const index = this.array.findIndex(
      (item) => this.comparator(item, key) === Equals.EQUAL,
    );
    if (index === -1) return 0;
    return this.subtreeHeight(index);
  }

  public min(): T | null {
    if (this.array.length === 0) return null;
    return this.copyItem(
      this.array.reduce((best, current) =>
        this.comparator(current, best) === Equals.LESS ? current : best,
      ),
    );
  }

  public max(): T | null {
    if (this.array.length === 0) return null;
    return this.copyItem(
      this.array.reduce((best, current) =>
        this.comparator(current, best) === Equals.MORE ? current : best,
      ),
    );
  }

  public contains(key: K): boolean {
    return this.array.some(
      (item: T) => this.comparator(item, key) === Equals.EQUAL,
    );
  }

  public isBalanced(): boolean {
    if (this.array.length <= 1) return true;
    const lastParentIndex = Math.floor(this.array.length / 2) - 1;
    for (let index = 0; index <= lastParentIndex; index++) {
      const leftChild: number = 2 * index + 1;
      const rightChild: number = 2 * index + 2;
      if (
        leftChild < this.array.length &&
        this.comparator(this.array[leftChild], this.array[index]) ===
          Equals.LESS
      ) {
        return false;
      }
      if (
        rightChild < this.array.length &&
        this.comparator(this.array[rightChild], this.array[index]) ===
          Equals.LESS
      ) {
        return false;
      }
    }
    return true;
  }

  public balance(): void {
    const lastParentIndex: number = Math.floor(this.array.length / 2) - 1;
    for (let index = lastParentIndex; index >= 0; index--) {
      this.siftDown(index);
    }
  }

  public size(): number {
    return this.array.length;
  }

  public clear(): void {
    this.array = [];
  }

  public forEach(callback: (data: T) => void): void {
    this.array.forEach((item) => callback(item));
  }

  public toArray(): T[] {
    return [...this.array];
  }

  public fromArray(array: T[]): void {
    this.array = [...array];
    this.balance();
  }

  public clone(): BinaryTree<K, T> {
    const tree = new LeftBalancedBinaryTree<K, T>(this.comparator);
    for (const item of this.array) {
      tree.insert(item);
    }
    return tree;
  }

  private siftUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (
        this.comparator(this.array[index], this.array[parentIndex]) ===
        Equals.LESS
      ) {
        this.swap(index, parentIndex);
        index = parentIndex;
      } else {
        break;
      }
    }
  }

  private siftDown(index: number): void {
    const length = this.array.length;
    while (true) {
      let bestIndex: number = index;
      const leftChild: number = 2 * index + 1;
      const rightChild: number = 2 * index + 2;
      if (
        leftChild < length &&
        this.comparator(this.array[leftChild], this.array[bestIndex]) ===
          Equals.LESS
      ) {
        bestIndex = leftChild;
      }
      if (
        rightChild < length &&
        this.comparator(this.array[rightChild], this.array[bestIndex]) ===
          Equals.LESS
      ) {
        bestIndex = rightChild;
      }
      if (bestIndex !== index) {
        this.swap(index, bestIndex);
        index = bestIndex;
      } else {
        break;
      }
    }
  }

  private swap(firstIndex: number, secondIndex: number): void {
    const temporary = this.array[firstIndex];
    this.array[firstIndex] = this.array[secondIndex];
    this.array[secondIndex] = temporary;
  }

  private subtreeHeight(index: number): number {
    let height: number = 0;
    let currentLeftMost: number = index;
    const length = this.array.length;
    while (currentLeftMost < length) {
      height++;
      currentLeftMost = 2 * currentLeftMost + 1;
    }
    return height;
  }

  private copyItem(item: T): T {
    return typeof item === "object" && item !== null ? { ...item } : item;
  }
}
