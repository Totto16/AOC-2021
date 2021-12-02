//SOME NASTY BUG IS IN HERE!!! IT Doesn'T WORK

function solve(input) {
    let result = [0, 0, 0];

    let previous = null;
    for (let i = 1; i < input.length; i++) {
        let current = input[i];
        previous = input[i - 1];
        if (isNaN(current)) {
            // console.warn("isNAN " + current)
        }

        let num = current == previous ? 1 : current > previous ? 2 : 0;
        console.log(num >= 3 || num < 0 ? num : '');
        result[num] = result[num] + 1;
    }
    return result;
}

let testInput = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263];

let testResult = 7;

let test = solve(testInput);
if (test[2] != testResult && test.reduce((a, b) => a + b, 0) != testInput.length) {
    console.error(`Wrong Solving Mechanism: Got '${test[2]}' but expected '${testResult}'`);
    process.exit(69);
}

let realInput = require('fs')
    .readFileSync('./input.txt')
    .toString()
    .replace('\r', '')
    .split('\n')
    .filter((a) => a !== '');

let Answer = solve(realInput);
if (Answer.reduce((a, b) => a + b, 0) != realInput.length) {
    console.error(
        `Wrong Solving Mechanism, Length not matching: ${Answer.reduce((a, b) => a + b, 0)} vs actual Length of ${
            realInput.length
        }`
    );
    process.exit(69);
}

console.log(`Answer\n${Answer[2]}`);



/* function getFile(filePath, seperator = '\n') {
    let result = require('fs')
        .readFileSync(filePath)
        .toString()
        .split(seperator)
        .filter((a) => a != '');
    if (result.includes('\r')) {
        result = result.replaceAll(/\r/, '');
    }
    return result;
}

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
    let testInput = getFile('./sample.txt');

    let testResult = 150;
    let testResult2 = 900;

    let test = solve(testInput);
    if (test != testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    let test2 = solve2(testInput2);
    if (test2 != testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

async function main() {
    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);

    let realInput2 = getFile('./input2.txt');
    let Answer2 = solve2(realInput2);
    console.log(`Part 2: '${Answer2}'`);
}

main();
 */