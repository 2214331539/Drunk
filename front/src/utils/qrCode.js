const VERSION = 3;
const SIZE = 17 + VERSION * 4;
const DATA_CODEWORDS = 55;
const ECC_CODEWORDS = 15;
const MASK = 0;
const FORMAT_ECC_LOW = 1;

function appendBits(value, length, target) {
  for (let bit = length - 1; bit >= 0; bit -= 1) {
    target.push((value >>> bit) & 1);
  }
}

function bytesToDataCodewords(bytes) {
  if (bytes.length > 53) {
    throw new Error('QR payload is too long for the built-in encoder.');
  }

  const bits = [];

  appendBits(0b0100, 4, bits);
  appendBits(bytes.length, 8, bits);
  bytes.forEach((byte) => appendBits(byte, 8, bits));

  const capacityBits = DATA_CODEWORDS * 8;
  const terminatorLength = Math.min(4, capacityBits - bits.length);

  for (let index = 0; index < terminatorLength; index += 1) {
    bits.push(0);
  }

  while (bits.length % 8 !== 0) {
    bits.push(0);
  }

  const codewords = [];

  for (let index = 0; index < bits.length; index += 8) {
    let codeword = 0;

    for (let offset = 0; offset < 8; offset += 1) {
      codeword = (codeword << 1) | bits[index + offset];
    }

    codewords.push(codeword);
  }

  const pads = [0xec, 0x11];
  let padIndex = 0;

  while (codewords.length < DATA_CODEWORDS) {
    codewords.push(pads[padIndex % pads.length]);
    padIndex += 1;
  }

  return codewords;
}

function buildGaloisTables() {
  const exp = new Array(512).fill(0);
  const log = new Array(256).fill(0);
  let value = 1;

  for (let index = 0; index < 255; index += 1) {
    exp[index] = value;
    log[value] = index;
    value <<= 1;

    if (value & 0x100) {
      value ^= 0x11d;
    }
  }

  for (let index = 255; index < exp.length; index += 1) {
    exp[index] = exp[index - 255];
  }

  return { exp, log };
}

const GF = buildGaloisTables();

function gfMultiply(left, right) {
  if (left === 0 || right === 0) {
    return 0;
  }

  return GF.exp[GF.log[left] + GF.log[right]];
}

function buildGeneratorPolynomial(degree) {
  let polynomial = [1];

  for (let index = 0; index < degree; index += 1) {
    const next = new Array(polynomial.length + 1).fill(0);
    const root = GF.exp[index];

    polynomial.forEach((coefficient, coefficientIndex) => {
      next[coefficientIndex] ^= coefficient;
      next[coefficientIndex + 1] ^= gfMultiply(coefficient, root);
    });

    polynomial = next;
  }

  return polynomial;
}

function buildErrorCorrection(dataCodewords) {
  const generator = buildGeneratorPolynomial(ECC_CODEWORDS);
  const remainder = new Array(ECC_CODEWORDS).fill(0);

  dataCodewords.forEach((codeword) => {
    const factor = codeword ^ remainder.shift();

    remainder.push(0);

    for (let index = 0; index < ECC_CODEWORDS; index += 1) {
      remainder[index] ^= gfMultiply(generator[index + 1], factor);
    }
  });

  return remainder;
}

function createEmptyMatrix() {
  return {
    modules: Array.from({ length: SIZE }, () => new Array(SIZE).fill(null)),
    functionModules: Array.from({ length: SIZE }, () => new Array(SIZE).fill(false))
  };
}

function setFunctionModule(matrix, x, y, isDark) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) {
    return;
  }

  matrix.modules[y][x] = Boolean(isDark);
  matrix.functionModules[y][x] = true;
}

function drawFinderPattern(matrix, left, top) {
  for (let y = -1; y <= 7; y += 1) {
    for (let x = -1; x <= 7; x += 1) {
      const isSeparator = x === -1 || x === 7 || y === -1 || y === 7;
      const isDark = !isSeparator && (
        x === 0
        || x === 6
        || y === 0
        || y === 6
        || (x >= 2 && x <= 4 && y >= 2 && y <= 4)
      );

      setFunctionModule(matrix, left + x, top + y, isDark);
    }
  }
}

function drawAlignmentPattern(matrix, centerX, centerY) {
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      const distance = Math.max(Math.abs(x), Math.abs(y));

      setFunctionModule(matrix, centerX + x, centerY + y, distance !== 1);
    }
  }
}

function drawTimingPatterns(matrix) {
  for (let index = 8; index < SIZE - 8; index += 1) {
    const isDark = index % 2 === 0;

    setFunctionModule(matrix, index, 6, isDark);
    setFunctionModule(matrix, 6, index, isDark);
  }
}

