import Neuron from "../Neural2/Neuron";
import { MemoryMode, NeuronType, LayerType } from './constans'
import * as fs from "fs";
import * as js2xmlparser from "js2xmlparser";
import * as parser from "xml2json";

export default class Layer {
  public Neurons: Array<Neuron> = [];
  public Weights: Array<Array<number>> = [];
  public learningRate: number = 0.2;
  public neuronOnLayer: number;
  public neuronOfPrevLayer: number;
  public layerTypeName: string; 
  public layerType: LayerType;

  constructor(neuron: number, neuronPrev: number, typeName: string, weightsInitilTypes: MemoryMode, layerType: LayerType) {
    this.neuronOnLayer = neuron;
    this.neuronOfPrevLayer = neuronPrev;
    this.layerTypeName = typeName;
    this.layerType = layerType
    this.Weights = this.WeightInitialize(weightsInitilTypes, this.layerTypeName);
    for (let k = 0; k < this.neuronOnLayer; k++) {
      let temp_weights = []
      for(let l = 0; l < this.neuronOfPrevLayer; l++) {
        temp_weights[l] = this.Weights[l][k];
      }
      this.Neurons[k] = new Neuron([], temp_weights, NeuronType.Hidden);
    }
  }

  public WeightInitialize(mm: MemoryMode, type: string): Array<Array<number>> {
    console.log(`${type} weights are being initialized...`);
    let _weights: Array<Array<number>> = [];
    switch (mm) {
      case MemoryMode.GET: {
        let content = fs.readFileSync(`./${type}_memory.xml`, "utf-8");
        let json = JSON.parse(parser.toJson(content));
        let memory = json.object;
        for (let l = 0; l < this.neuronOfPrevLayer; ++l) {
          let temp_weights = [];
          for (let k = 0; k < this.neuronOnLayer; ++k) {
            temp_weights[k] = Number(
              memory[`item${k  + this.neuronOfPrevLayer * l}`]
            );
            
          }
          _weights[l] = temp_weights; 
        }
        break;
      }
      case MemoryMode.SET: {
        let obj = Object.create({});
        for (let l = 0; l < this.Neurons.length; l++) {
          for (let k = 0; k < this.neuronOfPrevLayer; k++) {
            obj[`item${k + this.neuronOnLayer * l}`] = String(
              this.Neurons[l].weights[k]
            );
          }
        }
        let xmlString = js2xmlparser.parse("object", obj);
        fs.writeFile(`./${type}_memory.xml`, xmlString, err => {});
        break;
      }
      case MemoryMode.CREATE: {
        for(let l=0; l < this.neuronOfPrevLayer; l++) {
          let temp_weights = []
          for(let k = 0; k < this.neuronOnLayer; k++) {
            let number = Math.random() * (10 + 10) - 10
            temp_weights[k] = Number(number.toFixed(2))
          }
          _weights[l] = temp_weights;
        }
      }
    }
    console.log(`${type} weights have been initialized...`);
    return _weights;
  }

  public Data(input: Array<number>): void {
    this.Neurons.forEach(neuron => {
      neuron.inputs = input;
    })
  }

  public Recognize(): Array<number> {
    let outVector: Array<number> = [];
    this.Neurons.forEach(neuron => {
      outVector.push(neuron.Active())
    })
    return outVector
  }

  public BackwardPass(errors: Array<number>): Array<number>{
    const neuronError: Array<number> = []
    this.Neurons.forEach((neuron, index) => {
      neuronError.push(errors[index] * neuron.Derivative())
    });
    console.log(neuronError)
    return []
  }
  
}