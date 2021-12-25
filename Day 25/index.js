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
    let t_input = [getFile('./sample.txt', __filename)];
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

let { start, getFile } = require('../utils.js');

// This solution is slow since it's also a bruteforce, it takes some time to test all possible low solutions, there are many shorthand evaluations, it breaks (or continues) in certain cases!
start(
    __filename,
    { tests: testAll, solve, solve2Message: "This is the end of this year's AOC!!!" },
    { needsPrototypes: true, slowness: 0 }
);
