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
    let parsed = input.map((a) => a.split(',').map((b) => (isNaN(b) ? b.split(' ')[2].split('=') : parseInt(b))));
    const max_X = parsed.reduce((acc, c) => {
        if (Array.isArray(c[0])) {
            return acc;
        }
        return Math.max(c[0], acc);
    }, 0);
    const max_Y = parsed.reduce((acc, c) => {
        if (Array.isArray(c[0])) {
            return acc;
        }
        return Math.max(c[1], acc);
    }, 0);

    let paper = Array(max_Y + 1)
        .fill(0)
        .map((x) => Array(max_X + 1).fill(0));

    parsed.forEach((ele) => {
        if (!Array.isArray(ele[0])) {
            paper[ele[1]][ele[0]] += 1;
        }
    });
    let foldCount = 1;
    let foldLength = parsed.reduce((acc, cnt) => Array.isArray(cnt[0]) + acc, 0);
    for (let i = parsed.length - foldLength; i < parsed.length; i++) {
        if (foldCount != 0) {
            let curr = parsed[i][0];
            if (curr[0] == 'x') {
                let x = curr[1];
                for (let k = 0; k < paper[0].length; k++) {
                    if (paper[x][0] != 0 && paper[x][0] != undefined) {
                        console.warn('There are some dots on the fold Line!!', paper[x][0]);
                    }
                    paper[x][0] = undefined;
                }

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[0].length; l++) {
                        if (l > x) {
                            paper[k][2 * x - l] += paper[k][l];
                            paper[k][l] = undefined;
                        }
                    }
                }
            } else {
                let y = curr[1];
                if (paper[y].reduce((acc, c) => c + (acc ? 1 : 0, 0)) != 0) {
                    console.warn('There are some dots on the fold Line!!');
                }
                paper[y] = paper[y].map((a) => undefined);

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[0].length; l++) {
                        if (k > y) {
                            if (!paper[2 * y - k]) {
                                console.log(2 * y - k, paper.length, y, k);
                            }
                            paper[2 * y - k][l] += paper[k][l];
                            paper[k][l] = undefined;
                        }
                    }
                }
            }
            paper = paper
                .map((a) => {
                    let res = a.filter((b) => typeof b !== 'undefined');
                    if (res.length != 0) {
                        return res;
                    }
                })
                .filter((b) => typeof b !== 'undefined');
            foldCount--;
        }
    }
    //to show the paper
    //console.log(paper.map(a=>a.map(b=>b?"#":".").join('')).join('\n'),'\n')

    let result = paper.map((a) => a.reduce((acc, cnt) => acc + (cnt >= 1), 0)).reduce((acc, cnt) => acc + cnt, 0);
    return result;
}

function solve2(input) {
    let parsed = input.map((a) => a.split(',').map((b) => (isNaN(b) ? b.split(' ')[2].split('=') : parseInt(b))));
    const max_X = parsed.reduce((acc, c) => {
        if (Array.isArray(c[0])) {
            return acc;
        }
        return Math.max(c[0], acc);
    }, 0);
    const max_Y = parsed.reduce((acc, c) => {
        if (Array.isArray(c[0])) {
            return acc;
        }
        return Math.max(c[1], acc);
    }, 0);

    let paper = Array(max_Y + 1)
        .fill(0)
        .map((x) => Array(max_X + 1).fill(0));

    parsed.forEach((ele) => {
        if (!Array.isArray(ele[0])) {
            paper[ele[1]][ele[0]] += 1;
        }
    });
    let foldCount = -1; //fold all
    let foldLength = parsed.reduce((acc, cnt) => Array.isArray(cnt[0]) + acc, 0);
    for (let i = parsed.length - foldLength; i < parsed.length; i++) {
        if (foldCount != 0) {
            let curr = parsed[i][0];
            if (curr[0] == 'x') {
                let x = curr[1];
                for (let k = 0; k < paper[0].length; k++) {
                    if (paper[x][0] != 0 && paper[x][0] != undefined) {
                        console.warn('There are some dots on the fold Line!!', paper[x][0]);
                    }
                    paper[x][0] = undefined;
                }

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[0].length; l++) {
                        if (l > x) {
                            paper[k][2 * x - l] += paper[k][l];
                            paper[k][l] = undefined;
                        }
                    }
                }
            } else {
                let y = curr[1];
                if (paper[y].reduce((acc, c) => c + (acc ? 1 : 0, 0)) != 0) {
                    console.warn('There are some dots on the fold Line!!');
                }
                paper[y] = paper[y].map((a) => undefined);

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[0].length; l++) {
                        if (k > y) {
                            if (!paper[2 * y - k]) {
                                console.log(2 * y - k, paper.length, y, k);
                            }
                            paper[2 * y - k][l] += paper[k][l];
                            paper[k][l] = undefined;
                        }
                    }
                }
            }
            paper = paper
                .map((a) => {
                    let res = a.filter((b) => typeof b !== 'undefined');
                    if (res.length != 0) {
                        return res;
                    }
                })
                .filter((b) => typeof b !== 'undefined');
            foldCount--;
        }
    }
    //to show the paper
    console.log('\n', paper.map((a) => a.map((b) => (b ? '#' : '.')).join('')).join('\n'), '\n');

    let result = paper.map((a) => a.reduce((acc, cnt) => acc + (cnt >= 1), 0)).reduce((acc, cnt) => acc + cnt, 0);
    return result;
}

function testAll() {
    let t_input = [getFile('./sample.txt')];

    let t_result = [17];
    let t_result2 = [16];
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
