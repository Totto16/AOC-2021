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

function solve(input, mute = false, testInput) {
    let parsed = input.map((a) => a.split(''));
    let [result, _] = simulate(parsed);
    // to show the grid!
    //_.printNested();
    return result;
}

function simulate(parsed) {
    let height = parsed.length;
    let width = parsed[0].length;
    let moves = [
        ['>', 0, 1], // x,y movement, it moves one to the right (also wraps around!)
        ['v', 1, 0], // x,y movement, it moves one down (also wraps around!)
    ];
    let steps = 0;
    let someoneMoved = false;
    do {
        steps++;
        someoneMoved = false;
        for (let i = 0; i < 2; i++) {
            let temp = parsed.copy();
            for (let j = 0; j < height; j++) {
                for (let k = 0; k < width; k++) {
                    if (temp[j][k] == moves[i][0]) {
                        if (temp[(j + parseInt(moves[i][1])) % height][(k + parseInt(moves[i][2])) % width] == '.') {
                            someoneMoved = true;
                            parsed[(j + moves[i][1]) % height][(k + moves[i][2]) % width] = moves[i][0];
                            parsed[j][k] = '.';
                        }
                    }
                }
            }
        }
    } while (someoneMoved);
    return [steps, parsed];
}

function testAll() {
    let t_input = [getFile('./sample.txt')];
    let t_result = [58];

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
    }
}

function initPrototype() {
    //some useful Functions, copy from Day 09 and further along
    Object.defineProperty(Array.prototype, 'equals', {
        value: function (second, amount = -1) {
            let first = this;
            if (!Array.isArray(first) || !Array.isArray(second)) {
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

    Object.defineProperty(Array.prototype, 'printNested', {
        value: function (mapFunction = (a) => (a == 0 ? '.' : a.toString()), seperator = ' ', EOL = '\n') {
            let array = this;
            let error = false;
            let toLog = array
                .map((a) => {
                    if (!Array.isArray(a)) {
                        error = true;
                    }
                    return a.map((b) => mapFunction(b)).join(seperator);
                })
                .join(EOL);
            if (error) {
                return false;
            }
            console.log(toLog);
            return true;
        },
    });

    Object.defineProperty(Array.prototype, 'copy', {
        value: function () {
            return JSON.parse(JSON.stringify(this));
        },
    });

    Object.defineProperty(Array.prototype, 'count', {
        value: function (countFunction = (a) => a, start = 0) {
            let array = this;
            let reduceFunction = (acc, el) => {
                if (!Array.isArray(el)) {
                    return acc + countFunction(el);
                }
                return acc + el.reduce(reduceFunction, start);
            };

            let result = array.reduce(reduceFunction, start);
            return result;
        },
    });

    Object.defineProperty(Array.prototype, 'combine', {
        value: function (second, flat = true) {
            let first = this;
            if (!Array.isArray(first) || !Array.isArray(second)) {
                return [];
            }
            let result = [];
            for (let i = 0; i < first.length; i++) {
                for (let j = 0; j < second.length; j++) {
                    let p = [first[i], second[j]];
                    if (flat && (Array.isArray(first[i]) || Array.isArray(second[j]))) {
                        p = p.flat();
                    }
                    result.push(p);
                }
            }
            return result;
        },
    });

    Object.defineProperty(Array.prototype, 'fillElements', {
        value: function (start = 0, end = 1000) {
            let first = this;
            if (!Array.isArray(first)) {
                return [];
            }
            if (first.length > 3) {
                return first;
            }
            let newArray = [];
            for (let i = 0; i < first.length; i++) {
                if (first[i] === '..') {
                    let startNumber = i > 0 ? first[i - 1] : start;
                    let endNumber = i < first.length - 1 ? first[i + 1] : end;
                    let diff = endNumber >= startNumber ? 1 : -1;
                    let compareFunction = endNumber >= startNumber ? (a, b) => a <= b : (a, b) => a >= b;
                    for (let j = startNumber; compareFunction(j, endNumber); j += diff) {
                        newArray.push(j);
                    }
                }
            }
            return newArray;
        },
    });

    Object.defineProperty(Array.prototype, 'print', {
        value: function () {
            try {
                let toPrint = JSON.stringify(this);
                console.log(toPrint);
            } catch (e) {
                return false;
            }
            return;
        },
    });
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
    // This solution is slow since it's also a bruteforce, it takes some time to test all possible low solutions, there are many shorthand evaluations, it breaks (or continues) in certain cases!
    if (autoSkipSlow) {
        console.log('Auto Skipped Moderately Slow');
        process.exit(43);
    }

    slowWarning();
    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    console.log(`Part 2: 'This is the end of this year's AOC!!!'`);
}

main();
