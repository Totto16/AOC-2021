const { check } = require('prettier');

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
    let parsed = input.map((a) => a.split('').map((b) => parseInt(b)));
    let destination = [parsed[0].length - 1, parsed.length - 1];

    let Nodes = [];
    for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[0].length; j++) {
            Nodes.push([i, j, parsed[i][j], i + j == 0 ? 0 : Infinity]);
        }
    }

    let result = [];
    while (Nodes.length > 0) {
        Nodes.sort((a, b) => a[3] - b[3]);
        const current = Nodes.shift();
        const [x, y, _, totalRisk] = current;
        if (x == destination[0] && y == destination[1]) {
            result = current;
            break;
        }
        const adjacent = findAdjacent(x, y, parsed);
        for (let i = 0; i < adjacent.length; i++) {
            let elem = adjacent[i];
            const index = Nodes.findIndex((element) => element.equals(elem, 2));
            if (index < 0) {
                continue;
            }
            const node = Nodes[index];
            Nodes[index][3] = Math.min(totalRisk + node[2], node[3]);
        }
    }

    return result[3];
}

function solve2(input, mute = false) {
    let input2 = [];
    for (let i = 0; i < 5; i++) {
        for (let y = 0; y < input.length; y++) {
            const temp = input[y];
            const line = [];
            for (let j = 0; j < 5; j++) {
                for (let x = 0; x < temp.length; x++) {
                    line.push(((parseInt(temp[x]) + i + j - 1) % 9) + 1);
                }
            }
            input2.push(line);
        }
    }
    let parsed = input2.map((a) => a.map((b) => parseInt(b)));
    let destination = [parsed[0].length - 1, parsed.length - 1];

    let Nodes = [];
    for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[0].length; j++) {
            Nodes.push([i, j, parsed[i][j], i + j == 0 ? 0 : Infinity]);
        }
    }

    let result = [];
    let perc = 0;
    let prev_len = Nodes.length;
    while (Nodes.length > 0) {
        Nodes.sort((a, b) => a[3] - b[3]);
        const current = Nodes.shift();
        const [x, y, _, totalRisk] = current;
        if (x == destination[0] && y == destination[1]) {
            result = current;
            break;
        }
        const adjacent = findAdjacent(x, y, parsed);
        for (let i = 0; i < adjacent.length; i++) {
            let elem = adjacent[i];
            const index = Nodes.findIndex((element) => element.equals(elem, 2));
            if (index < 0) {
                continue;
            }
            const node = Nodes[index];
            Nodes[index][3] = Math.min(totalRisk + node[2], node[3]);
        }
        perc = ((prev_len - Nodes.length) / prev_len) * 100;
        if (!mute && perc % 1 == 0) {
            console.log(`Round ${prev_len - Nodes.length} / ${prev_len} = ${perc} %`);
        }
    }

    return result[3];
}

function findAdjacent(x, y, parsed) {
    let adjacent = [];
    if (x > 1) {
        adjacent.push([x - 1, y]);
    }

    if (x < parsed[0].length - 1) {
        adjacent.push([x + 1, y]);
    }

    if (y > 1) {
        adjacent.push([x, y - 1]);
    }

    if (y < parsed.length - 1) {
        adjacent.push([x, y + 1]);
    }

    return adjacent;
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
}

function testAll() {
    let t_input = [getFile('./sample.txt')];

    let t_result = [40];
    let t_result2 = [315];
    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const testResult2 = t_result2[i];
        let test = solve(testInput, true);
        if (test != testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        let test2 = solve2(testInput, true);
        if (test2 != testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
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

    // I tried to make it faster, but its super slow :( ist large pathfinding, so it how it is
    if (autoSkipSlow) {
        console.log('Auto Skipped Slow');
        process.exit(43);
    }

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
