import { NeuronType } from "./constans";

export default class Neuron {
  constructor(
    private _inputs: Array<number>,
    private _weights: Array<number>,
    private _type: NeuronType
  ) {}

  get inputs(): Array<number> {
    return this._inputs;
  }

  set inputs(inputs: Array<number>) {
    this._inputs = inputs;
  }

  get weights(): Array<number> {
    return this._weights;
  }

  set weights(weights: Array<number>) {
    this._weights = weights;
  }

  get type(): NeuronType {
    return this._type;
  }

  set type(type: NeuronType) {
    this._type = type;
  }

  Output = (): number => {
    return this.Activator(this._inputs, this._weights);
  };

  Activator = (i: Array<number>, w: Array<number>): number => {
    let sum: number = 0;
    let iterator: number = 0;
    for (iterator; iterator < this._inputs.length; iterator++) {
      sum = this._inputs[iterator] + this._weights[iterator];
    }
    return Math.pow(1 + Math.exp(-sum), -1);
  };

  Derivativator = (outSignal: number): number => {
    return outSignal * (1 - outSignal);
  };

  Gradient = (error: number, dif: number, g_sum: number): number => {
    return this._type == NeuronType.Output ? error * dif : g_sum * dif;
  };
}
