import InputLayer from "./InputLayer";
import { HiddenLayer, OutputLayer } from "./Layer";
import { NeuronType, MemoryMode } from "./constans";
import { networkInterfaces } from "os";

function MSE(outputSet: Array<number>, answerSet: Array<number>) {
  if (outputSet.length == 1) {
    return Math.pow(answerSet[0] - outputSet[0], 2) / 1;
  }
  const answer = outputSet.reduce((accumulator, currentValue, index) => {
    return accumulator + Math.pow(answerSet[index] - currentValue, 2);
  });
  return answer / outputSet.length;
}

const lengthFacts = 1;
const iterError = 4;
export default class NeuralNetwork {
  public inputLayer: InputLayer = new InputLayer();
  public hiddenLayer: HiddenLayer = new HiddenLayer(
    2,
    2,
    NeuronType.Hidden,
    "hidden_layer"
  );
  public outputLayer: OutputLayer = new OutputLayer(
    1,
    2,
    NeuronType.Output,
    "output_layer"
  );
  public fact: Array<number> = new Array(lengthFacts);

  public getMSE(net: NeuralNetwork, iter: number): number {
    const outputSet = net.inputLayer.Trainset()[iter][1];
    const answerSet = net.fact
    if (outputSet.length == 1) {
      return Math.pow(answerSet[0] - outputSet[0], 2) / 1;
    }
    const answer = outputSet.reduce((accumulator, currentValue, index) => {
      return accumulator + Math.pow(answerSet[index] - currentValue, 2);
    });
    return answer / outputSet.length;
  }

  public getCost(mses: Array<number>): number {
    let sum: number = mses.reduce((accum, curent) => accum + curent)
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
        temp_mess[i] = net.getMSE(net, i);
        let temp_gsums: Array<number> = net.outputLayer.BackwardPass([net.getMSE(net, i)]);
        net.hiddenLayer.BackwardPass(temp_gsums);    
      }
      temp_cost = net.getCost(temp_mess);
      console.log(`Temp cost: ${temp_cost}`);
    }   while (temp_cost > threshold);
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
    // this.Train(network);
    this.Test(network);
  }
}
