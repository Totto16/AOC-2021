import { start, getFile } from '../utils';
function solve(input: string[]) {
    let flashes = 0;
    let parsed = input.map((a) => a.split('').map((b) => parseInt(b)));
    const steps = 100;
    for (let i = 0; i < steps; i++) {
        // step 1
        parsed = parsed.map((a) => a.map((b) => b + 1));

        //step 2
        let flashed_now = 0;
        const filtered = [];
        do {
            flashed_now = 0;
            for (let j = 0; j < parsed.length; j++) {
                for (let k = 0; k < parsed[0].length; k++) {
                    if (!filtered.includesArray([j, k])) {
                        const curr = parsed[j][k];
                        if (curr > 9) {
                            filtered.push([j, k]);
                            flashed_now++;
                            parsed = flash(parsed, j, k);
                        }
                    }
                }
            }
        } while (flashed_now !== 0);
        //step 3
        parsed = parsed.map((a) =>
            a.map((b) => {
                if (b > 9) {
                    flashes++;
                    return 0;
                }
                return b;
            })
        );
    }

    return flashes;
}

function solve2(input: string[]) {
    let parsed = input.map((a) => a.split('').map((b) => parseInt(b)));
    let i = 0;
    do {
        // step 1
        parsed = parsed.map((a) => a.map((b) => b + 1));

        //step 2
        let flashed_now = 0;
        const filtered = [];
        do {
            flashed_now = 0;
            for (let j = 0; j < parsed.length; j++) {
                for (let k = 0; k < parsed[0].length; k++) {
                    if (!filtered.includesArray([j, k])) {
                        const curr = parsed[j][k];
                        if (curr > 9) {
                            filtered.push([j, k]);
                            flashed_now++;
                            parsed = flash(parsed, j, k);
                        }
                    }
                }
            }
        } while (flashed_now !== 0);

        //step 3
        let flashes = 0;
        parsed = parsed.map((a) =>
            a.map((b) => {
                if (b > 9) {
                    flashes++;
                    return 0;
                }
                return b;
            })
        );
        if (flashes == parsed.length * parsed[0].length) {
            return i + 1;
        }
        i++;
    } while (i < 100000); // 100000 is the max iterations after that we give up!

    return -1;
}

function flash(parsed, j, k) {
    if (j > 0) {
        parsed[j - 1][k]++;
        if (k > 0) {
            parsed[j - 1][k - 1]++;
        }
        if (k < parsed[0].length - 1) {
            parsed[j - 1][k + 1]++;
        }
    }
    if (j < parsed.length - 1) {
        parsed[j + 1][k]++;
        if (k > 0) {
            parsed[j + 1][k - 1]++;
        }
        if (k < parsed[0].length - 1) {
            parsed[j + 1][k + 1]++;
        }
    }
    if (k > 0) {
        parsed[j][k - 1]++;
    }
    if (k < parsed[0].length - 1) {
        parsed[j][k + 1]++;
    }
    return parsed;
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 1656;
    const testResult2 = 195;

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

start(__filename, { tests: TestBoth, solve, solve2 }, { needsPrototypes: true });
