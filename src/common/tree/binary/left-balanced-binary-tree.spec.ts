import { describe, it, beforeEach, expect } from "@jest/globals";
import { type BinaryTree } from "./binary-tree.interface";
import { LeftBalancedBinaryTree } from "./left-balanced-binary-tree";

describe("Left balanced binary tree", () => {
  let tree: BinaryTree<number>;

  beforeEach(() => {
    tree = new LeftBalancedBinaryTree<number>();
  });

  it("should be empty initially", async () => {
    expect(tree.isEmpty()).toBeTruthy();
    expect(tree.size()).toBe(0);
    expect(tree.getRoot()).toBeNull();
    expect(tree.height()).toBe(0);
    expect(tree.isBalanced()).toBeTruthy();
  });

  it("setRoot should replace tree with single node", () => {
    const digit: number = 45;
    tree.setRoot(digit);
    expect(tree.isEmpty()).toBeFalsy();
    expect(tree.size()).toBe(1);
    expect(tree.getRoot()?.data).toBe(digit);
    expect(tree.getRoot()?.isLeaf).toBeTruthy();
  });

  describe("addLeaf", () => {
    it("should add laves and maintain left-balanced structure", () => {
      const values: number[] = [1, 2, 3, 4, 5, 6, 7];
      const expectedHeight: number = 3;
      values.forEach((value) => tree.addLeaf(value));
      expect(tree.size()).toBe(values.length);
      expect(tree.isBalanced()).toBeTruthy();
      expect(tree.height()).toBe(expectedHeight);
      const inorderData = tree.toArray();
      expect(new Set(inorderData)).toEqual(new Set(values));
      const root = tree.getRoot();
      expect(root?.isLeaf).toBeFalsy();
      expect(root?.left?.isLeaf).toBeFalsy();
      expect(root?.right?.isLeaf).toBeFalsy();
      expect(root?.left?.left?.isLeaf).toBeTruthy();
      expect(root?.left?.right?.isLeaf).toBeTruthy();
      expect(root?.right?.left?.isLeaf).toBeTruthy();
      expect(root?.right?.right?.isLeaf).toBeTruthy();
    });

    it("should add leaf to empty tree", () => {
      const digit: number = 100;
      tree.addLeaf(digit);
      expect(tree.size()).toBe(1);
      expect(tree.getRoot()?.data).toBe(digit);
      expect(tree.getRoot()?.isLeaf).toBeTruthy();
    });

    it("should maintain left-balanced property after many additions", () => {
      const count: number = 20;
      for (let index = 0; index < count; index++) {
        tree.addLeaf(index + 1);
        expect(tree.isBalanced()).toBeTruthy();
        expect(tree.size()).toBe(index + 1);
      }
    });
  });

  it("getNode shuld return node by id", () => {
    const digit: number = 10;
    tree.setRoot(digit);
    const root = tree.getRoot()!;
    expect(tree.getNode(root.id)).toBe(root);
    expect(tree.getNode(1000)).toBeNull();
  });

  it("find should return first node by predicate", () => {
    const numbers: number[] = [5, 3, 8, 1, 4];
    numbers.forEach((number) => tree.addLeaf(number));
    const expectedItem: number = 3;
    const found = tree.find((data) => data === expectedItem);
    expect(found?.data).toBe(expectedItem);
    expect(tree.find((data) => data === 999)).toBeNull();
  });

  it("getPathToRoot shuld return path from leaf to root", () => {
    const numbers: number[] = [1, 2, 3, 4, 5];

    numbers.forEach((value) => tree.addLeaf(value));
    const leaf = tree.find((data) => data === 4)!;
    const path = tree.getPathToRoot(leaf);
    expect(path.length).toBeGreaterThanOrEqual(2);
    expect(path[0].data).toBe(4);
    expect(path[path.length - 1].data).toBe(1);
  });

  it("getSharedAncestor should return nearest common ancestor", () => {
    const numbers: number[] = [1, 2, 3, 4, 5, 6, 7];
    numbers.forEach((value) => tree.addLeaf(value));
    const first = tree.find((data) => data === 4)!;
    const second = tree.find((data) => data === 5)!;
    const ancestor = tree.getSharedAncestor(first, second);
    expect(ancestor).not.toBeNull();
    expect(ancestor?.data).toBe(2);
  });

  it("getParrent and getChildren should return correct nodes", () => {
    const numbers: number[] = [1, 2, 3];
    numbers.forEach((value) => tree.addLeaf(value));
    const root = tree.getRoot()!;
    expect(tree.getParent(root)).toBeNull();
    const leftChield = root.left!;
    expect(tree.getParent(leftChield)).toBe(root);
    expect(tree.getChildren(root)).toEqual({
      left: leftChield,
      right: root.right,
    });
  });

  describe("tree travercal", () => {
    const values: number[] = [1, 2, 3, 4, 5, 6, 7];
    beforeEach(() => values.forEach((value) => tree.addLeaf(value)));

    it("inorder should visit nodes in ascending order", () => {
      const result: number[] = [];
      tree.inorder((value) => result.push(value));
      expect(new Set(result)).toEqual(new Set(values));
    });

    it("preorder should visit root, left, right", () => {
      const result: number[] = [];
      tree.preorder((value) => result.push(value));
      expect(new Set(result)).toEqual(new Set(values));
    });

    it("postorder should visit left, right, root", () => {
      const result: number[] = [];
      tree.postorder((value) => result.push(value));
      expect(new Set(result)).toEqual(new Set([4, 5, 2, 6, 7, 3, 1]));
    });

    it("iterator should produce inorder sequence", () => {
      const result = [...tree];
      expect(new Set(result)).toEqual(new Set(values));
    });
  });

  describe("removeNode", () => {
    it("should remove leaf and update parent", () => {
      const numbers: number[] = [1, 2, 3];
      numbers.forEach((value) => tree.addLeaf(value));
      const leaf = tree.find((data) => data === 3)!;
      tree.removeNode(leaf.id);
      expect(tree.size()).toBe(2);
      expect(tree.getNode(leaf.id)).toBeNull();
      const root = tree.getRoot();
      expect(root?.isLeaf).toBeFalsy();
      expect(root?.left).toBeDefined();
      expect(root?.right).toBeUndefined();
    });

    it("should make parent leaf if it loses both children", () => {
      const numbers: number[] = [1, 2, 3, 4];
      numbers.forEach((value) => tree.addLeaf(value));
      const first = tree.find((data) => data === 3)!;
      const second = tree.find((data) => data === 4)!;
      tree.removeNode(first.id);
      tree.removeNode(second.id);
      const parent = tree.find((data) => data === 2);
      expect(parent?.isLeaf).toBeTruthy();
    });

    it("should remove root when it is the only one node", () => {
      const number: number = 42;
      tree.setRoot(number);
      const rootId = tree.getRoot()!.id;
      tree.removeNode(rootId);
      expect(tree.isEmpty()).toBeTruthy();
      expect(tree.size()).toBe(0);
    });

    it("should throw error when trying remove internal node", () => {
      [1, 2, 3].forEach((value) => tree.addLeaf(value));
      const internal = tree.getRoot()!;
      expect(() => tree.removeNode(internal.id)).toThrow(
        `Cannot remove internal node with id ${internal.id}. Only leaves can be removed.`,
      );
    });

    it("should throw when node not found", () => {
      const id: number = 999;
      expect(() => tree.removeNode(id)).toThrow(`Node with id ${id} not found`);
    });
  });

  it("updateNode shuld change node data", () => {
    const startValue: number = 10;
    const endValue: number = 99;
    tree.addLeaf(startValue);
    const node = tree.getRoot()!;
    tree.updateNode(node.id, 99);
    expect(tree.getRoot()?.data).toBe(endValue);
    expect(() => tree.updateNode(999, 0)).toThrow(`Node with id 999 not found`);
  });

  it("size should return number of nodes", () => {
    expect(tree.size()).toBe(0);
    tree.addLeaf(1);
    expect(tree.size()).toBe(1);
    tree.addLeaf(2);
    expect(tree.size()).toBe(2);
  });

  it("height should return max depth", () => {
    expect(tree.height()).toBe(0);
    tree.addLeaf(1);
    expect(tree.height()).toBe(1);
    tree.addLeaf(2);
    expect(tree.height()).toBe(2);
    tree.addLeaf(3);
    expect(tree.height()).toBe(2);
    tree.addLeaf(4);
    expect(tree.height()).toBe(3);
  });

  it("isBalanced should alaways return true for left-balanced binary tree", () => {
    const count: number = 100;
    for (let number = 1; number <= count; number++) {
      tree.addLeaf(number);
      expect(tree.isBalanced()).toBeTruthy();
    }
  });

  it("clone should create an independent copy", () => {
    [1, 2, 3, 4].forEach((value) => tree.addLeaf(value));
    const cloned = tree.clone();
    expect(cloned.size()).toBe(tree.size());
    expect(new Set(cloned.toArray())).toEqual(new Set(tree.toArray()));
    const nodeToRemove = tree.find((data) => data === 4)!;
    tree.removeNode(nodeToRemove.id);
    expect(tree.size()).toBe(3);
    expect(cloned.size()).toBe(4);
    expect(new Set(cloned.toArray())).toEqual(new Set([1, 2, 3, 4]));
  });

  it("toArray should return inorder array", () => {
    expect(tree.toArray()).toEqual([]);
    [5, 3, 8, 1, 4].forEach((value) => tree.addLeaf(value));
    expect(tree.toArray()).toEqual([1, 3, 4, 5, 8]);
  });

  it("iterator should worl with for-of", () => {
    [10, 20, 30].forEach((value) => tree.addLeaf(value));
    const result: number[] = [];
    for (const value of tree) {
      result.push(value);
    }
    expect(new Set(result)).toEqual(new Set([10, 20, 30]));
  });

  it("should handle sequence of add/remove operations", () => {
    [1, 2, 3, 4, 5].forEach((value) => tree.addLeaf(value));
    expect(tree.size()).toBe(5);
    expect(tree.isBalanced()).toBeTruthy();
    const leaf5 = tree.find((data) => data === 5)!;
    tree.removeNode(leaf5.id);
    expect(tree.size()).toBe(4);
    expect(tree.isBalanced()).toBeTruthy();
    expect(new Set(tree.toArray())).toEqual(new Set([1, 2, 3, 4]));
    tree.addLeaf(6);
    tree.addLeaf(7);
    expect(tree.size()).toBe(6);
    expect(tree.isBalanced()).toBeTruthy();
    expect(new Set(tree.toArray())).toEqual(new Set([1, 2, 3, 4, 6, 7]));
  });
});
