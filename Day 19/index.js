function solve(input, mute = false) {
    let scanners = parseInput(input);
    let beacons = getBeacons(scanners);
    global.beacons = beacons; // to speed up the second part, I designed it that I don't need to calculate this for the second exercise again! (test and normal sample are covered by the way they are calculated (only one testcase!))
    let uniqueBeacons = new Set();
    beacons.forEach((a) => {
        a.actual.forEach((b) => {
            uniqueBeacons.add(`${b.x + a.current[0]}, ${b.y + a.current[1]}, ${b.z + a.current[2]}`);
        });
    });
    return uniqueBeacons.size;
}

function solve2(input, mute = false) {
    let beacons;
    if (global.beacons) {
        beacons = global.beacons;
    } else {
        let scanners = parseInput(input);
        beacons = getBeacons(scanners);
    }

    let result = 0;
    beacons.forEach((a) => {
        beacons.forEach((b) => {
            result = Math.max(
                result,
                Math.abs(a.current[0] - b.current[0]) +
                    Math.abs(a.current[1] - b.current[1]) +
                    Math.abs(a.current[2] - b.current[2])
            );
        });
    });

    return result;
}

function getBeacons(scanners) {
    let list = [{ current: [0, 0, 0], actual: scanners.shift().beacons, status: false }];
    let prev_length = scanners.length;
    while (scanners.length > 0) {
        for (let i = 0; i < list.length; i++) {
            let element = list[i];
            if (!element.status) {
                list[i].status = true;
                second: for (let j = scanners.length - 1; j >= 0; j--) {
                    for (let k = 0, obj = {}; k < 2 * 12; k++) {
                        let rotated = possibleOrientationsOf(scanners[j].beacons, k);
                        for (let l = 0; l < element.actual.length; l++) {
                            for (let m = 0; m < rotated.length; m++) {
                                let current = [
                                    element.actual[l].x - rotated[m].x,
                                    element.actual[l].y - rotated[m].y,
                                    element.actual[l].z - rotated[m].z,
                                ];
                                obj[current] = obj[current] ? obj[current] + 1 : 1;
                                if (obj[current] >= 12) {
                                    scanners.splice(j, 1) &&
                                        list.push({
                                            current: [
                                                element.current[0] + current[0],
                                                element.current[1] + current[1],
                                                element.current[2] + current[2],
                                            ],
                                            actual: rotated,
                                            status: false,
                                        });
                                    continue second;
                                }
                            }
                        }
                    }
                }
            }
        }
        if (prev_length == scanners.length) {
            //shouldn't occur, but for some safety measures
            console.error('FATAL error, no overlapping!');
            process.exit(1);
        }
        prev_length = scanners.length;
    }
    return list;
}

function possibleOrientationsOf(beacons, index) {
    let res = beacons.map((beacon) => {
        let { x, y, z } = beacon;
        let allFlips = [beacon, { x, y: -y, z: -z }, { x: -x, y: y, z: -z }, { x: -x, y: -y, z: z }];
        let AndRotations = allFlips.map((c) => {
            let { x, y, z } = c;
            let rots = [
                c,
                { x, y: -z, z: y },
                { x: z, y, z: -x },
                { x: -y, y: x, z },
                { x: y, y: -z, z: -x },
                { x: z, y: x, z: y },
            ];
            return rots;
        });
        return AndRotations.flat()[index];
    });
    return res;
}

function parseInput(input) {
    const scanners = [];
    let sIndex = -1;
    for (let i = 0; i < input.length; i++) {
        let actLine = input[i];
        let matched = actLine.match(/---\sscanner\s(\d*)\s---/);
        if (matched) {
            sIndex = parseInt(matched[1]);
            scanners[sIndex] = { num: sIndex, beacons: [] };
        } else {
            let [x, y, z] = actLine.split(',').map((a) => parseInt(a));
            scanners[sIndex].beacons.push({ x, y, z });
        }
    }
    return scanners;
}

function testAll() {
    let t_input = [getFile('./sample.txt', __filename)];
    let t_result = [79];
    let t_result2 = [3621];

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
// This solution is also to slow, to make this tremendous amount of for loops, you need about ~ 8secs (i tested it on a slower machine, it took 30 secs)

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: false, slowness: 0 });
