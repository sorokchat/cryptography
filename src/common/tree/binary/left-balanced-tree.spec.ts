import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { BinaryTree, type Comparator, Equals } from "./binary-tree.abstract";
import { LeftBalancedBinaryTree } from "./left-balanced-tree";

const comparator: Comparator<number, number> = (first, second) => {
  if (first === second) return Equals.EQUAL;
  if (first < second) return Equals.LESS;
  return Equals.MORE;
};

describe("Left-balanced binary-tree", () => {
  let tree: BinaryTree<number, number>;

  beforeEach(() => {
    tree = new LeftBalancedBinaryTree<number, number>(comparator);
  });

  describe("construct", () => {
    it("should correctly construct", () => {
      const array: number[] = tree.toArray();
      expect(tree.size()).toBe(0);
      expect(tree.isBalanced()).toBeTruthy();
      expect(array).toEqual([]);
    });
  });

  describe("insert", () => {
    it("should insert a single element correctly", () => {
      const item: number = 10;
      tree.insert(item);
      expect(tree.size()).toBe(1);
      expect(tree.isBalanced()).toBeTruthy();
      console.log(tree.toArray());

      expect(tree.toArray()).toEqual([item]);
    });

    it("should insert multiple correctly", () => {
      const numbers: number[] = [20, 10, 30];
      numbers.forEach((item) => tree.insert(item));
      expect(tree.size()).toBe(numbers.length);
      expect(tree.isBalanced()).toBeTruthy();
      expect(tree.toArray()).toEqual(numbers.sort());
    });
  });

  describe("find", () => {
    const founded: number = 5;
    const notFounded: number = 6;
    beforeEach(() => {
      tree.insert(founded);
    });

    it("should find not null item", () => {
      expect(tree.find(founded)).toBe(founded);
    });

    it("should not found item", () => {
      expect(tree.find(notFounded)).toBeNull();
    });
  });

  describe("update", () => {
    let existed: number = 4;
    let notExisted: number = 3;
    let toUpdate: number = 5;
    beforeEach(() => {
      tree.insert(existed);
    });

    it("should return true if key was founded", () => {
      expect(tree.update(existed, toUpdate)).toBeTruthy();
    });

    it("should return false if key not found", () => {
      expect(tree.update(notExisted, toUpdate)).toBeFalsy();
    });
  });

  describe("delete", () => {
    it("should return false if trying to delete from empty tree", () => {
      expect(tree.delete(42)).toBeFalsy();
    });

    it("should return false if the element not exists", () => {
      tree.insert(10);
      tree.insert(20);
      expect(tree.delete(99)).toBeFalsy();
    });

    it("should correctly delete the only one element in tree", () => {
      const item: number = 42;
      tree.insert(item);
      expect(tree.delete(item)).toBeTruthy();
    });

    it("should correctly delete the last element", () => {
      const numbers: number[] = [10, 20, 30];
      numbers.forEach((number) => tree.insert(number));
      expect(tree.delete(numbers[numbers.length - 1])).toBeTruthy();
      expect(tree.size()).toBe(numbers.length - 1);
      expect(tree.toArray()).toEqual([
        numbers[numbers.length - numbers.length],
        numbers[numbers.length - numbers.length + 1],
      ]);
      expect(tree.isBalanced()).toBeTruthy();
    });

    it("should correctly delete not last element", () => {
      const numbers: number[] = [10, 20, 30];
      numbers.forEach((number) => tree.insert(number));
      expect(tree.delete(numbers[0])).toBeTruthy();
      expect(tree.size()).toBe(numbers.length - 1);
      expect(tree.toArray()).toEqual([
        numbers[numbers.length - 2],
        numbers[numbers.length - 1],
      ]);
      expect(tree.isBalanced()).toBeTruthy();
    });
    it("should correctly delete from big tree", () => {
      const elements: number[] = [5, 12, 9, 25, 18, 14, 20];
      const deletedItem: number = 12;
      const elementsAfterDelete: number[] = elements.filter(
        (item) => item !== deletedItem,
      );
      elements.forEach((item) => tree.insert(item));
      expect(tree.delete(deletedItem)).toBeTruthy();
      expect(tree.size()).toBe(elementsAfterDelete.length);
      expect(tree.toArray()).toEqual([5, 18, 9, 25, 20, 14]);
      expect(tree.isBalanced()).toBeTruthy();
    });
  });

  describe("height", () => {
    it("should return 0 for an empty tree", () => {
      expect(tree.height()).toBe(0);
    });

    it("should return 1 for a tree with only root element", () => {
      tree.insert(10);
      expect(tree.height()).toBe(1);
    });

    it("should correctly calculate full tree height for multiple levels", () => {
      tree.insert(10);
      expect(tree.height()).toBe(1);
      tree.insert(20);
      tree.insert(30);
      expect(tree.height()).toBe(2);
      tree.insert(40);
      expect(tree.height()).toBe(3);
    });

    it("should return 0 when trying to find height of non-existing key", () => {
      tree.insert(10);
      expect(tree.height(99)).toBe(0);
    });

    it("should correctly calculate subtree height for a specific key", () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(30);
      tree.insert(40);
      tree.insert(50);
      expect(tree.height()).toBe(3);
      expect(tree.height(20)).toBe(2);
      expect(tree.height(30)).toBe(1);
    });
  });

  describe("min", () => {
    it("should return null for an empty tree", () => {
      expect(tree.min()).toBeNull();
    });

    it("should return the only element for a single-element tree", () => {
      tree.insert(42);
      expect(tree.min()).toBe(42);
    });

    it("should return the minimum element from a populated tree", () => {
      tree.insert(50);
      tree.insert(20);
      tree.insert(30);
      tree.insert(10);
      tree.insert(40);

      expect(tree.min()).toBe(10);
    });

    it("should correctly find the minimum even after updates or deletions", () => {
      tree.insert(30);
      tree.insert(15);
      tree.insert(45);
      tree.delete(15);
      expect(tree.min()).toBe(30);
    });

    it("should return min with douplicates", () => {
      (tree as any).array = [30, 30, 15, 45, 15];
      expect(tree.min()).toBe(15);
    });
  });

  describe("max", () => {
    it("should return null for an empty tree", () => {
      expect(tree.max()).toBeNull();
    });

    it("should return the only element for a single-element tree", () => {
      tree.insert(42);
      expect(tree.max()).toBe(42);
    });

    it("should return the maximum element from a populated tree", () => {
      tree.insert(50);
      tree.insert(20);
      tree.insert(30);
      tree.insert(10);
      tree.insert(40);
      expect(tree.max()).toBe(50);
    });

    it("should correctly find the maximum even after updates or deletions", () => {
      tree.insert(30);
      tree.insert(15);
      tree.insert(45);
      expect(tree.max()).toBe(45);
      tree.delete(45);
      expect(tree.max()).toBe(30);
    });
  });

  describe("contains", () => {
    it("should return true if found", () => {
      tree.insert(1);
      expect(tree.contains(1)).toBeTruthy();
    });

    it("should return false if not found", () => {
      expect(tree.contains(1)).toBeFalsy();
    });
  });

  describe("isBalanced", () => {
    describe("valid heaps", () => {
      it("should return true for empty tree", () => {
        expect(tree.isBalanced()).toBe(true);
      });

      it("should return true for single element", () => {
        tree.insert(42);
        expect(tree.isBalanced()).toBe(true);
      });

      it("should return true after multiple insertions", () => {
        [10, 5, 15, 3, 7, 12, 20].forEach((v) => tree.insert(v));
        expect(tree.isBalanced()).toBe(true);
      });

      it("should return true after deletions", () => {
        [10, 5, 15, 3, 7].forEach((v) => tree.insert(v));
        tree.delete(3);
        tree.delete(15);
        expect(tree.isBalanced()).toBe(true);
      });

      it("should return true after fromArray with valid heap", () => {
        tree.fromArray([5, 10, 15, 20, 25, 30, 35]);
        expect(tree.isBalanced()).toBe(true);
      });

      it("should return true for heap with missing children (valid)", () => {
        tree.fromArray([5, 10, 15, 20, 25]);
        expect(tree.isBalanced()).toBe(true);
      });
    });

    describe("invalid heaps (direct array access)", () => {
      it("should return false when parent > left child (2 elements)", () => {
        (tree as any).array = [20, 10];
        expect(tree.isBalanced()).toBe(false);
      });

      it("should return false when left child violates at root (3 elements)", () => {
        (tree as any).array = [20, 10, 30];
        expect(tree.isBalanced()).toBe(false);
      });

      it("should return false when right child violates at root (3 elements)", () => {
        (tree as any).array = [20, 30, 10];
        expect(tree.isBalanced()).toBe(false);
      });

      it("should return false when both children violate", () => {
        (tree as any).array = [20, 10, 15];
        expect(tree.isBalanced()).toBe(false);
      });

      it("should return false when violation at deeper parent (left child)", () => {
        (tree as any).array = [5, 10, 15, 3, 25, 30, 35];
        expect(tree.isBalanced()).toBe(false);
      });

      it("should return false when violation at deeper parent (right child)", () => {
        (tree as any).array = [5, 10, 15, 20, 25, 30, 12];
        expect(tree.isBalanced()).toBe(false);
      });

      it("should return false for invalid heap with missing children", () => {
        (tree as any).array = [5, 10, 15, 3, 25];
        expect(tree.isBalanced()).toBe(false);
      });

      it("should return false when right child violates but left child is valid", () => {
        (tree as any).array = [5, 15, 3];
        expect(tree.isBalanced()).toBe(false);
      });
    });
  });

  describe("clear", () => {
    it("should clear an empty tree (no effect)", () => {
      expect(tree.size()).toBe(0);
      tree.clear();
      expect(tree.size()).toBe(0);
      expect(tree.isBalanced()).toBe(true);
      expect(tree.toArray()).toEqual([]);
      expect(tree.min()).toBeNull();
      expect(tree.max()).toBeNull();
      expect(tree.height()).toBe(0);
    });

    it("should clear a tree with elements", () => {
      [10, 5, 15, 3, 7].forEach((v) => tree.insert(v));
      expect(tree.size()).toBe(5);
      expect(tree.toArray()).not.toEqual([]);
      tree.clear();
      expect(tree.size()).toBe(0);
      expect(tree.toArray()).toEqual([]);
      expect(tree.min()).toBeNull();
      expect(tree.max()).toBeNull();
      expect(tree.contains(10)).toBe(false);
      expect(tree.contains(5)).toBe(false);
      expect(tree.isBalanced()).toBe(true);
      expect(tree.height()).toBe(0);
    });

    it("should allow inserting new elements after clear", () => {
      [10, 5, 15].forEach((v) => tree.insert(v));
      tree.clear();
      expect(tree.size()).toBe(0);
      tree.insert(42);
      expect(tree.size()).toBe(1);
      expect(tree.min()).toBe(42);
      expect(tree.max()).toBe(42);
      expect(tree.contains(42)).toBe(true);
      expect(tree.isBalanced()).toBe(true);
    });

    it("should not affect other trees (if multiple instances)", () => {
      const tree2 = new LeftBalancedBinaryTree<number, number>((a, b) =>
        a < b ? Equals.LESS : a > b ? Equals.MORE : Equals.EQUAL,
      );
      tree.insert(10);
      tree2.insert(20);
      tree.clear();
      expect(tree.size()).toBe(0);
      expect(tree2.size()).toBe(1);
      expect(tree2.min()).toBe(20);
    });

    it("should work correctly after fromArray and then clear", () => {
      tree.fromArray([5, 10, 15, 20, 25]);
      expect(tree.size()).toBe(5);
      tree.clear();
      expect(tree.size()).toBe(0);
      expect(tree.toArray()).toEqual([]);
      expect(tree.isBalanced()).toBe(true);
    });
  });

  describe("forEach", () => {
    it("should not call callback for empty tree", () => {
      const callback = jest.fn();
      tree.forEach(callback);
      expect(callback).not.toHaveBeenCalled();
    });

    it("should call callback once for single element tree", () => {
      tree.insert(42);
      const callback = jest.fn();
      tree.forEach(callback);
      expect(callback).toHaveBeenCalledTimes(1);
      expect(callback).toHaveBeenCalledWith(42);
    });

    it("should call callback for each element in current array order", () => {
      const elements = [10, 5, 15, 3, 7];
      elements.forEach((v) => tree.insert(v));
      const expectedArray = tree.toArray();
      const callback = jest.fn();
      tree.forEach(callback);
      expect(callback).toHaveBeenCalledTimes(expectedArray.length);
      expectedArray.forEach((item, index) => {
        expect(callback).toHaveBeenNthCalledWith(index + 1, item);
      });
    });

    it("should not modify the tree", () => {
      const elements = [10, 5, 15];
      elements.forEach((v) => tree.insert(v));
      const beforeSize = tree.size();
      const beforeArray = tree.toArray();
      const callback = jest.fn();
      tree.forEach(callback);
      expect(tree.size()).toBe(beforeSize);
      expect(tree.toArray()).toEqual(beforeArray);
    });

    it("should work with strings", () => {
      const stringTree = new LeftBalancedBinaryTree<string, string>((a, b) =>
        a < b ? Equals.LESS : a > b ? Equals.MORE : Equals.EQUAL,
      );
      stringTree.insert("apple");
      stringTree.insert("banana");
      const callback = jest.fn();
      stringTree.forEach(callback);
      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback).toHaveBeenCalledWith("apple");
      expect(callback).toHaveBeenCalledWith("banana");
    });

    it("should iterate over manually set array (to verify order)", () => {
      (tree as any).array = [5, 3, 8, 1];
      const callback = jest.fn();
      tree.forEach(callback);
      expect(callback).toHaveBeenNthCalledWith(1, 5);
      expect(callback).toHaveBeenNthCalledWith(2, 3);
      expect(callback).toHaveBeenNthCalledWith(3, 8);
      expect(callback).toHaveBeenNthCalledWith(4, 1);
    });
  });

  describe("clone", () => {
    it("should clone an empty tree", () => {
      const cloned = tree.clone();
      expect(cloned).toBeInstanceOf(LeftBalancedBinaryTree);
      expect(cloned.size()).toBe(0);
      expect(cloned.toArray()).toEqual([]);
      expect(cloned.isBalanced()).toBe(true);
    });

    it("should clone a tree with single element", () => {
      tree.insert(42);
      const cloned = tree.clone();
      expect(cloned.size()).toBe(1);
      expect(cloned.min()).toBe(42);
      expect(cloned.max()).toBe(42);
      expect(cloned.toArray()).toEqual(tree.toArray());
      expect(cloned.isBalanced()).toBe(true);
    });

    it("should clone a tree with multiple elements", () => {
      const elements = [10, 5, 15, 3, 7];
      elements.forEach((v) => tree.insert(v));
      const cloned = tree.clone();
      expect(cloned.size()).toBe(tree.size());
      expect(cloned.toArray()).toEqual(tree.toArray());
      expect(cloned.min()).toBe(tree.min());
      expect(cloned.max()).toBe(tree.max());
      expect(cloned.contains(3)).toBe(true);
      expect(cloned.contains(7)).toBe(true);
      expect(cloned.isBalanced()).toBe(true);
    });

    it("should clone a tree after deletions", () => {
      [10, 5, 15, 3, 7].forEach((v) => tree.insert(v));
      tree.delete(3);
      tree.delete(15);
      const cloned = tree.clone();
      expect(cloned.size()).toBe(3);
      expect(cloned.toArray()).toEqual(tree.toArray());
      expect(cloned.contains(3)).toBe(false);
      expect(cloned.contains(15)).toBe(false);
      expect(cloned.min()).toBe(5);
      expect(cloned.max()).toBe(10);
    });

    it("should clone a tree after fromArray", () => {
      tree.fromArray([5, 10, 15, 20, 25]);
      const cloned = tree.clone();
      expect(cloned.toArray()).toEqual(tree.toArray());
      expect(cloned.size()).toBe(5);
      expect(cloned.isBalanced()).toBe(true);
    });

    it("should produce a deep copy (independent from original)", () => {
      const elements = [10, 5, 15];
      elements.forEach((v) => tree.insert(v));
      const cloned = tree.clone();
      tree.insert(20);
      tree.delete(5);
      expect(cloned.size()).toBe(3);
      expect(cloned.toArray()).not.toEqual(tree.toArray());
      expect(cloned.contains(20)).toBe(false);
      expect(cloned.contains(5)).toBe(true);
      expect(cloned.min()).toBe(5);
      expect(tree.min()).toBe(10);
    });

    it("should clone with objects (deep copy of objects)", () => {
      interface TestObj {
        id: number;
        name: string;
      }

      const objTree = new LeftBalancedBinaryTree<Pick<TestObj, "id">, TestObj>(
        (a, b) =>
          a.id < b.id ? Equals.LESS : a.id > b.id ? Equals.MORE : Equals.EQUAL,
      );
      const obj1 = { id: 1, name: "one" };
      const obj2 = { id: 2, name: "two" };
      objTree.insert(obj1);
      objTree.insert(obj2);

      const cloned = objTree.clone();
      expect(cloned.size()).toBe(2);
      const arr = cloned.toArray();
      expect(arr[0]).not.toBe(obj1);
      expect(arr[0]).toEqual(obj1);
      expect(arr[1]).not.toBe(obj2);
      expect(arr[1]).toEqual(obj2);
      obj1.name = "modified";
      const clonedArr = cloned.toArray();
      expect(clonedArr[0].name).toBe("one");
    });

    it("should preserve comparator in cloned tree", () => {
      const cloned = tree.clone();
      cloned.insert(10);
      cloned.insert(5);
      expect(cloned.min()).toBe(5);
      expect(cloned.max()).toBe(10);
      expect((cloned as any).comparator).toBe((tree as any).comparator);
    });
  });
});
