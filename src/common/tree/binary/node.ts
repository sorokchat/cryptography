export type Node<T> = {
  data: T;
  left?: Node<T>;
  right?: Node<T>;
  parent?: Node<T>;
};
