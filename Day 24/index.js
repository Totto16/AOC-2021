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
    let regex =
        /inp\sw\nmul\sx\s0\nadd\sx\sz\nmod\sx\s26\ndiv\sz\s(-?\d+)\nadd\sx\s(-?\d+)\neql\sx\sw\neql\sx\s0\nmul\sy\s0\nadd\sy\s25\nmul\sy\sx\nadd\sy\s1\nmul\sz\sy\nmul\sy\s0\nadd\sy\sw\nadd\sy\s(-?\d+)\nmul\sy\sx\nadd\sz\sy/gi;

    input = input.join('\n');
    const parsed = [...input.matchAll(regex)].map((input) => input.slice(1, 11).map((a) => parseInt(a)));
    const startVariables = solveFormula(parsed);
    let solution = validateModelNr(startVariables, (a, b) => {
        let diff = a + b;
        let c = diff > 0 ? 9 - diff : 9; // 9 for searching maximum
        let d = diff < 0 ? 9 + diff : 9;
        return [c, d];
    });
    return solution;
}

function solve2(input, mute = false) {
    let regex =
        /inp\sw\nmul\sx\s0\nadd\sx\sz\nmod\sx\s26\ndiv\sz\s(-?\d+)\nadd\sx\s(-?\d+)\neql\sx\sw\neql\sx\s0\nmul\sy\s0\nadd\sy\s25\nmul\sy\sx\nadd\sy\s1\nmul\sz\sy\nmul\sy\s0\nadd\sy\sw\nadd\sy\s(-?\d+)\nmul\sy\sx\nadd\sz\sy/gi;

    input = input.join('\n');
    const parsed = [...input.matchAll(regex)].map((input) => input.slice(1, 11).map((a) => parseInt(a)));
    const startVariables = solveFormula(parsed);
    let solution = validateModelNr(startVariables, (a, b) => {
        let diff = a + b;
        let c = diff < 0 ? 1 - diff : 1; // 1 for searching minimum
        let d = diff > 0 ? 1 + diff : 1;
        return [c, d];
    });
    return solution;
}

function solveFormula(parsed) {
    const current = parsed.shift();

    if (current[0] == 26) {
        return current[1];
    }

    let result = { left: current[2], right: 0, children: [] };

    while (parsed.length != 0) {
        let recursion = solveFormula(parsed);
        if (typeof recursion == 'number') {
            result.right = recursion;
            break;
        }

        result.children.push(recursion);
    }
    return result;
}

function validateModelNr(element, digitGenerator) {
    let { left, right, children } = element;
    let [a, b] = digitGenerator(left, right);
    let solution = a.toString();
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        solution += validateModelNr(child, digitGenerator);
    }
    solution += b;
    return solution;
}

function solveRegular(input, testInput) {
    let parsed = input.map((a) => {
        let regex = [
            /(inp)\s(\w*)/i,
            /(add)\s(\w*)\s(\w*-?\d*)/i,
            /(mul)\s(\w*)\s(\w*-?\d*)/i,
            /(div)\s(\w*)\s(\w*-?\d*)/i,
            /(mod)\s(\w*)\s(\w*-?\d*)/i,
            /(eql)\s(\w*)\s(\w*-?\d*)/i,
        ];
        for (let i = 0; i < regex.length; i++) {
            if (a.match(regex[i])) {
                return a.match(regex[i]).slice(1);
            }
        }
    });
    inputProvider = [testInput];
    (global.w = 0), (global.x = 0), (global.y = 0), (global.z = 0);
    for (let i = 0; i < parsed.length; i++) {
        let instruction = parsed[i][0];
        switch (instruction) {
            case 'inp':
                if (inputProvider.length <= 0) {
                    console.error('Input length is not enough!');
                    process.exit(12);
                }
                eval(`global.${parsed[i][1]} = ${inputProvider.splice(0, 1)[0]}`);
                break;
            case 'add':
                eval(
                    `global.${parsed[i][1]} += ${
                        isNaN(parseInt(parsed[i][2])) ? `global.${parsed[i][2]}` : parseInt(parsed[i][2])
                    }`
                );
                break;
            case 'mul':
                eval(
                    `global.${parsed[i][1]} *= ${
                        isNaN(parseInt(parsed[i][2])) ? `global.${parsed[i][2]}` : parseInt(parsed[i][2])
                    }`
                );
                break;
            case 'div':
                // TODO maybe, add security for 0 errors
                eval(
                    `global.${parsed[i][1]} = Math.floor(global.${parsed[i][1]} /  ${
                        isNaN(parseInt(parsed[i][2])) ? `global.${parsed[i][2]}` : parseInt(parsed[i][2])
                    })`
                );
                break;
            case 'mod':
                // TODO maybe, add security for 0 errors
                eval(
                    `global.${parsed[i][1]} %= ${
                        isNaN(parseInt(parsed[i][2])) ? `global.${parsed[i][2]}` : parseInt(parsed[i][2])
                    }`
                );
                break;
            case 'eql':
                eval(
                    `global.${parsed[i][1]} = ${
                        isNaN(parseInt(parsed[i][2])) ? `global.${parsed[i][2]}` : parseInt(parsed[i][2])
                    } == global.${parsed[i][1]} ? 1 : 0`
                );
                break;
            default:
                console.error('An invalid instruction was found!');
                process.exit(14);
                break;
        }
    }
    return [global.w, global.x, global.y, global.z];
}

function testAll() {
    let t_input = [getFile('./sample.txt')];
    let t_result = [[1, 1, 1, 0]];

    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        let test = solveRegular(testInput, 14);
        if (!test.equals(testResult)) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
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

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
