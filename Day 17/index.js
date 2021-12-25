function solve(input, mute = false) {
    if (Array.isArray(input)) {
        input = input[0];
    }
    let [target_area, lowestPoint, FarthestPoint] = createTargetArea(
        input.split(' ').filter((a) => a.includes('x=') || a.includes('y='))
    );
    let maxium_height = -Infinity;
    let max_x = FarthestPoint,
        max_y = -lowestPoint;
    let start_x = 0,
        start_y = 0;
    for (let i = start_x; i < max_x; i++) {
        for (let j = start_y; j < max_y; j++) {
            let velocity = [i, j];
            let localMaximum = -Infinity;
            let current_pos = [0, 0];

            inner: do {
                current_pos[0] += velocity[0];
                current_pos[1] += velocity[1];
                localMaximum = Math.max(localMaximum, current_pos[1]);
                velocity[0] += velocity[0] == 0 ? 0 : velocity[0] > 0 ? -1 : 1;
                velocity[1]--;

                if (target_area.includesArray(current_pos)) {
                    maxium_height = Math.max(maxium_height, localMaximum);
                    break inner;
                    // "hit"; // we are inside the area!!
                }

                let [x, y] = current_pos;
                if (lowestPoint > y && FarthestPoint >= x) {
                    break inner;
                    // toLow
                } else if (lowestPoint > y && FarthestPoint < x) {
                    break inner;
                    // toBigSteps
                } else if (lowestPoint <= y && FarthestPoint >= x) {
                    continue;
                    //  onWay
                } else if (lowestPoint <= y && FarthestPoint < x) {
                    break inner;
                    //  toFar
                } else {
                    console.warn('FATAL error in comparison of area!!');
                }
            } while (true);
        }
    }
    return maxium_height;
}

function solve2(input, mute = false) {
    if (Array.isArray(input)) {
        input = input[0];
    }
    let [target_area, lowestPoint, FarthestPoint] = createTargetArea(
        input.split(' ').filter((a) => a.includes('x=') || a.includes('y='))
    );
    let sum = 0;
    let max_x = FarthestPoint * 2,
        max_y = -lowestPoint;
    let start_x = 0,
        start_y = lowestPoint;
    for (let i = start_x; i < max_x; i++) {
        for (let j = start_y; j < max_y; j++) {
            let velocity = [i, j];
            let current_pos = [0, 0];

            inner: do {
                current_pos[0] += velocity[0];
                current_pos[1] += velocity[1];
                velocity[0] += velocity[0] == 0 ? 0 : velocity[0] > 0 ? -1 : 1;
                velocity[1]--;

                if (target_area.includesArray(current_pos)) {
                    sum++;
                    break inner;
                    // "hit"; // we are inside the area!!
                }

                let [x, y] = current_pos;
                if (lowestPoint > y && FarthestPoint >= x) {
                    break inner;
                    // toLow
                } else if (lowestPoint > y && FarthestPoint < x) {
                    break inner;
                    // toBigSteps
                } else if (lowestPoint <= y && FarthestPoint >= x) {
                    continue;
                    //  onWay
                } else if (lowestPoint <= y && FarthestPoint < x) {
                    break inner;
                    //  toFar
                } else {
                    console.warn('FATAL error in comparison of area!!');
                }
            } while (true);
        }
    }
    return sum;
}

function createTargetArea(input) {
    let [_, x1, x2] = input[0].match(/x=(\d*)\.\.(\d*).*/i);
    let [_i, y1, y2] = input[1].match(/y=(-*\d*)\.\.(-*\d*).*/i);
    let result = [];
    for (let i = y1; i <= y2; i++) {
        for (let j = x1; j <= x2; j++) {
            result.push([parseInt(j), parseInt(i)]);
        }
    }
    let lowestPoint = result.reduce((acc, [_, y]) => Math.min(acc, y), Infinity);
    let FarthestPoint = result.reduce((acc, [x, _]) => Math.max(acc, x), -Infinity);
    return [result, lowestPoint, FarthestPoint];
}

function testAll() {
    let t_input = getFile('./sample.txt', __filename);
    let t_result = [45];
    let t_result2 = [112];

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
        const testResult2 = t_result2[i];
        let test2 = solve2(testInput, true);
        if (test2 != testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

let { start, getFile } = require('../utils.js');
// You could solve it faster, but i couldn't do it the faster but more mathematical way, so enjoy js in its tempo xD

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true, slowness: 0 });
