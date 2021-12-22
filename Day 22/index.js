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
    let parsed = input
        .map((inp) => {
            let [_, state, ...rest] = inp.match(
                /(\w*)\sx=(-?\d*)\.\.(-?\d*),y=(-?\d*)\.\.(-?\d*),z=(-?\d*)\.\.(-?\d*)/i
            );
            let [p1, p2, p3, p4, p5, p6] = rest;
            let coords = [
                [p1, p2],
                [p3, p4],
                [p5, p6],
            ];
            coords = coords.map(([a, b]) => [parseInt(a), parseInt(b)]);
            let error = false;
            coords.forEach(([a, b]) => {
                if ((a < -50 && b < -50) || (a > 50 && b > 50)) {
                    error = true;
                }
            });
            if (error) {
                return null;
            }

            let [[x1, x2], [y1, y2], [z1, z2]] = coords;
            return {
                state: state == 'on',
                x: [x1, '..', x2].fillElements(),
                y: [y1, '..', y2].fillElements(),
                z: [z1, '..', z2].fillElements(),
            };
        })
        .filter((a) => a != null);

    let UniquePoints = new Set();
    for (let i = 0; i < parsed.length; i++) {
        let current = parsed[i];
        let cube = current.x.combine(current.y).combine(current.z);
        if (current.state) {
            cube.forEach((point) => UniquePoints.add(point.join(',')));
        } else {
            cube.forEach((point) => UniquePoints.delete(point.join(',')));
        }
        if (!mute) {
            console.log(`${i + 1} / ${parsed.length}`);
        }
    }
    return UniquePoints.size;
}

function solve2(input, mute = false) {
    let parsed = input
        .map((inp) => {
            let [_, state, ...rest] = inp.match(
                /(\w*)\sx=(-?\d*)\.\.(-?\d*),y=(-?\d*)\.\.(-?\d*),z=(-?\d*)\.\.(-?\d*)/i
            );
            let [x1, x2, y1, y2, z1, z2] = rest.map((a) => parseInt(a));
            return {
                state: state == 'on',
                x: [x1, '..', x2].fillElements(),
                y: [y1, '..', y2].fillElements(),
                z: [z1, '..', z2].fillElements(),
            };
        })
        .filter((a) => a != null);

    let UniquePoints = new Set();
    for (let i = 0; i < parsed.length; i++) {
        let current = parsed[i];
        let cube = current.x.combine(current.y).combine(current.z);
        if (current.state) {
            cube.forEach((point) => UniquePoints.add(point.join(',')));
        } else {
            cube.forEach((point) => UniquePoints.delete(point.join(',')));
        }
        if (!mute) {
            console.log(`${i + 1} / ${parsed.length}`);
        }
    }
    return UniquePoints.size;
}

function testAll() {
    let t_input = [getFile('./sample.txt'), getFile('./sample2.txt')];
    let t_result = [39, 590784];
    let t_result2 = [39, 2758514936282235];

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

    Object.defineProperty(Array.prototype, 'printNested', {
        value: function (mapFunction = (a) => (a == 0 ? '.' : a.toString()), seperator = ' ', EOL = '\n') {
            let array = this;
            let error = false;
            let toLog = array
                .map((a) => {
                    if (!Array.isArray(a)) {
                        error = true;
                    }
                    return a.map((b) => mapFunction(b)).join(seperator);
                })
                .join(EOL);
            if (error) {
                return false;
            }
            console.log(toLog);
            return true;
        },
    });

    Object.defineProperty(Array.prototype, 'copy', {
        value: function () {
            return JSON.parse(JSON.stringify(this));
        },
    });

    Object.defineProperty(Array.prototype, 'count', {
        value: function (countFunction = (a) => a, start = 0) {
            let array = this;
            let reduceFunction = (acc, el) => {
                if (!Array.isArray(el)) {
                    return acc + countFunction(el);
                }
                return acc + el.reduce(reduceFunction, start);
            };

            let result = array.reduce(reduceFunction, start);
            return result;
        },
    });

    Object.defineProperty(Array.prototype, 'combine', {
        value: function (second, flat = true) {
            let first = this;
            if (!Array.isArray(first) || !Array.isArray(second)) {
                return [];
            }
            let result = [];
            for (let i = 0; i < first.length; i++) {
                for (let j = 0; j < second.length; j++) {
                    let p = [first[i], second[j]];
                    if (flat && (Array.isArray(first[i]) || Array.isArray(second[j]))) {
                        p = p.flat();
                    }
                    result.push(p);
                }
            }
            return result;
        },
    });

    Object.defineProperty(Array.prototype, 'fillElements', {
        value: function (start = 0, end = 1000) {
            let first = this;
            if (!Array.isArray(first)) {
                return [];
            }
            if (first.length > 3) {
                return first;
            }
            let newArray = [];
            for (let i = 0; i < first.length; i++) {
                if (first[i] === '..') {
                    let startNumber = i > 0 ? first[i - 1] : start;
                    let endNumber = i < first.length - 1 ? first[i + 1] : end;
                    let diff = endNumber >= startNumber ? 1 : -1;
                    let compareFunction = endNumber >= startNumber ? (a, b) => a <= b : (a, b) => a >= b;
                    for (let j = startNumber; compareFunction(j, endNumber); j += diff) {
                        newArray.push(j);
                    }
                } else {
                    // newArray.push(first[i]);
                }
            }
            return newArray;
        },
    });
}

function slowWarning() {
    process.on('SIGINT', () => {
        process.exit(0);
    });
    if (process.send) {
        process.send(JSON.stringify({ type: 'error', message: 'Attention: Moderately Slow' }));
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
    // This solution is also not that slow, but for that amount of parallel universes it takes over 2 secs
    if (autoSkipSlow) {
        console.log('Auto Skipped Moderately Slow');
        process.exit(43);
    }

    slowWarning();
    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
