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
    let t_input = [getFile('./sample.txt', __filename)];
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

let { start, getFile } = require('../utils.js');

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true });
