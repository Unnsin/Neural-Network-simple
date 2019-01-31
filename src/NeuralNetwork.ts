import InputLayer from "./InputLayer";
import { HiddenLayer, OutputLayer } from "./Layer";
import { NeuronType, MemoryMode } from "./constans";
import { networkInterfaces } from "os";

const lengthFacts = 2;
const iterError = 4;
export default class NeuralNetwork {
  public inputLayer: InputLayer = new InputLayer();
  public hiddenLayer: HiddenLayer = new HiddenLayer(
    4,
    2,
    NeuronType.Hidden,
    "hidden_layer"
  );
  public outputLayer: OutputLayer = new OutputLayer(
    2,
    4,
    NeuronType.Output,
    "output_layer"
  );
  public fact: Array<number> = new Array(lengthFacts);

  public getMSE(errors: Array<number>): number {
    let sum: number = 0;
    for (let i = 0; i < errors.length; i++) {
      sum += Math.pow(errors[i], 2);
    }
    return 0.5 * sum;
  }

  public getCost(mses: Array<number>): number {
    let sum: number = 0;
    for (let i = 0; i < mses.length; i++) {
      sum += mses[i];
    }
    return sum / mses.length;
  }

  static Train(net: NeuralNetwork): void {
    let threshold: number = 0.25;
    let temp_mess: Array<number> = new Array(iterError);
    let temp_cost: number = 0;
    do {
      for (let i = 0; i < net.inputLayer.Trainset().length; i++) {
        net.hiddenLayer.Data(net.inputLayer.Trainset()[i][0]);
        net.hiddenLayer.Recognize(null, net.outputLayer);
        net.outputLayer.Recognize(net, null);
        let errors: Array<number> = new Array(
          net.inputLayer.Trainset()[i][1].length
        );
        for (let x = 0; x < errors.length; x++) {
          errors[x] = net.inputLayer.Trainset()[i][1][x] - net.fact[x];
        }
        temp_mess[i] = net.getMSE(errors);
        let temp_gsums: Array<number> = net.outputLayer.BackwardPass(errors);
        net.hiddenLayer.BackwardPass(temp_gsums);
      }
      temp_cost = net.getCost(temp_mess);
      console.log(`${temp_cost}`);
    } while (temp_cost > threshold);

    net.hiddenLayer.WeightInitialize(MemoryMode.SET, "hidden_layer");
    net.outputLayer.WeightInitialize(MemoryMode.SET, "output_layer");
  }

  static Test(net: NeuralNetwork): void {
    for (let i = 0; i < net.inputLayer.Trainset().length; i++) {
      net.hiddenLayer.Data(net.inputLayer.Trainset()[i][0]);
      net.hiddenLayer.Recognize(null, net.outputLayer);
      net.outputLayer.Recognize(net, null);

      for (let j = 0; j < net.fact.length; j++) {
        console.log("answer");
        console.log(`${net.fact[j]}`);
      }
      console.log("\n");
    }
  }

  static Main(): void {
    let network: NeuralNetwork = new NeuralNetwork();
    this.Train(network);
    this.Test(network);
  }
}
