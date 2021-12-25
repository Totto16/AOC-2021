function solve(input, mute = false) {
    let parsed = input.map((a) => (a.includes('->') ? a.split('->').map((b) => b.trim()) : a));
    let template = parsed[0];
    let insertion = parsed.filter((a) => Array.isArray(a)).reduce((obj, arr) => ((obj[arr[0]] = arr[1]), obj), {});

    let rounds = 10;

    for (let i = 0; i < rounds; i++) {
        let temp_template = template.split('');
        for (let j = 0; j < template.split('').length - 1; j++) {
            let subst = template.substring(j, j + 2);
            let insert = insertion[subst];

            if (!insert || subst.split('').length != 2) {
                console.warn("Couldn't find an appropriate Insertion pair: ", subst, ' !');
            } else {
                temp_template.splice(2 * j + 1, 0, insert);
            }
        }
        template = temp_template.join('');
    }
    let result = Object.values(
        template.split('').reduce((obj, cnt) => {
            if (!obj[cnt]) {
                obj[cnt] = 0;
            }
            obj[cnt]++;
            return obj;
        }, {})
    ).sort((a, b) => b - a);
    return result[0] - result[result.length - 1];
}

function solve2(input, mute = false) {
    let parsed = input.map((a) => (a.includes('->') ? a.split('->').map((b) => b.trim()) : a));
    let template = parsed[0];
    let insertion = parsed.filter((a) => Array.isArray(a)).reduce((obj, arr) => ((obj[arr[0]] = arr[1]), obj), {});

    let List = {};
    Object.keys(insertion).forEach((a) => (List[a] = 0));
    for (let j = 0; j < template.split('').length - 1; j++) {
        List[template.substring(j, j + 2)]++;
    }

    let rounds = 40;

    for (let i = 0; i < rounds; i++) {
        let temp = Object.entries(List);
        for (let j = 0; j < temp.length; j++) {
            if (!temp[j][1]) {
                continue;
            }
            let insert = insertion[temp[j][0]];
            let part = temp[j][0].split('');
            List[temp[j][0]] -= temp[j][1];
            List[part[0] + insert] += temp[j][1];
            List[insert + part[1]] += temp[j][1];
        }
    }

    let result = Object.entries(List).reduce((obj, cnt) => {
        let b = cnt[0].split('');
        if (!obj[b[0]]) {
            obj[b[0]] = 0;
        }
        obj[b[0]] += cnt[1];

        if (!obj[b[1]]) {
            obj[b[1]] = 0;
        }
        obj[b[1]] += cnt[1];
        return obj;
    }, {});

    let temp = template.split(''); // the begin + ending have to be increased by 1 to make the them even!!
    result[temp[0]]++;
    result[temp[temp.length - 1]]++;
    result = Object.values(result)
        .map((a) => a / 2)
        .sort((a, b) => b - a);
    //.sort((a, b) => b - a);
    return result[0] - result[result.length - 1];
}

function testAll() {
    let t_input = [getFile('./sample.txt', __filename)];

    let t_result = [1588];
    let t_result2 = [2188189693529];
    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const testResult2 = t_result2[i];
        let test = solve(testInput, true);
        if (test != testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
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

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: false });
