function getFile(filePath, seperator = '\n') {
    let result = require('fs')
        .readFileSync(filePath)
        .toString()
        .split(seperator)
        .filter((a) => a != '');
    if (result.some((a) => a.split('').includes('\r'))) {
        result = result.map((a) => a.replaceAll(/\r/g, ''));
    }
    return result;
}

function solve(input) {
    let crabs = input[0].split(',').map((a) => parseInt(a));
    let options = [];

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

function solve2(input) {
    // this is slow :(
    let crabs = input[0].split(',').map((a) => parseInt(a));
    let options = [];

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
    let testInput = getFile('./sample.txt');

    let testResult = 37;
    let testResult2 = 168;

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

function slowWarning() {
    process.on('SIGINT', () => {
        process.exit(0);
    });
    process.send(JSON.stringify({ type: 'error', message: 'ATTENTION: SLOW' }));
}

async function main() {
    TestBoth();

    slowWarning();
    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
