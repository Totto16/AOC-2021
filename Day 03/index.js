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
    let gamma = [];
    let epsilon = [];
    for (let i = 0; i < input[0].length; i++) {
        // 0 , 1
        let occurences = [0, 0];
        for (let j = 0; j < input.length; j++) {
            let char = input[j].charAt(i);
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

function solve2(input) {
    let oxy = [];
    let co2 = [];

    let oxy_filter = input.map((a) => 1);
    let co2_filter = input.map((a) => 1);

    for (let i = 0; i < input[0].length; i++) {
        // oxy -> 0 , 1  , co2  -> 0,1
        let occurences = [
            [0, 0],
            [0, 0],
        ];
        for (let j = 0; j < input.length; j++) {
            let char = input[j].charAt(i);
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
        let oxy_criteria = occurences[0][0] > occurences[0][1] ? '0' : '1';
        let co2_criteria = occurences[1][1] < occurences[1][0] ? '1' : '0';

        //console.log(oxy_criteria, co2_criteria, i);

        for (let j = 0; j < input.length; j++) {
            let char = input[j].charAt(i);
            if (oxy_filter[j] === 1 && char !== oxy_criteria) {
                oxy_filter[j] = 0;
            }

            if (co2_filter[j] === 1 && char !== co2_criteria) {
                co2_filter[j] = 0;
            }

            let rest_oxy = input.filter((a, index) => oxy_filter[index] === 1);
            let rest_co2 = input.filter((a, index) => co2_filter[index] === 1);

            if (rest_oxy.length == 1) {
                oxy.push(rest_oxy[0]);
                oxy_filter = oxy_filter.map((a) => 0);
                //console.log(oxy);
            }
            if (rest_co2.length == 1) {
                co2.push(rest_co2[0]);
                co2_filter = co2_filter.map((a) => 0);
                // console.log(co2);
            }
        }
    }
    return parseInt(oxy[0], 2) * parseInt(co2[0], 2);
}

function TestBoth() {
    let testInput = getFile('./sample.txt');

    let testResult = 198;
    let testResult2 = 230;

    let test = solve(testInput);
    if (test != testResult) {
        console.error(`Wrong Solving Mechanism on Test 1: Got '${test}' but expected '${testResult}'`);
        process.exit(69);
    }

    let test2 = solve2(testInput);
    if (test2 != testResult2) {
        console.error(`Wrong Solving Mechanism on Test 2: Got '${test2}' but expected '${testResult2}'`);
        process.exit(69);
    }
}

async function main() {
    TestBoth();

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);

    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