function reserveFormatAreas(matrix) {
  for (let index = 0; index < 9; index += 1) {
    if (index !== 6) {
      setFunctionModule(matrix, 8, index, false);
      setFunctionModule(matrix, index, 8, false);
    }
  }

  for (let index = 0; index < 8; index += 1) {
    setFunctionModule(matrix, SIZE - 1 - index, 8, false);
    setFunctionModule(matrix, 8, SIZE - 1 - index, false);
  }
}

function drawFunctionPatterns(matrix) {
  drawFinderPattern(matrix, 0, 0);
  drawFinderPattern(matrix, SIZE - 7, 0);
  drawFinderPattern(matrix, 0, SIZE - 7);
  drawTimingPatterns(matrix);
  drawAlignmentPattern(matrix, 22, 22);
  reserveFormatAreas(matrix);
  setFunctionModule(matrix, 8, SIZE - 8, true);
}

function getMaskBit(mask, x, y) {
  if (mask !== 0) {
    return 0;
  }

  return (x + y) % 2 === 0 ? 1 : 0;
}

function codewordsToBits(codewords) {
  const bits = [];

  codewords.forEach((codeword) => appendBits(codeword, 8, bits));

  return bits;
}

function placeDataBits(matrix, codewords) {
  const bits = codewordsToBits(codewords);
  let bitIndex = 0;
  let movingUp = true;

  for (let right = SIZE - 1; right >= 1; right -= 2) {
    if (right === 6) {
      right -= 1;
    }

    for (let rowOffset = 0; rowOffset < SIZE; rowOffset += 1) {
      const y = movingUp ? SIZE - 1 - rowOffset : rowOffset;

      for (let offset = 0; offset < 2; offset += 1) {
        const x = right - offset;

        if (matrix.functionModules[y][x]) {
          continue;
        }

        const bit = bitIndex < bits.length ? bits[bitIndex] : 0;
        matrix.modules[y][x] = Boolean(bit ^ getMaskBit(MASK, x, y));
        bitIndex += 1;
      }
    }

    movingUp = !movingUp;
  }
}

function getFormatBits() {
  const data = (FORMAT_ECC_LOW << 3) | MASK;
  let remainder = data << 10;

  for (let bit = 14; bit >= 10; bit -= 1) {
    if (((remainder >>> bit) & 1) !== 0) {
      remainder ^= 0x537 << (bit - 10);
    }
  }

  return ((data << 10) | remainder) ^ 0x5412;
}

function drawFormatBits(matrix) {
  const bits = getFormatBits();

  for (let index = 0; index <= 5; index += 1) {
    setFunctionModule(matrix, 8, index, ((bits >>> index) & 1) !== 0);
  }

  setFunctionModule(matrix, 8, 7, ((bits >>> 6) & 1) !== 0);
  setFunctionModule(matrix, 8, 8, ((bits >>> 7) & 1) !== 0);
  setFunctionModule(matrix, 7, 8, ((bits >>> 8) & 1) !== 0);

  for (let index = 9; index < 15; index += 1) {
    setFunctionModule(matrix, 14 - index, 8, ((bits >>> index) & 1) !== 0);
  }

  for (let index = 0; index < 8; index += 1) {
    setFunctionModule(matrix, SIZE - 1 - index, 8, ((bits >>> index) & 1) !== 0);
  }

  for (let index = 8; index < 15; index += 1) {
    setFunctionModule(matrix, 8, SIZE - 15 + index, ((bits >>> index) & 1) !== 0);
  }

  setFunctionModule(matrix, 8, SIZE - 8, true);
}

export function createQrMatrix(text) {
  const bytes = Array.from(new TextEncoder().encode(text));
  const dataCodewords = bytesToDataCodewords(bytes);
  const errorCorrection = buildErrorCorrection(dataCodewords);
  const matrix = createEmptyMatrix();

  drawFunctionPatterns(matrix);
  placeDataBits(matrix, [...dataCodewords, ...errorCorrection]);
  drawFormatBits(matrix);

  return matrix.modules.map((row) => row.map(Boolean));
}

export function createQrSvg(text, options = {}) {
  const margin = options.margin ?? 3;
  const matrix = createQrMatrix(text);
  const viewSize = SIZE + margin * 2;
  const darkPath = [];

  matrix.forEach((row, y) => {
    row.forEach((isDark, x) => {
      if (isDark) {
        darkPath.push(`M${x + margin},${y + margin}h1v1h-1z`);
      }
    });
  });

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewSize} ${viewSize}" role="img" aria-label="订单核销二维码">`,
    `<rect width="${viewSize}" height="${viewSize}" fill="#fff8ee"/>`,
    `<path d="${darkPath.join('')}" fill="#142126"/>`,
    '</svg>'
  ].join('');
}
