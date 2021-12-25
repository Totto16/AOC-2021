function solve(input) {
    // pos, depth
    let result = [0, 0];
    for (let i = 0; i < input.length; i++) {
        let current = input[i];
        if (current.includes('forward')) {
            let number = parseInt(current.replace(/forward /i, ''));
            result[0] += number;
        } else if (current.includes('down')) {
            let number = parseInt(current.replace(/down /i, ''));
            result[1] += number;
        } else if (current.includes('up')) {
            let number = parseInt(current.replace(/up /i, ''));
            result[1] -= number;
        } else {
            console.warn('Not recognized: %s', current);
        }
    }
    return result.reduce((a, b) => a * b, 1);
}

function solve2(input2) {
    // pos, depth, aim
    let result = [0, 0, 0];
    for (let i = 0; i < input2.length; i++) {
        let current = input2[i];
        if (current.includes('forward')) {
            let number = parseInt(current.replace(/forward /i, ''));
            result[0] += number;
            result[1] += result[2] * number;
        } else if (current.includes('down')) {
            let number = parseInt(current.replace(/down /i, ''));
            result[2] += number;
        } else if (current.includes('up')) {
            let number = parseInt(current.replace(/up /i, ''));
            result[2] -= number;
        } else {
            console.warn('Not recognized: %s', current);
        }
    }
    return result[0] * result[1];
}

function TestBoth() {
    let testInput = getFile('./sample.txt', __filename);

    let testResult = 150;
    let testResult2 = 900;

    let test = solve(testInput);
    if (test != testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    let test2 = solve2(testInput);
    if (test2 != testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

let { start, getFile } = require('../utils.js');

start(__filename, { tests: TestBoth, solve, solve2 });
