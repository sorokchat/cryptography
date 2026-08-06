import { type BinaryTree } from "./binary-tree.interface";
import { type Node } from "./node";

export class LeftBalancedBinaryTree<T> implements BinaryTree<T> {
  private root: Node<T> | null = null;
  private readonly map: Map<number, Node<T>> = new Map();
  private nextId: number = 1;

  public getRoot(): Node<T> | null {
    return this.root;
  }

  public getNode(id: number): Node<T> | null {
    return this.map.get(id) ?? null;
  }

  public find(predicate: (data: T) => boolean): Node<T> | null {
    return this.findRecursive(this.root, predicate);
  }

  public getPathToRoot(leaf: Node<T>): Node<T>[] {
    const path: Node<T>[] = [];
    let current: Node<T> | null = leaf;
    while (current) {
      path.push(current);
      current = current.parent ?? null;
    }
    return path;
  }

  public getSharedAncestor(
    firstLeaf: Node<T>,
    secondLeaf: Node<T>,
  ): Node<T> | null {
    const pathFirst = this.getPathToRoot(firstLeaf);
    const pathSecond = this.getPathToRoot(secondLeaf);
    const setFirst = new Set(pathFirst);
    for (const node of pathSecond) {
      if (setFirst.has(node)) return node;
    }
    return null;
  }

  public getParent(node: Node<T>): Node<T> | null {
    return node.parent ?? null;
  }

  public getChildren(node: Node<T>): {
    left?: Node<T> | undefined;
    right?: Node<T> | undefined;
  } {
    return { left: node.left, right: node.right };
  }

  public inorder(callback: (data: T) => void): void {
    return this.inorderRecursive(this.root, callback);
  }

  public preorder(callback: (data: T) => void): void {
    this.preorderRecusive(this.root, callback);
  }

  public postorder(callback: (data: T) => void): void {
    this.postorderRecursive(this.root, callback);
  }

  public setRoot(data: T): void {
    this.root = null;
    this.map.clear();
    this.nextId = 1;
    const rootNode: Node<T> = {
      id: this.nextId++,
      data,
      isLeaf: true,
    };
    this.root = rootNode;
    this.map.set(rootNode.id, rootNode);
  }

  public removeNode(id: number): void {
    const node = this.map.get(id);
    if (!node) throw new Error(`Node with id ${id} not found`);

    if (!node.isLeaf) {
      throw new Error(
        `Cannot remove internal node with id ${id}. Only leaves can be removed.`,
      );
    }

    const parent = node.parent;
    if (parent) {
      if (parent.left === node) {
        parent.left = undefined;
      } else if (parent.right === node) {
        parent.right = undefined;
      }
      if (!parent.left && !parent.right) {
        parent.isLeaf = true;
      }
    } else {
      this.root = null;
    }

    this.map.delete(id);
  }

  public updateNode(id: number, newData: T): void {
    const node = this.map.get(id);
    if (!node) throw new Error(`Node with id ${id} not found`);
    node.data = newData;
  }

  public size(): number {
    return this.map.size;
  }

  public addLeaf(data: T): void {
    if (!this.root) {
      const newNode: Node<T> = { id: this.nextId++, data, isLeaf: true };
      this.root = newNode;
      this.map.set(newNode.id, newNode);
      return;
    }

    const queue: Node<T>[] = [this.root];
    while (queue.length > 0) {
      const node = queue.shift()!;
      if (!node.left) {
        const newNode: Node<T> = {
          id: this.nextId++,
          data,
          parent: node,
          isLeaf: true,
        };
        node.left = newNode;
        node.isLeaf = false;
        this.map.set(newNode.id, newNode);
        return;
      }
      if (!node.right) {
        const newNode: Node<T> = {
          id: this.nextId++,
          data,
          parent: node,
          isLeaf: true,
        };
        node.right = newNode;
        node.isLeaf = false;
        this.map.set(newNode.id, newNode);
        return;
      }
      queue.push(node.left);
      queue.push(node.right);
    }
    throw new Error("Unexpected: no free slot found");
  }

  public height(): number {
    return this.heightRecursive(this.root);
  }

  public isBalanced(): boolean {
    return this.isBalancedRecursive(this.root);
  }

  public isEmpty(): boolean {
    return this.root === null;
  }

  public clone(): BinaryTree<T> {
    const newTree: BinaryTree<T> = new LeftBalancedBinaryTree<T>();
    if (!this.root) return newTree;
    const list: T[] = [];
    this.inorder((data) => {
      list.push(data);
    });
    for (const item of list) {
      newTree.addLeaf(item);
    }
    return newTree;
  }

  public toArray(): T[] {
    const result: T[] = [];
    this.inorder((data: T) => result.push(data));
    return result;
  }

  *[Symbol.iterator](): Iterator<T> {
    const stack: Node<T>[] = [];
    let current = this.root;
    while (stack.length > 0 || current) {
      while (current) {
        stack.push(current);
        current = current.left ?? null;
      }
      current = stack.pop()!;
      yield current.data;
      current = current.right ?? null;
    }
  }
  private findRecursive(
    node: Node<T> | null | undefined,
    predicate: (data: T) => boolean,
  ): Node<T> | null {
    if (!node) return null;
    if (predicate(node.data)) return node;
    const left = this.findRecursive(node.left, predicate);
    return left ?? this.findRecursive(node.right, predicate);
  }

  private inorderRecursive(
    node: Node<T> | null | undefined,
    callback: (data: T) => void,
  ): void {
    if (!node) return;
    this.inorderRecursive(node.left, callback);
    callback(node.data);
    this.inorderRecursive(node.right, callback);
  }

  private preorderRecusive(
    node: Node<T> | null | undefined,
    callback: (data: T) => void,
  ): void {
    if (!node) return;
    callback(node.data);
    this.preorderRecusive(node.left, callback);
    this.preorderRecusive(node.right, callback);
  }

  private postorderRecursive(
    node: Node<T> | null | undefined,
    callback: (data: T) => void,
  ): void {
    if (!node) return;
    this.postorderRecursive(node.left, callback);
    this.postorderRecursive(node.right, callback);
    callback(node.data);
  }

  private heightRecursive(node: Node<T> | null | undefined): number {
    if (!node) return 0;
    return (
      1 +
      Math.max(
        this.heightRecursive(node.left),
        this.heightRecursive(node.right),
      )
    );
  }

  private isBalancedRecursive(node: Node<T> | null | undefined): boolean {
    if (!node) return true;
    const leftHeight = this.heightRecursive(node.left);
    const rightHeight = this.heightRecursive(node.right);
    if (Math.abs(leftHeight - rightHeight) > 1) return false;
    return (
      this.isBalancedRecursive(node.left) &&
      this.isBalancedRecursive(node.right)
    );
  }
}
