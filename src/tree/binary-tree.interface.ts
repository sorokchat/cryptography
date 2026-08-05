import { type Node } from "./node";

export interface BinaryTree<T> {
  getRoot(): Node<T> | null;
  getNode(id: number): Node<T> | null;
  find(predicate: (data: T) => boolean): Node<T> | null;
  getPathToRoot(leaf: Node<T>): Node<T>[];
  getSharedAncestor(firstLeaf: Node<T>, secondLeaf: Node<T>): Node<T> | null;
  getParent(node: Node<T>): Node<T> | null;
  getChildren(node: Node<T>): { left?: Node<T>; right?: Node<T> };
  inorder(callback: (data: T) => void): void;
  preorder(callback: (data: T) => void): void;
  postorder(callback: (data: T) => void): void;
  [Symbol.iterator](): Iterator<T>;
  setRoot(data: T): void;
  addLeaf(data: T): void;
  removeNode(id: number): void;
  updateNode(id: number, newData: T): void;
  size(): number;
  height(): number;
  isBalanced(): boolean;
  isEmpty(): boolean;
  clone(): BinaryTree<T>;
  toArray(): T[];
}
