function baseToBigInt(valueStr, base) {
    const digits = '0123456789abcdefghijklmnopqrstuvwxyz';
    let result = 0n;
    const baseBigInt = BigInt(base);

    for (const char of valueStr) {
        const digitValue = digits.indexOf(char.toLowerCase());

        if (digitValue === -1 || BigInt(digitValue) >= baseBigInt) {
            throw new Error(`Invalid digit '${char}' for base ${base}.`);
        }

        result = result * baseBigInt + BigInt(digitValue);
    }
    return result;
}

function findPolynomialCoefficients(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        const k = data.keys.k;
        const degree = k - 1;

        if (degree < 0) return { degree: -1, coefficients: [] };
        if (degree === 0) return { degree: 0, coefficients: ["1"] };

        const roots = [];
        for (let i = 1; i <= degree; i++) {
            const rootData = data[i.toString()];
            if (!rootData) {
                throw new Error(`Missing root data for key "${i}"`);
            }
            const base = parseInt(rootData.base, 10);
            const value = rootData.value;
            roots.push(baseToBigInt(value, base));
        }

        let coeffs = [1n];

        for (const root of roots) {
            const currentDegree = coeffs.length - 1;
            const newCoeffs = new Array(currentDegree + 2).fill(0n);

            for (let i = 0; i < coeffs.length; i++) {
                newCoeffs[i] = coeffs[i];
            }

            for (let i = 0; i < coeffs.length; i++) {
                newCoeffs[i + 1] -= root * coeffs[i];
            }

            coeffs = newCoeffs;
        }

        const output = {
            degree: degree,
            coefficients: coeffs.map(c => c.toString())
        };

        return output;

    } catch (error) {
        console.error("An error occurred:", error.message);
        return null;
    }
}

const testCaseJson = `{
"keys": {
    "n": 10,
    "k": 7
  },
  "1": {
    "base": "6",
    "value": "13444211440455345511"
  },
  "2": {
    "base": "15",
    "value": "aed7015a346d635"
  },
  "3": {
    "base": "15",
    "value": "6aeeb69631c227c"
  },
  "4": {
    "base": "16",
    "value": "e1b5e05623d881f"
  },
  "5": {
    "base": "8",
    "value": "316034514573652620673"
  },
  "6": {
    "base": "3",
    "value": "2122212201122002221120200210011020220200"
  },
  "7": {
    "base": "3",
    "value": "20120221122211000100210021102001201112121"
  },
  "8": {
    "base": "6",
    "value": "20220554335330240002224253"
  },
  "9": {
    "base": "12",
    "value": "45153788322a1255483"
  },
  "10": {
    "base": "7",
    "value": "1101613130313526312514143"
  }
}`;

const result = findPolynomialCoefficients(testCaseJson);

if (result) {
    console.log("--- Hashira Placements Assignment Output ---");
    console.log(`\nPolynomial Degree (m): ${result.degree}`);
    console.log("\nCoefficients (for x^6 down to the constant term):");
    console.log(JSON.stringify(result.coefficients, null, 2));
}
