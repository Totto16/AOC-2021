import { start, getFile } from '../utils';
function solve(input: string[]): number {
    const list = input[0].split(',').map((a) => parseInt(a));
    const days = 80;
    for (let i = 0; i < days; i++) {
        for (let j = 0; j < list.length; j++) {
            const num = list[j];
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

function solve2(input: string[]): number {
    // this solution is much more faster, but for the sake of a simple solution, the first remains how it was, when solving part 1
    const list = input[0].split(',').map((a) => parseInt(a));
    const uniqueList = Array(10).fill(0);
    for (let i = 0; i < list.length; i++) {
        uniqueList[list[i]]++;
    }

    const days = 256;
    for (let i = 0; i < days; i++) {
        const num = uniqueList[0];
        uniqueList.shift();
        uniqueList.push(0);
        uniqueList[6] += num;
        uniqueList[8] += num;
    }
    return uniqueList.reduce((acc, cnt) => acc + cnt, 0);
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 5934;
    const testResult2 = 26984457539;

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
