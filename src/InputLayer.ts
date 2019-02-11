import { InputLayoutTuple } from "./interfaces";

export default class InputLayer {
  private _trainSet: Array<InputLayoutTuple>;
  constructor() {
    this._trainSet = [
      Object.freeze([[1, 1], [1]]) as InputLayoutTuple,
      Object.freeze([[1, 0], [0]]) as InputLayoutTuple,
      Object.freeze([[0, 1], [0]]) as InputLayoutTuple,
      Object.freeze([[1, 1], [1]]) as InputLayoutTuple
    ];
  }

  Trainset = (): Array<InputLayoutTuple> => this._trainSet;
}
