import { start, getFile } from '../utils';
function solve(input: string[]) {
    let result = 0;
    const foundSyntaxErrors = [];
    for (let i = 0; i < input.length; i++) {
        let currentLine = input[i];
        let lastLine = currentLine;
        do {
            lastLine = currentLine;
            currentLine = currentLine
                .replaceAll(/\(\)/g, '')
                .replaceAll(/<>/g, '')
                .replaceAll(/\[\]/g, '')
                .replaceAll(/\{}/g, '');
        } while (currentLine.length !== lastLine.length);
        let res = analyseReaminings(currentLine, false, false);

        check: if ((res.opening == 0 && res.closing !== 0) || (res.closing == 0 && res.opening !== 0)) {
            //its just incomplete, but not corrupted
        } else if (res.opening == 0 && res.closing == 0) {
            // ist completely fine
        } else {
            // its corrupted
            res = analyseReaminings(currentLine, false, true);
            let prev;
            for (let j = 0; j < res.order.length; j++) {
                const cur = res.order[j];
                if (prev === 'O' && cur === 'C') {
                    foundSyntaxErrors.push(currentLine.split('')[j]);
                    break check;
                }
                prev = cur;
            }
        }
    }
    result = foundSyntaxErrors.reduce((acc, cnt) => lookup(cnt) + acc, 0);
    return result;
}

function solve2(input: string[]) {
    let result = 0;
    let foundSyntaxErrors = [];
    for (let i = 0; i < input.length; i++) {
        let currentLine = input[i];
        let lastLine = currentLine;
        do {
            lastLine = currentLine;
            currentLine = currentLine
                .replaceAll(/\(\)/g, '')
                .replaceAll(/<>/g, '')
                .replaceAll(/\[\]/g, '')
                .replaceAll(/\{}/g, '');
        } while (currentLine.length !== lastLine.length);
        const res = analyseReaminings(currentLine, false, false);

        if ((res.opening == 0 && res.closing !== 0) || (res.closing == 0 && res.opening !== 0)) {
            //its just incomplete, but not corrupted
            //res = analyseReaminings(currentLine, false, true);
            const toAdd = currentLine
                .replaceAll(/\(/g, ')')
                .replaceAll(/</g, '>')
                .replaceAll(/\[/g, ']')
                .replaceAll(/{/g, '}')
                .split('')
                .reverse()
                .join('');
            foundSyntaxErrors.push(toAdd);
        } else if (res.opening == 0 && res.closing == 0) {
            console.warn("There shouldn't be any complete Lines!");
            // ist completely fine
        } else {
            // its corrupted
        }
    }
    foundSyntaxErrors = foundSyntaxErrors
        .map((a) => a.split('').reduce((acc, cnt) => lookup(cnt, [1, 2, 3, 4]) + acc * 5, 0))
        .sort((a, b) => a - b);
    result = foundSyntaxErrors[Math.floor(foundSyntaxErrors.length / 2)];
    return result;
}

function lookup(char, nums = [3, 57, 1197, 25137]) {
    switch (char) {
        case ')':
            return nums[0];
            break;
        case ']':
            return nums[1];
            break;
        case '}':
            return nums[2];
            break;
        case '>':
            return nums[3];
            break;
    }
}

function analyseReaminings(line, normalize = false, keepOrder = false) {
    const res = { opening: 0, closing: 0 };
    if (keepOrder) {
        res.order = [];
    }
    const l = line.split('');
    for (let i = 0; i < l.length; i++) {
        const current = l[i];
        switch (current) {
            case '{':
                res.opening++;
                if (keepOrder) {
                    res.order[i] = 'O';
                } else {
                    res['{'] = res['{'] ? res['{'] + 1 : 1;
                }
                break;
            case '}':
                res.closing++;
                if (keepOrder) {
                    res.order[i] = 'C';
                } else {
                    res['}'] = res['}'] ? res['}'] + 1 : 1;
                }
                break;
            case '(':
                res.opening++;
                if (keepOrder) {
                    res.order[i] = 'O';
                } else {
                    res['('] = res['('] ? res['('] + 1 : 1;
                }
                break;
            case ')':
                res.closing++;
                if (keepOrder) {
                    res.order[i] = 'C';
                } else {
                    res[')'] = res[')'] ? res[')'] + 1 : 1;
                }
                break;
            case '[':
                res.opening++;
                if (keepOrder) {
                    res.order[i] = 'O';
                } else {
                    res['['] = res['['] ? res['['] + 1 : 1;
                }
                break;
            case ']':
                res.closing++;
                if (keepOrder) {
                    res.order[i] = 'C';
                } else {
                    res[']'] = res[']'] ? res[']'] + 1 : 1;
                }
                break;
            case '<':
                res.opening++;
                if (keepOrder) {
                    res.order[i] = 'O';
                } else {
                    res['<'] = res['<'] ? res['<'] + 1 : 1;
                }
                break;
            case '>':
                res.closing++;
                if (keepOrder) {
                    res.order[i] = 'C';
                } else {
                    res['>'] = res['>'] ? res['>'] + 1 : 1;
                }
                break;
        }
    }

    if (normalize) {
        if (res['{'] && res['}']) {
            if (res['{'] > res['}']) {
                res['{'] -= res['}'];
                res['}'] = 0;
            } else if (res['{'] == res['}']) {
                res['{'] = 0;
                res['}'] = 0;
            } else {
                res['}'] -= res['{'];
                res['{'] = 0;
            }
        }
        if (res['('] && res[')']) {
            if (res['('] > res[')']) {
                res['('] -= res[')'];
                res[')'] = 0;
            } else if (res['('] == res[')']) {
                res['('] = 0;
                res[')'] = 0;
            } else {
                res[')'] -= res['('];
                res['('] = 0;
            }
        }
        if (res['['] && res[']']) {
            if (res['['] > res[']']) {
                res['['] -= res[']'];
                res[']'] = 0;
            } else if (res['['] == res[']']) {
                res['['] = 0;
                res[']'] = 0;
            } else {
                res[']'] -= res['['];
                res['['] = 0;
            }
        }
        if (res['<'] && res['>']) {
            if (res['<'] > res['>']) {
                res['<'] -= res['>'];
                res['>'] = 0;
            } else if (res['<'] == res['>']) {
                res['<'] = 0;
                res['>'] = 0;
            } else {
                res['>'] -= res['<'];
                res['<'] = 0;
            }
        }
    }
    return res;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 26397;
    const testResult2 = 288957;

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

start(__filename, { tests: TestBoth, solve, solve2 }, { needsPrototypes: false });
