import { start, getFile } from '../utils';
function solve(input: string[], mute = false) {
    const parsed = input.map((a) =>
        a.split(',').map((b) =>
            isNaN(b)
                ? b
                      .split(' ')[2]
                      .split('=')
                      .map((c) => (isNaN(c) ? c : parseInt(c)))
                : parseInt(b)
        )
    );
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
    const foldLength = parsed.reduce((acc, cnt) => Array.isArray(cnt[0]) + acc, 0);
    for (let i = parsed.length - foldLength; i < parsed.length; i++) {
        if (foldCount !== 0) {
            const curr = parsed[i][0];
            if (curr[0] == 'x') {
                const x = curr[1];
                for (let k = 0; k < paper[0].length; k++) {
                    if (paper[x][0] !== 0 && paper[x][0] !== undefined) {
                        console.warn('There are some dots on the fold Line!!', paper[x][0]);
                    }
                    paper[x][0] = undefined;
                }

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[k].length; l++) {
                        if (l > x) {
                            paper[k][2 * x - l] += paper[k][l] ? 1 : 0; // ignoring the weird bug
                            /* if(isNaN(paper[k][l])){ there is a weird bug somewhere!
                                console.error('Some Element is not a Number!!')
                            } */
                            paper[k][l] = undefined;
                        }
                    }
                }
            } else {
                const y = curr[1];
                if (paper[y].reduce((acc, c) => c + (acc ? 1 : 0, 0)) !== 0) {
                    console.warn('There are some dots on the fold Line!!');
                }
                paper[y] = paper[y].map((a) => undefined);

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[k].length; l++) {
                        if (k > y) {
                            /* if(isNaN(paper[k][l])){ there is a weird bug somewhere!
                                console.error('Some Element is not a Number!!',)
                            } */
                            paper[2 * y - k][l] += paper[k][l] ? 1 : 0; // ignoring the weird bug
                            paper[k][l] = undefined;
                        }
                    }
                }
            }
            paper = paper
                .map((a) => {
                    const res = a.filter((b) => typeof b !== 'undefined');
                    if (res.length !== 0) {
                        return res;
                    }
                })
                .filter((b) => typeof b !== 'undefined');
            foldCount--;
        }
    }
    //to show the paper, but here its to big, to see it properly
    /*  if (!mute) {
            console.log(paper.map((a) => a.map((b) => (b ? '#' : ' ')).join('')).join('\n'));
        } */

    const result = paper.map((a) => a.reduce((acc, cnt) => acc + (cnt >= 1), 0)).reduce((acc, cnt) => acc + cnt, 0);
    return result;
}

function solve2(input:string[], mute = false) {
    const parsed = input.map((a) =>
        a.split(',').map((b) =>
            isNaN(b)
                ? b
                      .split(' ')[2]
                      .split('=')
                      .map((c) => (isNaN(c) ? c : parseInt(c)))
                : parseInt(b)
        )
    );
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
    const foldLength = parsed.reduce((acc, cnt) => Array.isArray(cnt[0]) + acc, 0);
    for (let i = parsed.length - foldLength; i < parsed.length; i++) {
        if (foldCount !== 0) {
            const curr = parsed[i][0];
            if (curr[0] == 'x') {
                const x = curr[1];
                for (let k = 0; k < paper[0].length; k++) {
                    if (paper[x][0] !== 0 && paper[x][0] !== undefined) {
                        console.warn('There are some dots on the fold Line!!', paper[x][0]);
                    }
                    paper[x][0] = undefined;
                }

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[k].length; l++) {
                        if (l > x) {
                            paper[k][2 * x - l] += paper[k][l] ? 1 : 0; // ignoring the weird bug
                            /* if(isNaN(paper[k][l])){ there is a weird bug somewhere!
                                console.error('Some Element is not a Number!!')
                            } */
                            paper[k][l] = undefined;
                        }
                    }
                }
            } else {
                const y = curr[1];
                if (paper[y].reduce((acc, c) => c + (acc ? 1 : 0, 0)) !== 0) {
                    console.warn('There are some dots on the fold Line!!');
                }
                paper[y] = paper[y].map((a) => undefined);

                for (let k = 0; k < paper.length; k++) {
                    for (let l = 0; l < paper[k].length; l++) {
                        if (k > y) {
                            /* if(isNaN(paper[k][l])){ there is a weird bug somewhere!
                                console.error('Some Element is not a Number!!',)
                            } */
                            paper[2 * y - k][l] += paper[k][l] ? 1 : 0; // ignoring the weird bug
                            paper[k][l] = undefined;
                        }
                    }
                }
            }
            paper = paper
                .map((a) => {
                    const res = a.filter((b) => typeof b !== 'undefined');
                    if (res.length !== 0) {
                        return res;
                    }
                })
                .filter((b) => typeof b !== 'undefined');
            foldCount--;
        }
    }
    //to show the paper
    if (!mute) {
        console.log(paper.map((a) => a.map((b) => (b ? '#' : ' ')).join('')).join('\n'));
    }

    const result = paper.map((a) => a.reduce((acc, cnt) => acc + (cnt >= 1), 0)).reduce((acc, cnt) => acc + cnt, 0);
    return result;
}

function testAll() {
    const t_input = [getFile('./sample.txt', __filename)];

    const t_result = [17];
    const t_result2 = [16];
    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const testResult2 = t_result2[i];
        const test = solve(testInput, true);
        if (test !== testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        const test2 = solve2(testInput, true);
        if (test2 !== testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: false });
