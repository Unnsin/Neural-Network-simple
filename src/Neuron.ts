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
    return this.Activator(this.inputs, this.weights);
  };

  Activator = (inputs: Array<number>, weights: Array<number>): number => {
    let sum: number = 0;
    weights.forEach((item, index)=> {
      sum += item * inputs[index];
    })
    return 1 / (1 + Math.exp(-sum));
  };

  Derivator = (input: number): number => {
    return ( 1-input ) * input;
  }

  Delta = (IdealOut: number, ActualOut: number, g_sum: number): number => {
    let sum: number = 0;
    this.weights.forEach(item => {
      sum += item * g_sum
    });
    return this.type ===  NeuronType.Output ? 
      IdealOut - ActualOut * this.Derivator(ActualOut) : 
      this.Derivator(ActualOut) * sum
  }

  Gradient = (delta: number, out: number): number => {
    return delta * out
  }
}
