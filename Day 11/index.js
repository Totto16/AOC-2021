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
    let flashes = 0;
    let parsed = input.map((a) => a.split('').map((b) => parseInt(b)));
    let steps = 100;
    for (let i = 0; i < steps; i++) {
        // step 1
        parsed = parsed.map((a) => a.map((b) => b + 1));

        //step 2
        let flashed_now = 0;
        let filtered = [];
        do {
            flashed_now = 0;
            for (let j = 0; j < parsed.length; j++) {
                for (let k = 0; k < parsed[0].length; k++) {
                    if (!filtered.includesArray([j, k])) {
                        let curr = parsed[j][k];
                        if (curr > 9) {
                            filtered.push([j, k]);
                            flashed_now++;
                            parsed = flash(parsed, j, k);
                        }
                    }
                }
            }
        } while (flashed_now != 0);
        //step 3
        parsed = parsed.map((a) =>
            a.map((b) => {
                if (b > 9) {
                    flashes++;
                    return 0;
                }
                return b;
            })
        );
    }

    return flashes;
}

function solve2(input) {
    let parsed = input.map((a) => a.split('').map((b) => parseInt(b)));
    let i = 0;
    do {
        // step 1
        parsed = parsed.map((a) => a.map((b) => b + 1));

        //step 2
        let flashed_now = 0;
        let filtered = [];
        do {
            flashed_now = 0;
            for (let j = 0; j < parsed.length; j++) {
                for (let k = 0; k < parsed[0].length; k++) {
                    if (!filtered.includesArray([j, k])) {
                        let curr = parsed[j][k];
                        if (curr > 9) {
                            filtered.push([j, k]);
                            flashed_now++;
                            parsed = flash(parsed, j, k);
                        }
                    }
                }
            }
        } while (flashed_now != 0);

        //step 3
        let flashes = 0;
        parsed = parsed.map((a) =>
            a.map((b) => {
                if (b > 9) {
                    flashes++;
                    return 0;
                }
                return b;
            })
        );
        if (flashes == parsed.length * parsed[0].length) {
            return i + 1;
        }
        i++;
    } while (i < 100000); // 100000 is the max iterations after that we give up!

    return -1;
}

function flash(parsed, j, k) {
    if (j > 0) {
        parsed[j - 1][k]++;
        if (k > 0) {
            parsed[j - 1][k - 1]++;
        }
        if (k < parsed[0].length - 1) {
            parsed[j - 1][k + 1]++;
        }
    }
    if (j < parsed.length - 1) {
        parsed[j + 1][k]++;
        if (k > 0) {
            parsed[j + 1][k - 1]++;
        }
        if (k < parsed[0].length - 1) {
            parsed[j + 1][k + 1]++;
        }
    }
    if (k > 0) {
        parsed[j][k - 1]++;
    }
    if (k < parsed[0].length - 1) {
        parsed[j][k + 1]++;
    }
    return parsed;
}

function initPrototype() {
    //some useful Functions, copy from Day 09
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

    let testResult = 1656;
    let testResult2 = 195;

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
    if (doTests) {
        TestBoth();
    }

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
