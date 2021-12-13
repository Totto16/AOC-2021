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
    let Nodes = {};
    for (let i = 0; i < input.length; i++) {
        let curr = input[i];
        let [start, end] = curr.split('-');
        if (!Nodes[start]) {
            Nodes[start] = new Set();
        }
        Nodes[start].add(end);

        if (!Nodes[end]) {
            Nodes[end] = new Set();
        }
        Nodes[end].add(start);
    }
    let res = DFS(Nodes, 'start');
    return res;
}

function solve2(input) {
    let Nodes = {};
    for (let i = 0; i < input.length; i++) {
        let curr = input[i];
        let [start, end] = curr.split('-');
        if (!Nodes[start]) {
            Nodes[start] = new Set();
        }
        Nodes[start].add(end);

        if (!Nodes[end]) {
            Nodes[end] = new Set();
        }
        Nodes[end].add(start);
    }
    let res = DFS_2(Nodes, 'start');
    return res;
}

function DFS(nodes, start, visited = new Set()) {
    let count = 0;
    if (start == 'end') {
        return 1;
    }
    if (!isUpperCase(start)) {
        visited = new Set([...visited, start]);
    }

    nodes[start].forEach((end) => {
        if (!visited.has(end)) {
            count += DFS(nodes, end, visited);
        }
    });

    return count;
}

function DFS_2(nodes, start, visited = new Set()) {
    let count = 0;
    if (start == 'end') {
        return 1;
    }
    if (!isUpperCase(start)) {
        visited = visited.has(start) ? new Set([...visited, '2']) : new Set([...visited, start]);
    }

    nodes[start].forEach((end) => {
        if (end != 'start' && !(visited.has(end) && visited.has('2'))) {
            count += DFS_2(nodes, end, visited);
        }
    });

    return count;
}

function isUpperCase(text) {
    return text.toUpperCase() == text;
}

function testAll() {
    let t_input = [getFile('./sample.txt'), getFile('./sample1.txt'), getFile('./sample2.txt')];

    let t_result = [10, 19, 226];
    let t_result2 = [36, 103, 3509];
    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const testResult2 = t_result2[i];
        let test = solve(testInput);
        if (test != testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        let test2 = solve2(testInput);
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
