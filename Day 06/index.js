function getFile(filePath, seperator = '\n') {
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
    let list = input[0].split(',').map((a) => parseInt(a));
    let days = 80;
    for (let i = 0; i < days; i++) {
        for (let j = 0; j < list.length; j++) {
            let num = list[j];
            if (num === 0) {
                list[j] = 6;
                list.push(9);
            } else {
                list[j]--;
            }
        }
        // console.log(`After ${i+1} days: ${list.join(',')}`)
    }
    return list.length;
}

function solve2(input) {
    // this solution is much more faster, but for the sake of a simple solution, the first remains how it was, when solving part 1
    let list = input[0].split(',').map((a) => parseInt(a));
    let uniqueList = Array(10).fill(0);
    for (let i = 0; i < list.length; i++) {
        uniqueList[list[i]]++;
    }

    let days = 256;
    for (let i = 0; i < days; i++) {
        let num = uniqueList[0];
        uniqueList.shift();
        uniqueList.push(0);
        uniqueList[6] += num;
        uniqueList[8] += num;
    }
    return uniqueList.reduce((acc, cnt) => acc + cnt, 0);
}

function TestBoth() {
    let testInput = getFile('./sample.txt');

    let testResult = 5934;
    let testResult2 = 26984457539;

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

async function main() {
    TestBoth();

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
