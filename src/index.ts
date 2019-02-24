import * as fs from "fs";
import * as js2xmlparser from "js2xmlparser";
import * as parser from "xml2json";
import NeuralNetwork from "./Neural1/NeuralNetwork";
import { MemoryMode } from './Neural2/constans';
import Layer from './Neural2/Layer';

const layer = new Layer(2, 2, "hidden_layer", MemoryMode.CREATE)
const layer2 = new Layer(1, 2, "output_layer", MemoryMode.CREATE);
layer.Data([1, 0]);
console.log(layer, layer2)
const recognize = layer.Recognize()
console.log(recognize);
layer2.Data(recognize);
console.log(layer2.Recognize())

// NeuralNetwork.Main();
