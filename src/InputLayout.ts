import { InputLayoutTuple } from "./interfaces";

export default class InputLayout {
  constructor(private _trainSet: Array<InputLayoutTuple>) {
    _trainSet = [
      Object.freeze([[0, 0], [0, 1]]) as InputLayoutTuple,
      Object.freeze([[0, 1], [1, 0]]) as InputLayoutTuple,
      Object.freeze([[1, 0], [1, 0]]) as InputLayoutTuple,
      Object.freeze([[1, 1], [0, 1]]) as InputLayoutTuple
    ];
  }

  Trainset = (): Array<InputLayoutTuple> => this._trainSet;
}
