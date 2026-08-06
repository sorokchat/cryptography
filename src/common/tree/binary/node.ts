export type Node<T> = {
  id: number;
  data: T;
  left?: Node<T>;
  right?: Node<T>;
  parent?: Node<T>;
  isLeaf: boolean;
};
