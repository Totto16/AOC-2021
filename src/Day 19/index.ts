import { start, getFile } from '../utils';
function solve(input: string[], mute = false) {
    const scanners = parseInput(input);
    const beacons = getBeacons(scanners);
    global.beacons = beacons; // to speed up the second part, I designed it that I don't need to calculate this for the second exercise again! (test and normal sample are covered by the way they are calculated (only one testcase!))
    const uniqueBeacons = new Set();
    beacons.forEach((a) => {
        a.actual.forEach((b) => {
            uniqueBeacons.add(`${b.x + a.current[0]}, ${b.y + a.current[1]}, ${b.z + a.current[2]}`);
        });
    });
    return uniqueBeacons.size;
}

function solve2(input:string[], mute = false) {
    let beacons;
    if (global.beacons) {
        beacons = global.beacons;
    } else {
        const scanners = parseInput(input);
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
    const list = [{ current: [0, 0, 0], actual: scanners.shift().beacons, status: false }];
    let prev_length = scanners.length;
    while (scanners.length > 0) {
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            if (!element.status) {
                list[i].status = true;
                second: for (let j = scanners.length - 1; j >= 0; j--) {
                    for (let k = 0, obj = {}; k < 2 * 12; k++) {
                        const rotated = possibleOrientationsOf(scanners[j].beacons, k);
                        for (let l = 0; l < element.actual.length; l++) {
                            for (let m = 0; m < rotated.length; m++) {
                                const current = [
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
    const res = beacons.map((beacon) => {
        const { x, y, z } = beacon;
        const allFlips = [beacon, { x, y: -y, z: -z }, { x: -x, y, z: -z }, { x: -x, y: -y, z }];
        const AndRotations = allFlips.map((c) => {
            const { x, y, z } = c;
            const rots = [
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
        const actLine = input[i];
        const matched = actLine.match(/---\sscanner\s(\d*)\s---/);
        if (matched) {
            sIndex = parseInt(matched[1]);
            scanners[sIndex] = { num: sIndex, beacons: [] };
        } else {
            const [x, y, z] = actLine.split(',').map((a) => parseInt(a));
            scanners[sIndex].beacons.push({ x, y, z });
        }
    }
    return scanners;
}

function testAll() {
    const t_input = [getFile('./sample.txt', __filename)];
    const t_result = [79];
    const t_result2 = [3621];

    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const test = solve(testInput, true);
        if (test !== testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        const testResult2 = t_result2[i];
        const test2 = solve2(testInput, true);
        if (test2 !== testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

// This solution is also to slow, to make this tremendous amount of for loops, you need about ~ 8secs (i tested it on a slower machine, it took 30 secs)

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: false, slowness: 0 });
