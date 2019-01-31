import { NeuronType, MemoryMode } from "./constans";
import Neuron from "./Neuron";
import { dimensionalArray } from "./utils";
import * as fs from "fs";
import * as js2xmlparser from "js2xmlparser";
import * as parser from "xml2json";
import NeuralNetwork from "./NeuralNetwork";

/* ----------------------------- Abstract Class ----------------------------------- */

export abstract class Layer {
  protected numofneurons: number;
  protected numofprevneurons: number;
  protected type: string;
  protected neuronType: NeuronType;
  public Neurons: Array<Neuron>;
  protected Weights: Array<Array<number>>;
  protected learningrate: number = 0.9;

  constructor(non: number, nopn: number, nt: NeuronType, type: string) {
    this.Neurons = new Array(non);
    this.type = type;
    this.neuronType = nt;
    this.numofneurons = non;
    this.numofprevneurons = nopn;
    this.Weights = this.WeightInitialize(MemoryMode.GET, type);
    for (let i = 0; i < non; i++) {
      let temp_weights: Array<number> = new Array(non);
      for (let j = 0; j < nopn; j++) {
        temp_weights[j] = this.Weights[i][j];
      }
      const arr: Array<number> = new Array();
      this.Neurons[i] = new Neuron(arr, temp_weights, this.neuronType);
    }
  }

  public Data(array: Array<number>) {
    for (let i = 0; i < this.Neurons.length; i++) {
      this.Neurons[i].inputs = array;
    }
  }

  public WeightInitialize(mm: MemoryMode, type: string): Array<Array<number>> {
    console.log(`${type} weights are being initialized...`);
    let _weights = dimensionalArray<number>(
      this.numofneurons,
      this.numofprevneurons
    );
    switch (mm) {
      case MemoryMode.GET: {
        let content = fs.readFileSync(`./${type}_memory.xml`, "utf-8");
        let json = JSON.parse(parser.toJson(content));
        let memory = json.object;
        for (let l = 0; l < _weights.length; ++l) {
          for (let k = 0; k < _weights[0].length; ++k) {
            _weights[l][k] = Number(
              memory[`item${k + _weights[0].length * l}`]
            );
          }
        }
        break;
      }
      case MemoryMode.SET: {
        let obj = Object.create({});
        for (let l = 0; l < this.Neurons.length; l++) {
          for (let k = 0; k < this.numofprevneurons; k++) {
            obj[`item${k + this.numofprevneurons * l}`] = String(
              this.Neurons[l].weights[k]
            );
          }
        }
        let xmlString = js2xmlparser.parse("object", obj);
        fs.writeFile(`./${type}_memory.xml`, xmlString, err => {});
        break;
      }
    }
    console.log(`${type} weights have been initialized...`);
    return _weights;
  }
  public abstract Recognize(net: NeuralNetwork | null, nextLayer: Layer): void;
  public abstract BackwardPass(stuff: Array<number>): Array<number>;
}

/* ----------------------------- Hidden Layer Class ----------------------------------- */

export class HiddenLayer extends Layer {
  constructor(
    public non: number,
    public nopn: number,
    public nt: NeuronType,
    public type: string
  ) {
    super(non, nopn, nt, type);
  }

  public Recognize(net: NeuralNetwork | null, nextLayer: Layer): void {
    let hidden_output: Array<number> = [];
    for (let i = 0; i < this.Neurons.length; i++) {
      hidden_output[i] = this.Neurons[i].Output();
    }
    nextLayer.Data(hidden_output);
  }

  public BackwardPass(gr_sums: Array<number>): Array<number> {
    let gr_sum: Array<number> = [];
    for (let i = 0; i < this.numofneurons; ++i) {
      for (let n = 0; n < this.numofprevneurons; ++n) {
        this.Neurons[i].weights[n] +=
          this.learningrate *
          this.Neurons[i].inputs[n] *
          this.Neurons[i].Gradient(
            0,
            this.Neurons[i].Derivativator(),
            gr_sums[i]
          );
      }
    }
    return gr_sum;
  }
}

/* ----------------------------- Output Layer Class ----------------------------------- */

export class OutputLayer extends Layer {
  constructor(non: number, nopn: number, nt: NeuronType, type: string) {
    super(non, nopn, nt, type);
  }
  public Recognize(net: NeuralNetwork, nextLayer: Layer | null): void {
    for (let i = 0; i < this.Neurons.length; ++i) {
      net.fact[i] = this.Neurons[i].Output();
    }
  }
  public BackwardPass(errors: Array<number>): Array<number> {
    let gr_summ: Array<number> = [];
    for (let i = 0; i < this.numofprevneurons; i++) {
      let sum: number = 0;
      for (let k = 0; k < this.Neurons.length; k++) {
        sum +=
          this.Neurons[k].weights[i] +
          this.Neurons[k].Gradient(
            errors[k],
            this.Neurons[k].Derivativator(),
            0
          );
      }
      gr_summ[i] = sum;
    }

    for (let i = 0; i < this.numofneurons; i++) {
      for (let k = 0; k < this.numofprevneurons; k++) {
        this.Neurons[i].weights[k] +=
          this.learningrate *
          this.Neurons[i].inputs[k] *
          this.Neurons[i].Gradient(
            errors[i],
            this.Neurons[i].Derivativator(),
            0
          );
      }
    }

    return gr_summ;
  }
}
