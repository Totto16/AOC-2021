import { start, getFile } from '../utils';
function solve(input: string[], mute = false) {
    const parsed = input.map((a) => a.split('').map((b) => parseInt(b)));
    const destination = [parsed[0].length - 1, parsed.length - 1];

    const Nodes = [];
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
            const elem = adjacent[i];
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

function solve2(input:string[], mute = false) {
    const input2 = [];
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
    const parsed = input2.map((a) => a.map((b) => parseInt(b)));
    const destination = [parsed[0].length - 1, parsed.length - 1];

    const Nodes = [];
    for (let i = 0; i < parsed.length; i++) {
        for (let j = 0; j < parsed[0].length; j++) {
            Nodes.push([i, j, parsed[i][j], i + j == 0 ? 0 : Infinity]);
        }
    }

    let result = [];
    let perc = 0;
    const prev_len = Nodes.length;
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
            const elem = adjacent[i];
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
    const adjacent = [];
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

function testAll() {
    const t_input = [getFile('./sample.txt', __filename)];

    const t_result = [40];
    const t_result2 = [315];
    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const testResult2 = t_result2[i];
        const test = solve(testInput, true);
        if (test !== testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        const test2 = solve2(testInput, true);
        if (test2 !== testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

// I tried to make it faster, but its super slow :( it is large pathfinding, so it is what it is and it isn't what it isn't ~ (twitch.tv/)tsoding

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true, slowness: 1 });
