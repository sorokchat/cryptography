export const Equals = {
  LESS: -1,
  EQUAL: 0,
  MORE: 1,
} as const;

export type Equals = (typeof Equals)[keyof typeof Equals];

export type Comparator<K, T extends K> = (data: T, key: K) => Equals;

export abstract class BinaryTree<K, T extends K> {
  constructor(public readonly comparator: Comparator<K, T>) {}

  public abstract insert(data: T): void;

  public abstract find(key: K): T | null;

  public abstract update(key: K, newData: T): boolean;

  public abstract delete(key: K): boolean;

  public abstract height(key?: K): number;

  public abstract min(): T | null;

  public abstract max(): T | null;

  public abstract contains(key: K): boolean;

  public abstract isBalanced(): boolean;

  public abstract balance(): void;

  public abstract size(): number;

  public abstract clear(): void;

  public abstract forEach(callback: (data: T) => void): void;

  public abstract toArray(): T[];

  public abstract fromArray(array: T[]): void;

  public abstract clone(): BinaryTree<K, T>;
}
