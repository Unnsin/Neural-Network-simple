import { NeuronType, MemoryMode } from "./constans";
import Neuron from "./Neuron";
import { WeightsTuple } from "./interfaces";
import { dimensionalArray } from "./utils";

export class Layout {
  protected numofneurons: number;
  protected numofprevneurons: number;
  protected type: string;
  protected neuronType: NeuronType;
  public Neurons: Array<Neuron>;

  constructor(non: number, nopn: number, nt: NeuronType, type: string) {
    this.Neurons = new Array(non);
    this.type = type;
    this.neuronType = nt;
    this.numofneurons = non;
    this.numofprevneurons = nopn;
    let weights: Array<Array<number>> = this.WeightInitialize(
      MemoryMode.GET,
      type
    );
    for (let i = 0; i < non; i++) {
      let temp_weights: Array<number> = new Array(non);
      for (let j = 0; j < nopn; j++) {
        temp_weights[j] = weights[i][j];
      }
      this.Neurons[i] = new Neuron([], temp_weights, this.neuronType);
    }
  }

  public Data(array: Array<number>) {
    for (let i = 0; i < this.Neurons.length; i++) {
      this.Neurons[i].inputs = array;
    }
  }

  public WeightInitialize(mm: MemoryMode, type: string): Array<Array<number>> {
    let _weights = dimensionalArray<number>(
      this.numofneurons,
      this.numofprevneurons
    );
    console.log(`${type} weights are being initialized...`);
    return _weights;
  }
}
