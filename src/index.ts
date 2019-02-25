import * as fs from "fs";
import * as js2xmlparser from "js2xmlparser";
import * as parser from "xml2json";
import NeuralNetwork from "./Neural1/NeuralNetwork";
import { MemoryMode, LayerType } from './Neural2/constans';
import Layer from './Neural2/Layer';

const layer = new Layer(2, 2, "hidden_layer", MemoryMode.CREATE, LayerType.HiddenLayer)
const layer2 = new Layer(1, 2, "output_layer", MemoryMode.CREATE, LayerType.OutputLayer);
layer.Data([1, 0]);
const recognize = layer.Recognize()
layer2.Data(recognize);

// NeuralNetwork.Main();
