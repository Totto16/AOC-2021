import { start, getFile } from '../utils';
function solve(input: string[]) {
    let result = 0;
    let previous = -1;
    for (let i = 0; i < input.length; i++) {
        const current = parseInt(input[i]);
        if (isNaN(current)) {
            console.error('Not a Number: ', input[i]);
        }
        if (previous <= -1) {
            previous = current;
            continue;
        }
        if (current > previous) {
            result++;
        }
        previous = current;
    }

    return result;
}

function solve2(input: string[]) {
    let result = 0;
    for (let i = 0; i < input.length - 3; i++) {
        const a = parseInt(input[i]);
        const b = parseInt(input[i + 1]);
        const c = parseInt(input[i + 2]);
        const d = parseInt(input[i + 3]);
        if (isNaN(a) || isNaN(b) || isNaN(c) || isNaN(d)) {
            console.error('Not a Number: ', input[i], input[i + 1], input[i + 2], input[i + 3]);
        }
        if (b + c + d > a + b + c) {
            result++;
        }
    }

    return result;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 7;
    const testResult2 = 5;

    const test = solve(testInput);
    if (test !== testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    const test2 = solve2(testInput);
    if (test2 !== testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

start(__filename, { tests: TestBoth, solve, solve2 });
