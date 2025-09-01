// ---------- Base conversion (exact BigInt) ----------
function charToDigit(ch) {
  if (ch >= '0' && ch <= '9') return BigInt(ch.charCodeAt(0) - '0'.charCodeAt(0));
  if (ch >= 'a' && ch <= 'z') return BigInt(ch.charCodeAt(0) - 'a'.charCodeAt(0) + 10);
  if (ch >= 'A' && ch <= 'Z') return BigInt(ch.charCodeAt(0) - 'A'.charCodeAt(0) + 10);
  throw new Error(`Invalid digit: ${ch}`);
}

function convertToDecimalBig(val, base) {
  if (!(Number.isInteger(base) && base >= 2 && base <= 36)) {
    throw new Error(`Base must be an integer in [2,36], got ${base}`);
  }
  const b = BigInt(base);

  let sign = 1n;
  let i = 0;
  if (val[0] === '+') { i = 1; }
  else if (val[0] === '-') { sign = -1n; i = 1; }

  let res = 0n;
  for (; i < val.length; i++) {
    const ch = val[i];
    const d = charToDigit(ch);
    if (d >= b) throw new Error(`Digit '${ch}' not valid in base ${base}`);
    res = res * b + d;
  }
  return res * sign;
}

// ---------- Exact rational arithmetic over BigInt ----------
function gcdBig(a, b) {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b !== 0n) { const t = a % b; a = b; b = t; }
  return a;
}
function makeFrac(num, den = 1n) {
  if (den === 0n) throw new Error('Zero denominator');
  if (den < 0n) { num = -num; den = -den; }
  const g = gcdBig(num, den);
  return { num: num / g, den: den / g };
}
function addFrac(a, b) { return makeFrac(a.num * b.den + b.num * a.den, a.den * b.den); }
function mulFrac(a, b) { return makeFrac(a.num * b.num, a.den * b.den); }
function divFrac(a, b) { return makeFrac(a.num * b.den, a.den * b.num); }

// Lagrange interpolation polynomial evaluated at x = 0
// points: Array<[x(BigInt), y(BigInt)]>, length = k
function lagrangeAtZeroBig(points) {
  let sum = makeFrac(0n, 1n);
  const n = points.length;
  for (let i = 0; i < n; i++) {
    // term = y_i * Π_{j≠i} (0 - x_j) / (x_i - x_j)
    let term = makeFrac(points[i][1], 1n);
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const num = -points[j][0];               // (0 - x_j)
      const den = points[i][0] - points[j][0]; // (x_i - x_j)
      term = mulFrac(term, makeFrac(num, den));
    }
    sum = addFrac(sum, term);
  }
  if (sum.den !== 1n) {
    // For a polynomial with integer coefficients and integer x's, the constant should be integer.
    throw new Error(`Non-integer result: ${sum.num}/${sum.den}`);
  }
  return sum.num; // BigInt constant term
}

// ---------- High-level solve ----------
function solveExact(data) {
  const k = data.keys.k;
  let points = [];
  for (const key in data) {
    if (key === 'keys') continue;
    const x = BigInt(parseInt(key, 10));
    const base = parseInt(data[key].base, 10);
    const y = convertToDecimalBig(data[key].value, base);
    points.push([x, y]);
  }
  points.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
  const selected = points.slice(0, k);
  return lagrangeAtZeroBig(selected);
}

// ---------- Your test cases ----------
const testCase1 = {
  "keys": { "n": 4, "k": 3 },
  "1": { "base": "10", "value": "4" },
  "2": { "base": "2",  "value": "111" },
  "3": { "base": "10", "value": "12" },
  "6": { "base": "4",  "value": "213" }
};

const testCase2 = {
  "keys": { "n": 10, "k": 7 },
  "1":  { "base": "6",  "value": "13444211440455345511" },
  "2":  { "base": "15", "value": "aed7015a346d635" },
  "3":  { "base": "15", "value": "6aeeb69631c227c" },
  "4":  { "base": "16", "value": "e1b5e05623d881f" },
  "5":  { "base": "8",  "value": "316034514573652620673" },
  "6":  { "base": "3",  "value": "2122212201122002221120200210011020220200" },
  "7":  { "base": "3",  "value": "20120221122211000100210021102001201112121" },
  "8":  { "base": "6",  "value": "20220554335330240002224253" },
  "9":  { "base": "12", "value": "45153788322a1255483" },
  "10": { "base": "7",  "value": "1101613130313526312514143" }
};

// ---------- Demo ----------
console.log("Test Case 1 - Constant term:", solveExact(testCase1).toString());
console.log("Test Case 2 - Constant term:", solveExact(testCase2).toString());
