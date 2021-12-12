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
    let result = 0;
    let parsed = input.map((a) => a.split('').map((num) => parseInt(num)));
    let lava_tubes = Array(parsed.length)
        .fill(0)
        .map((a) => Array(parsed.length).fill(0));

    for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[0].length; j++) {
            let current = parsed[i][j];
            let isLowPoint = true;
            if (i > 0) {
                isLowPoint &= parsed[i - 1][j] > current;
            }
            if (i < parsed.length - 1) {
                isLowPoint &= parsed[i + 1][j] > current;
            }
            if (j > 0) {
                isLowPoint &= parsed[i][j - 1] > current;
            }
            if (j < parsed[0].length - 1) {
                isLowPoint &= parsed[i][j + 1] > current;
            }

            if (isLowPoint) {
                lava_tubes[i][j] = current + 1;
            }
        }
    }
    result = lava_tubes.map((a) => a.reduce((a, b) => a + b, 0)).reduce((a, b) => a + b, 0);
    return result;
}

function solve2(input) {
    let parsed = input.map((a) => a.split('').map((num) => parseInt(num)));
    let lava_tubes = Array(parsed.length)
        .fill(0)
        .map((a) => Array(parsed.length).fill(0));

    for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[0].length; j++) {
            let current = parsed[i][j];
            let isLowPoint = true;
            if (i > 0) {
                isLowPoint &= parsed[i - 1][j] > current;
            }
            if (i < parsed.length - 1) {
                isLowPoint &= parsed[i + 1][j] > current;
            }
            if (j > 0) {
                isLowPoint &= parsed[i][j - 1] > current;
            }
            if (j < parsed[0].length - 1) {
                isLowPoint &= parsed[i][j + 1] > current;
            }

            if (isLowPoint) {
                lava_tubes[i][j] = current + 1;
            }
        }
    }

    let basins = [];
    for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[0].length; j++) {
            let current = parsed[i][j];
            if (lava_tubes[i][j] > 0) {
                basins[basins.length] = checkAround(parsed, [i, j], [[i, j]])[0] + 1;
            }
        }
    }
    basins = basins.sort((a, b) => b - a); //sort it so, that the highest are at the beginning
    return basins[0] * basins[1] * basins[2]; // the three largest
}

function checkAround(parsed, initialPos, alreadyChecked) {
    // returns [answ, alreadyChecked] !!!
    let result = 0;
    let [k, l] = initialPos;

    first: if (k > 0) {
        if (alreadyChecked.includesArray([k - 1, l])) {
            break first;
        } else {
            alreadyChecked.push([k - 1, l]);
        }

        let act = parsed[k - 1][l];
        if (act < 9 /* && act >  parsed[k][l] */) {
            // second condition isn't required!
            let [answ, alch] = checkAround(parsed, [k - 1, l], alreadyChecked);
            result += 1 + answ;
            alreadyChecked.push(alch);
        }
    }

    second: if (k < parsed.length - 1) {
        if (alreadyChecked.includesArray([k + 1, l])) {
            break second;
        } else {
            alreadyChecked.push([k + 1, l]);
        }

        let act = parsed[k + 1][l];
        if (act < 9 /* && act >  parsed[k][l] */) {
            let [answ, alch] = checkAround(parsed, [k + 1, l], alreadyChecked);
            result += 1 + answ;
            alreadyChecked.push(alch);
        }
    }

    third: if (l > 0) {
        if (alreadyChecked.includesArray([k, l - 1])) {
            break third;
        } else {
            alreadyChecked.push([k, l - 1]);
        }

        let act = parsed[k][l - 1];
        if (act < 9 /* && act >  parsed[k][l] */) {
            let [answ, alch] = checkAround(parsed, [k, l - 1], alreadyChecked);
            result += 1 + answ;
            alreadyChecked.push(alch);
        }
    }

    forth: if (l < parsed[0].length - 1) {
        if (alreadyChecked.includesArray([k, l + 1])) {
            break forth;
        } else {
            alreadyChecked.push([k, l + 1]);
        }

        let act = parsed[k][l + 1];
        if (act < 9 /* && act >  parsed[k][l] */) {
            let [answ, alch] = checkAround(parsed, [k, l + 1], alreadyChecked);
            result += 1 + answ;
            alreadyChecked.push(alch);
        }
    }
    alreadyChecked = [...new Set(alreadyChecked)];
    return [result, alreadyChecked];
}

function initPrototype() {
    //some usefull Functions, by the way, I <3 JS and its capabilities (also labels in ifs with break option <3)
    Object.defineProperty(Array.prototype, 'equals', {
        value: function (first) {
            let second = this;
            return (
                Array.isArray(first) &&
                Array.isArray(second) &&
                first.length === second.length &&
                first.every((a, index) => a === second[index])
            );
        },
    });

    Object.defineProperty(Array.prototype, 'includesArray', {
        value: function (singleArray) {
            let BigArray = this;
            return BigArray.reduce((acc, cnt) => cnt.equals(singleArray) | acc, false);
        },
    });
}

function TestBoth() {
    let testInput = getFile('./sample.txt');

    let testResult = 15;
    let testResult2 = 1134;

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
    initPrototype();
    TestBoth();

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
