// polynomial.js

// Step 1: Import 'fs' to read JSON file
const fs = require('fs');

// Step 2: Read JSON file passed as command-line argument
// Example: node polynomial.js test1.json
const fileName = process.argv[2];
const rawData = fs.readFileSync(fileName);
const input = JSON.parse(rawData);

// Step 3: Extract keys
const n = input.keys.n; // number of points given
const k = input.keys.k; // minimum required (degree + 1)

// Step 4: Convert all base/value pairs to decimal integers
let x = []; // base values
let y = []; // corresponding values
for (let key in input) {
  if (key !== "keys") {
    let base = parseInt(input[key].base);
    let valueStr = input[key].value;
    let value = parseInt(valueStr, base); // convert to decimal
    x.push(parseInt(key));
    y.push(value);
  }
}

// Step 5: Build system of equations to solve coefficients
// Polynomial: a*x^m + b*x^(m-1) + ... + c
// We only need constant 'c'
let m = k - 1; // degree of polynomial
let A = [];
let B = [];

// Use first 'k' points
for (let i = 0; i < k; i++) {
  let row = [];
  for (let power = m; power >= 0; power--) {
    row.push(Math.pow(x[i], power));
  }
  A.push(row);
  B.push(y[i]);
}

// Step 6: Solve linear equations using Gaussian elimination
function gaussianElimination(A, B) {
  let n = A.length;
  for (let i = 0; i < n; i++) {
    // Make diagonal element 1
    let factor = A[i][i];
    for (let j = 0; j < n; j++) {
      A[i][j] /= factor;
    }
    B[i] /= factor;

    // Make below rows zero
    for (let k = i + 1; k < n; k++) {
      let factor2 = A[k][i];
      for (let j = 0; j < n; j++) {
        A[k][j] -= factor2 * A[i][j];
      }
      B[k] -= factor2 * B[i];
    }
  }

  // Back substitution
  let X = new Array(n);
  for (let i = n - 1; i >= 0; i--) {
    X[i] = B[i];
    for (let j = i + 1; j < n; j++) {
      X[i] -= A[i][j] * X[j];
    }
  }
  return X;
}

let coeffs = gaussianElimination(A, B);

// Step 7: Print only constant 'c' value (last coefficient)
console.log(coeffs[coeffs.length - 1]);