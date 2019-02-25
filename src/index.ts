import * as fs from "fs";
import * as js2xmlparser from "js2xmlparser";
import * as parser from "xml2json";
import NeuralNetwork from "./Neural1/NeuralNetwork";
import { MemoryMode, LayerType } from './Neural2/constans';
import Layer from './Neural2/Layer';

function get_error(answer: Array<number>, trainAnswer: Array<number>): Array<number>{
    let errors: Array<number> = [];
    answer.forEach((answer, index) => {
        errors.push(trainAnswer[index] - answer);
    });
    return errors;
}

const layer = new Layer(2, 2, "hidden_layer", MemoryMode.CREATE, LayerType.HiddenLayer)
const layer2 = new Layer(1, 2, "output_layer", MemoryMode.CREATE, LayerType.OutputLayer);
layer.Data([1, 0]);
const recognize = layer.Recognize()
layer2.Data(recognize);
const answer = layer2.Recognize();
const errors = get_error(answer, [1])
layer2.BackwardPass(errors);

// NeuralNetwork.Main();
