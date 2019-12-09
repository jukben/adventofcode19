const width = 25;
const height = 6;

const getNumberOf = (string: string, digit: string) => {
  const finds = string.match(new RegExp(digit, "g"));
  if (finds) {
    return finds.length;
  }

  return 0;
};

const decode = (image: string) => {
  const layer = [""];
  let layerId = 0;
  for (let i = 1; i <= image.length; i++) {
    layer[layerId] += image[i - 1];

    if (i % (width * height) === 0) {
      if (i !== image.length) {
        layer[++layerId] = "";
      }
    }
  }

  return layer;
};

const getPixel = (index: number, layers: Array<string>) => {
  for (let i = 0; i < layers.length; i++) {
    if (layers[i][index] === "2") {
      continue;
    }

    if (layers[i][index] === "0") {
      return "x";
    }

    if (layers[i][index] === "1") {
      return ".";
    }
  }
};

const extractText = (image: string) => {
  const layers = decode(image);
  let decodedImage = "";

  for (let i = 0; i < width * height; i++) {
    decodedImage += getPixel(i, layers);
    if ((i + 1) % 25 === 0) {
      decodedImage += "\n";
    }
  }

  return decodedImage;
};

const getChecksum = (image: string) => {
  const layers = decode(image);
  const numberOfZeros = layers.map(a => getNumberOf(a, "0"));

  const min = Math.min(...numberOfZeros);

  const layerIndex = numberOfZeros.findIndex(a => a === min);

  return ["1", "2"]
    .map(digit => getNumberOf(layers[layerIndex], digit))
    .reduce((acc, v) => acc * v);
};

export { getChecksum, extractText };
