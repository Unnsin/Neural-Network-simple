import { NeuronType } from "./constans";

export default class Neuron {
  private _prevWeightDelta: Array<number> = [];
  constructor(
    private _inputs: Array<number>,
    private _weights: Array<number>,
    private _type: NeuronType,
  ) {
    for(let i=0; i < +_weights.length; i++){
      this._prevWeightDelta.push(0);
    }
  }

  get prevWeightDelta(): Array<number>{
    return this._prevWeightDelta
  }

  set prevWeightDelta(inputs: Array<number>) {
    this._prevWeightDelta = inputs;
  }

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
    return (1 - input) * input;
  }

  Delta = (error: number): number => {
    let sum: number = 0;
    this.weights.forEach(item => {
      sum += item * error
    });
    return this.type ===  NeuronType.Output ? 
      error * this.Derivator(this.Output()) : 
      this.Derivator(this.Output()) * sum
  }

  Gradient = (delta: number): number => {
    return delta * this.Output()
  }
}
