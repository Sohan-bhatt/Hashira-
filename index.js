function convertToDecimal(val, base) {
    let result = 0;
    let power = 1;
    
    for (let i = val.length - 1; i >= 0; i--) {
        let digit;
        if (val[i] >= '0' && val[i] <= '9') {
            digit = parseInt(val[i]);
        } else {
            digit = val[i].charCodeAt(0) - 'a'.charCodeAt(0) + 10;
        }
        result += digit * power;
        power *= base;
    }
    return result;
}

function lagrangeInterpolation(points, x) {
    let result = 0;
    let n = points.length;
    
    for (let i = 0; i < n; i++) {
        let term = points[i][1];
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                term = term * (x - points[j][0]) / (points[i][0] - points[j][0]);
            }
        }
        result += term;
    }
    return result;
}

const testCase1 = {
    "keys": {
        "n": 4,
        "k": 3
    },
    "1": {
        "base": "10",
        "value": "4"
    },
    "2": {
        "base": "2",
        "value": "111"
    },
    "3": {
        "base": "10",
        "value": "12"
    },
    "6": {
        "base": "4",
        "value": "213"
    }
};

const testCase2 = {
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
};

function solve(data) {
    let points = [];
    let n = data.keys.n;
    let k = data.keys.k;
    
    for (let key in data) {
        if (key !== 'keys') {
            let x = parseInt(key);
            let base = parseInt(data[key].base);
            let val = data[key].value;
            let y = convertToDecimal(val, base);
            points.push([x, y]);
        }
    }
    
    points.sort((a, b) => a[0] - b[0]);
    let selectedPoints = points.slice(0, k);
    
    let constantTerm = lagrangeInterpolation(selectedPoints, 0);
    return Math.round(constantTerm);
}

console.log("Test Case 1 - Constant term:", solve(testCase1));
console.log("Test Case 2 - Constant term:", solve(testCase2));