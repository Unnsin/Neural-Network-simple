import { NeuronType } from "./constans";

export default class Neuron {
	public inputs: Array<number>;
	public weights: Array<number>;
	public neuronType: NeuronType

	constructor(inputsVector: Array<number>, weightsVector: Array<number>, type: NeuronType){
		this.inputs = inputsVector;
		this.weights = weightsVector;
		this.neuronType = type;
	}

	Active(): number {
		let sum: number = 0;
		this.inputs.forEach((input, weightsIndex)=> {
			sum += input * this.weights[weightsIndex];
		})
		return Math.sign(sum);
	}
}