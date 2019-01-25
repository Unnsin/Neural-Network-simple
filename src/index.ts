const E = 0.7;
const A = 0.3;

//Сигмоид, функция активации для каждого нейрона. Применяеться для вычисление output нейрона на основе суммы input
function sigmoid(x: Number) {
  return 1 / (1 + Math.exp(-x));
}

//Производная от функции активации(сигмоида) используеться для вычисление дельты
function sigmoidDerivative(x: number) {
  return (1 - x) * x;
}

// Функция применяемая для вычисления дельты нейрона без исходящих синопсов
function delta(out: number, answer: number) {
  return (answer - out) * sigmoidDerivative(out);
}

//Функция применяеться для вычисления дельты нейрона с исходящими синопсами
function alternativeDelta(out: number, wArr: Array<number>, delta: number) {
  if (wArr.length == 1) {
    return sigmoidDerivative(out) * (wArr[0] * delta);
  }
  const sum = wArr.reduce((accum, current) => accum + current * delta);
  return sigmoidDerivative(out) * sum;
}

//Функция для вычисления градиента нейрона
function gradient(delta: number, output: number) {
  return delta * output;
}

// Новый вес синопса
function MOR(
  grad: number,
  delta: number,
  weight: number,
  previousWeight: number
) {
  return weight + (E * grad + A * previousWeight);
}

//Функция для подсчета ошибки
function MSE(outputSet: Array<number>, answerSet: Array<number>) {
  if (outputSet.length == 1) {
    return Math.pow(answerSet[0] - outputSet[0], 2) / 1;
  }
  const answer = outputSet.reduce((accumulator, currentValue, index) => {
    return accumulator + Math.pow(answerSet[index] - currentValue, 2);
  });
  return answer / outputSet.length;
}

console.log(
  MOR(
    gradient(0.69, alternativeDelta(0.69, [-2.3], delta(0.33, 1))),
    alternativeDelta(0.69, [-2.3], delta(0.33, 1)),
    -2.3,
    0
  )
);
