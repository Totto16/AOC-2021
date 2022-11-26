import { start, getFile } from '../utils';
function solve(input: string[]) {
    const crabs = input[0].split(',').map((a) => parseInt(a));
    const options = [];

    const max = crabs.reduce((acc, c) => Math.max(c, acc), 0);
    const lowest = crabs.reduce((acc, c) => Math.min(c, acc), max);
    for (let i = lowest; i < max; i++) {
        options[i - lowest] = crabs.reduce((acc, crab) => {
            return acc + Math.abs(crab - i);
        }, 0);
    }
    const result = options.reduce((acc, c) => Math.min(c, acc), Infinity);
    const pos = lowest + options.indexOf(result);
    return result;
}

function solve2(input: string[]) {
    // this is slow :(
    const crabs = input[0].split(',').map((a) => parseInt(a));
    const options = [];

    const max = crabs.reduce((acc, c) => Math.max(c, acc), 0);
    const lowest = crabs.reduce((acc, c) => Math.min(c, acc), max);
    for (let i = lowest; i < max; i++) {
        options[i - lowest] = crabs.reduce((acc, crab) => {
            return acc + add_fact(Math.abs(crab - i));
        }, 0);
    }
    const result = options.reduce((acc, c) => Math.min(c, acc), Infinity);
    const pos = lowest + options.indexOf(result);
    return result;
}

function add_fact(number) {
    //additive factorial, or 1 + 2 + ... + number;
    return Array.from(
        Array(number + 1)
            .fill(0)
            .keys()
    ).reduce((acc, b) => acc + b, 0);
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 37;
    const testResult2 = 168;

    const test = solve(testInput);
    if (test !== testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    const test2 = solve2(testInput, false);
    if (test2 !== testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

// I could definitely improve the algorithm to make it faster, like I did in many after that, but just for fun I'll let this use the slow Functionality!

start(__filename, { tests: TestBoth, solve, solve2 }, { slowness: 0 });
