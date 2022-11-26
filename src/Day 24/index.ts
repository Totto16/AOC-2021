import { start, getFile } from '../utils';
function solve(_input: string[], mute = false) {
    const regex =
        /inp\sw\nmul\sx\s0\nadd\sx\sz\nmod\sx\s26\ndiv\sz\s(-?\d+)\nadd\sx\s(-?\d+)\neql\sx\sw\neql\sx\s0\nmul\sy\s0\nadd\sy\s25\nmul\sy\sx\nadd\sy\s1\nmul\sz\sy\nmul\sy\s0\nadd\sy\sw\nadd\sy\s(-?\d+)\nmul\sy\sx\nadd\sz\sy/gi;

    const input: string = _input.join('\n');
    const parsed = [...input.matchAll(regex)].map((input) => input.slice(1, 11).map((a) => parseInt(a)));
    const startVariables = solveFormula(parsed);
    const solution = validateModelNr(startVariables, (a, b) => {
        const diff = a + b;
        const c = diff > 0 ? 9 - diff : 9; // 9 for searching maximum
        const d = diff < 0 ? 9 + diff : 9;
        return [c, d];
    });
    return solution;
}

function solve2(input: string[], mute = false) {
    const regex =
        /inp\sw\nmul\sx\s0\nadd\sx\sz\nmod\sx\s26\ndiv\sz\s(-?\d+)\nadd\sx\s(-?\d+)\neql\sx\sw\neql\sx\s0\nmul\sy\s0\nadd\sy\s25\nmul\sy\sx\nadd\sy\s1\nmul\sz\sy\nmul\sy\s0\nadd\sy\sw\nadd\sy\s(-?\d+)\nmul\sy\sx\nadd\sz\sy/gi;

    input = input.join('\n');
    const parsed = [...input.matchAll(regex)].map((input) => input.slice(1, 11).map((a) => parseInt(a)));
    const startVariables = solveFormula(parsed);
    const solution = validateModelNr(startVariables, (a, b) => {
        const diff = a + b;
        const c = diff < 0 ? 1 - diff : 1; // 1 for searching minimum
        const d = diff > 0 ? 1 + diff : 1;
        return [c, d];
    });
    return solution;
}

function solveFormula(parsed) {
    const current = parsed.shift();

    if (current[0] == 26) {
        return current[1];
    }

    const result = { left: current[2], right: 0, children: [] };

    while (parsed.length !== 0) {
        const recursion = solveFormula(parsed);
        if (typeof recursion == 'number') {
            result.right = recursion;
            break;
        }

        result.children.push(recursion);
    }
    return result;
}

function validateModelNr(element, digitGenerator) {
    const { left, right, children } = element;
    const [a, b] = digitGenerator(left, right);
    let solution = a.toString();
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        solution += validateModelNr(child, digitGenerator);
    }
    solution += b;
    return solution;
}

function solveRegular(input, testInput) {
    const parsed = input.map((a) => {
        const regex = [
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
        const instruction = parsed[i][0];
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
    const t_input = [getFile('./sample.txt', __filename)];
    const t_result = [[1, 1, 1, 0]];

    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const test = solveRegular(testInput, 14);
        if (!test.equals(testResult)) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
    }
}

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true });
