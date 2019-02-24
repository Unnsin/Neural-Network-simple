import { NeuronType, MemoryMode } from "./constans";
import Neuron from "./Neuron";
import { dimensionalArray } from "./utils";
import * as fs from "fs";
import * as js2xmlparser from "js2xmlparser";
import * as parser from "xml2json";
import NeuralNetwork from "./NeuralNetwork";

/* ----------------------------- Abstract Class ----------------------------------- */

export abstract class Layer {
  protected numOfNeurons: number; // количество нейронов на текущем слое 
  protected numOfPrevNeurons: number; // количество нейронов на предидущем слое 
  protected type: string; // тип слоя(скрытый, выходной)
  protected neuronType: NeuronType; // тип нейронов в слое
  public Neurons: Array<Neuron>; // нейроны текущего слоя 
  protected Weights: Array<Array<number>>;  // вес синапсов
  protected learningrate: number = 0.7; // скорость обучения 
  protected alpha: number = 0.3; //момент

  constructor(non: number, nopn: number, nt: NeuronType, type: string) {
    this.Neurons = new Array(non);
    this.type = type;
    this.neuronType = nt;
    this.numOfNeurons = non;
    this.numOfPrevNeurons = nopn;
    this.Weights = this.WeightInitialize(MemoryMode.GET, type);
    for (let i = 0; i < non; i++) {
      let temp_weights: Array<number> = new Array(non);
      for (let j = 0; j < nopn; j++) {
        temp_weights[j] = this.Weights[i][j];
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
    console.log(`${type} weights are being initialized...`);
    let _weights = dimensionalArray<number>(
      this.numOfNeurons,
      this.numOfPrevNeurons
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
          for (let k = 0; k < this.numOfPrevNeurons; k++) {
            obj[`item${k + this.numOfPrevNeurons * l}`] = String(
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
  public abstract BackwardPass(stuff?: Array<number>): Array<number>;
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

  public BackwardPass(errors: Array<number>): Array<number> {
    let gr_sum: Array<number> = [];

    this.Neurons.forEach((neuron, iter) => {
      let weightDelta: Array<number> = [];
      gr_sum[iter] = neuron.Delta(errors[0])
      neuron.weights.forEach((weight, index)=> {
        let delta = neuron.Delta(errors[0]);
        let gradient = neuron.Gradient(delta);
        weightDelta[index] = this.learningrate * gradient + this.alpha * neuron.prevWeightDelta[index];
        neuron.weights[index] += weightDelta[index];
      })
      neuron.prevWeightDelta = weightDelta;
    })
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
      this.Neurons.forEach((neuron, iter) => {
        let weightDelta: Array<number> = [];
        gr_summ[iter] = neuron.Delta(errors[iter])
        neuron.weights.forEach((weight , index) => {
          let delta = neuron.Delta(errors[iter]);
          let gradient = neuron.Gradient(delta);
          weightDelta[index] = this.learningrate * gradient + this.alpha * neuron.prevWeightDelta[index]
          neuron.weights[index] += weightDelta[index];
        })   
        neuron.prevWeightDelta = weightDelta;
      })
    return gr_summ;
   }
}
