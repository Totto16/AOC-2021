import { start, getFile } from '../utils';
function solve(input: string[], mute = false) {
    const list = input.map((a) => eval(a));
    let sum = list[0];

    for (let i = 1; i < list.length; i++) {
        const data = [sum, list[i]];
        sum = reduceSnailfish(data);
    }
    const result = magnitude(sum);
    return result;
}

function solve2(input:string[], mute = false) {
    const list = input.map((a) => eval(a));
    let maxMagnitude = -Infinity;
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
            if (i !== j) {
                const data = [list[i], list[j]];
                const sum = reduceSnailfish(data);
                maxMagnitude = Math.max(magnitude(sum), maxMagnitude);
            }
        }
    }
    return maxMagnitude;
}

function reduceSnailfish(snailfishList) {
    do {
        const res = explodeSnailfish(snailfishList);
        if (res.hasExploded) {
            snailfishList = res.list;
            continue;
        }
        const res2 = splitOnce(snailfishList);
        if (res2.hasSplit) {
            snailfishList = res2.list;
            continue;
        }
        break;
    } while (true);

    return snailfishList;
}

function splitOnce(item) {
    if (!item.isArray) {
        return {
            list: item >= 10 ? [Math.floor(item / 2), Math.ceil(item / 2)] : item,
            hasSplit: item >= 10,
        };
    }
    const leftArm = splitOnce(item[0]);
    const rightArm = leftArm.hasSplit ? { list: item[1] } : splitOnce(item[1]);
    return {
        list: [leftArm.list, rightArm.list],
        hasSplit: leftArm.hasSplit || rightArm.hasSplit,
    };
}

function explodeSnailfish(item, layer = 0) {
    if (!item.isArray) {
        return { list: item, leftSum: 0, rightSum: 0, hasExploded: false };
    }

    if (layer == 4 && item.isArray) {
        return { list: 0, leftSum: item[0], rightSum: item[1], hasExploded: true };
    }
    const leftArm = explodeSnailfish(item[0], layer + 1);
    const rightArm = leftArm.hasExploded
        ? { ...RightExplosion(item[1], leftArm.rightSum), leftSum: 0, hasExploded: true }
        : explodeSnailfish(item[1], layer + 1);

    if (rightArm.hasExploded && rightArm.leftSum !== 0) {
        leftArm.list = LeftExplosion(leftArm.list, rightArm.leftSum);
    }
    return {
        list: [leftArm.list, rightArm.list],
        leftSum: leftArm.leftSum,
        rightSum: rightArm.rightSum,
        hasExploded: leftArm.hasExploded || rightArm.hasExploded,
    };
}

function LeftExplosion(item, leftSum) {
    if (item.isArray) {
        return [item[0], LeftExplosion(item[1], leftSum)];
    } else {
        return item + leftSum;
    }
}

function RightExplosion(item, rightSum) {
    if (rightSum == 0) {
        return { list: item, rightSum };
    }
    if (!item.isArray) return { list: item + rightSum, rightSum: 0 };
    const left = RightExplosion(item[0], rightSum);
    const right = left.rightSum == 0 ? { list: item[1], rightSum: 0 } : RightExplosion(item[1], rightSum);
    return {
        list: [left.list, right.list],
        rightSum: left.rightSum + right.rightSum,
    };
}

function magnitude(snailfish) {
    const begin = JSON.stringify(snailfish);
    let res = JSON.stringify(eval(begin.replaceAll(/\[(\d*),(\d*)]/g, `3*$1+2*$2`)));
    res = JSON.stringify(eval(res.replaceAll(/\[(\d*),(\d*)]/g, `3*$1+2*$2`)));
    res = JSON.stringify(eval(res.replaceAll(/\[(\d*),(\d*)]/g, `3*$1+2*$2`)));
    res = JSON.stringify(eval(res.replaceAll(/\[(\d*),(\d*)]/g, `3*$1+2*$2`)));
    return parseInt(res);
}
function testAll() {
    const t_input = [getFile('./sample.txt', __filename)];
    const t_result = [4140];
    const t_result2 = [3993];

    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const test = solve(testInput, true);
        if (test !== testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        const testResult2 = t_result2[i];
        const test2 = solve2(testInput, true);
        if (test2 !== testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

// To Bruteforce is the best options, so it takes about 1-2 secs, more than 1 sec is moderately slow, more then 10 slow!

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true, slowness: 0 });
