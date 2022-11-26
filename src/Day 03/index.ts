import { start, getFile } from '../utils';

function solve(input: string[]) {
    const gamma = [];
    const epsilon = [];
    for (let i = 0; i < input[0].length; i++) {
        // 0 , 1
        const occurences = [0, 0];
        for (let j = 0; j < input.length; j++) {
            const char = input[j].charAt(i);
            if (char === '0') {
                occurences[0]++;
            } else if (char === '1') {
                occurences[1]++;
            } else {
                console.warn('Not recognized:', char);
            }
        }
        gamma.push(occurences[0] > occurences[1] ? '0' : '1');
        epsilon.push(occurences[1] > occurences[0] ? '0' : '1');
    }
    return parseInt(gamma.join(''), 2) * parseInt(epsilon.join(''), 2);
}

function solve2(input: string[]) {
    const oxy = [];
    const co2 = [];

    let oxy_filter = input.map(() => 1);
    let co2_filter = input.map(() => 1);

    for (let i = 0; i < input[0].length; i++) {
        // oxy -> 0 , 1  , co2  -> 0,1
        const occurences = [
            [0, 0],
            [0, 0],
        ];
        for (let j = 0; j < input.length; j++) {
            const char = input[j].charAt(i);
            if (char === '0') {
                if (oxy_filter[j] === 1) {
                    occurences[0][0]++;
                }
                if (co2_filter[j] === 1) {
                    occurences[1][0]++;
                }
            } else if (char === '1') {
                if (oxy_filter[j] === 1) {
                    occurences[0][1]++;
                }
                if (co2_filter[j] === 1) {
                    occurences[1][1]++;
                }
            } else {
                console.warn('Not recognized:', char);
            }
        }
        const oxy_criteria = occurences[0][0] > occurences[0][1] ? '0' : '1';
        const co2_criteria = occurences[1][1] < occurences[1][0] ? '1' : '0';

        //console.log(oxy_criteria, co2_criteria, i);

        for (let j = 0; j < input.length; j++) {
            const char = input[j].charAt(i);
            if (oxy_filter[j] === 1 && char !== oxy_criteria) {
                oxy_filter[j] = 0;
            }

            if (co2_filter[j] === 1 && char !== co2_criteria) {
                co2_filter[j] = 0;
            }

            const rest_oxy = input.filter((_, index) => oxy_filter[index] === 1);
            const rest_co2 = input.filter((_, index) => co2_filter[index] === 1);

            if (rest_oxy.length === 1) {
                oxy.push(rest_oxy[0]);
                oxy_filter = oxy_filter.map(() => 0);
                //console.log(oxy);
            }
            if (rest_co2.length === 1) {
                co2.push(rest_co2[0]);
                co2_filter = co2_filter.map(() => 0);
                // console.log(co2);
            }
        }
    }
    return parseInt(oxy[0], 2) * parseInt(co2[0], 2);
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 198;
    const testResult2 = 230;

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

start(__filename, { tests: TestBoth, solve, solve2 });
