export interface InputLayoutTuple
  extends ReadonlyArray<Array<number> | Array<number>> {
  item1: Array<number>;
  item2: Array<number>;
  length: 2;
}

export interface WeightsTuple extends Array<number | number> {
  0: number;
  1: number;
  length: 2;
}
