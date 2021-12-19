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
function solve(input, mute = false) {
    let list = input.map((a) => eval(a));
    let sum = list[0];

    for (let i = 1; i < list.length; i++) {
        let data = [sum, list[i]];
        sum = reduceSnailfish(data);
    }
    let result = magnitude(sum);
    return result;
}

function solve2(input, mute = false) {
    let list = input.map((a) => eval(a));
    let maxMagnitude = -Infinity;
    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < list.length; j++) {
            if (i != j) {
                let data = [list[i], list[j]];
                let sum = reduceSnailfish(data);
                maxMagnitude = Math.max(magnitude(sum), maxMagnitude);
            }
        }
    }
    return maxMagnitude;
}

function reduceSnailfish(snailfishList) {
    do {
        let res = explodeSnailfish(snailfishList);
        if (res.hasExploded) {
            snailfishList = res.list;
            continue;
        }
        let res2 = splitOnce(snailfishList);
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
    let leftArm = splitOnce(item[0]);
    let rightArm = leftArm.hasSplit ? { list: item[1] } : splitOnce(item[1]);
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
    let leftArm = explodeSnailfish(item[0], layer + 1);
    let rightArm = leftArm.hasExploded
        ? { ...RightExplosion(item[1], leftArm.rightSum), leftSum: 0, hasExploded: true }
        : explodeSnailfish(item[1], layer + 1);

    if (rightArm.hasExploded && rightArm.leftSum != 0) {
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
    let left = RightExplosion(item[0], rightSum);
    let right = left.rightSum == 0 ? { list: item[1], rightSum: 0 } : RightExplosion(item[1], rightSum);
    return {
        list: [left.list, right.list],
        rightSum: left.rightSum + right.rightSum,
    };
}

function magnitude(snailfish) {
    let begin = JSON.stringify(snailfish);
    let res = JSON.stringify(eval(begin.replaceAll(/\[(\d*),(\d*)\]/gi, `3*$1+2*$2`)));
    res = JSON.stringify(eval(res.replaceAll(/\[(\d*),(\d*)\]/gi, `3*$1+2*$2`)));
    res = JSON.stringify(eval(res.replaceAll(/\[(\d*),(\d*)\]/gi, `3*$1+2*$2`)));
    res = JSON.stringify(eval(res.replaceAll(/\[(\d*),(\d*)\]/gi, `3*$1+2*$2`)));
    return parseInt(res);
}
function testAll() {
    let t_input = [getFile('./sample.txt')];
    let t_result = [4140];
    let t_result2 = [3993];

    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        let test = solve(testInput, true);
        if (test != testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        const testResult2 = t_result2[i];
        let test2 = solve2(testInput, true);
        if (test2 != testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

function initPrototype() {
    //some useful Functions, copy from Day 09
    Object.defineProperty(Array.prototype, 'equals', {
        value: function (second, amount = -1) {
            let first = this;
            if (!first.isArray || !second.isArray) {
                return false;
            }
            if (amount > 0) {
                let length = first.length === second.length ? first.length : Math.min(first.length, second.length);
                if (length < amount) {
                    return false;
                }
                for (let i = 0; i < amount; i++) {
                    if (first[i] != second[i]) {
                        return false;
                    }
                }
                return true;
            }
            return first.length === second.length && first.every((a, index) => a === second[index]);
        },
    });

    Object.defineProperty(Array.prototype, 'includesArray', {
        value: function (singleArray) {
            let BigArray = this;
            return BigArray.reduce((acc, cnt) => cnt.equals(singleArray) | acc, false);
        },
    });

    Object.defineProperty(Array.prototype, 'isArray', {
        value: function () {
            return true;
        },
    });

    /*  Object.defineProperty(Number.prototype, 'isArray', {
        value: function () {
            return false;
        },
    }); */ // Literals don't have this prototype
}

function slowWarning() {
    process.on('SIGINT', () => {
        process.exit(0);
    });
    if (process.send) {
        process.send(JSON.stringify({ type: 'error', message: 'Attention: Moderately Slow' }));
    }
}

async function main() {
    let doTests = true;
    let autoSkipSlow = false;
    process.argv.forEach((string) => {
        if (string.startsWith('--')) {
            let arg = string.replace('--', '').toLowerCase();
            if (arg === 'no-tests') {
                doTests = false;
            } else if (arg === 'autoskipslow') {
                autoSkipSlow = true;
            }
        }
    });

    initPrototype();
    if (doTests) {
        testAll();
    }

    // To Bruteforce is the best options, so it takes about 1-2 secs, more than 1 sec is moderately slow, more then 10 slow!
    if (autoSkipSlow) {
        console.log('Auto Skipped Moderately Slow');
        process.exit(43);
    }
    slowWarning();
    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
