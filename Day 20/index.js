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
    let enhancement = input[0].split('').map((a) => (a == '#' ? 1 : 0));
    let image = [];
    for (let i = 1; i < input.length; i++) {
        image.push(input[i].split('').map((a) => (a == '#' ? 1 : 0)));
    }
    let resultingImage = enhanceImage(enhancement, image, 2);
    return resultingImage.count();
}

function solve2(input, mute = false) {
    let enhancement = input[0].split('').map((a) => (a == '#' ? 1 : 0));
    let image = [];
    for (let i = 1; i < input.length; i++) {
        image.push(input[i].split('').map((a) => (a == '#' ? 1 : 0)));
    }
    let resultingImage = enhanceImage(enhancement, image, 50);
    return resultingImage.count();
}

function enhanceImage(enhancement, inputImage, repeat = 1) {
    let result = Array(inputImage[0].length + 2 * repeat)
        .fill(0)
        .map((x) => Array(inputImage.length + 2 * repeat).fill(-1));

    /* if(inputImage[0].length % 2 == 0 || inputImage.length % 2 == 0){
        console.warn("No middle of an even image!")                                         
        process.exit(1); // overdramatizing, but we nee to do something with even and odd
    } */
    let startPoint = [repeat, repeat];
    let newStartPoint = [0, 0];
    for (let i = 0; i < result[0].length; i++) {
        for (let j = 0; j < result.length; j++) {
            if (
                i < startPoint[0] ||
                j < startPoint[1] ||
                i > startPoint[0] + inputImage[0].length - 1 ||
                j > startPoint[1] + inputImage.length - 1
            ) {
                result[j][i] = 0;
            } else {
                result[j][i] = inputImage[j - startPoint[0]][i - startPoint[1]];
            }
        }
    }
    let temp = result.copy();
    for (let _ = 0; _ < repeat; _++) {
        for (let i = 0; i < result[0].length; i++) {
            for (let j = 0; j < result.length; j++) {
                let pixels = Array(9).fill(0);
                [-1, 0, 1].forEach((k, kInd) =>
                    [-1, 0, 1].forEach((l, lInd) => {
                        if (
                            !(
                                j + l < newStartPoint[0] + 1 ||
                                i + k < newStartPoint[1] + 1 ||
                                j + l > newStartPoint[0] + result[0].length - 2 ||
                                i + k > newStartPoint[1] + result.length - 2
                            )
                        ) {
                            pixels[kInd * 3 + lInd] = result[i + k][j + l];
                        } else {
                            pixels[kInd * 3 + lInd] = enhancement[0] & _ % 2; //weirdest part, but after some consideration we need _, the modulo 2 of that is important
                        }
                    })
                );
                let parsed = parseInt(pixels.join(''), 2);
                temp[i][j] = enhancement[parsed];
            }
        }
        result = temp.copy();
    }

    //to Show the grid
    //result.printNested( a => (a<0?'?':a==0 ? "." : '#'),'')
    return result;
}

function testAll() {
    let t_input = [getFile('./sample.txt')];
    let t_result = [35];
    let t_result2 = [3351];

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

function slowWarning() {
    process.on('SIGINT', () => {
        process.exit(0);
    });
    if (process.send) {
        process.send(JSON.stringify({ type: 'error', message: 'Attention: Moderately Slow' }));
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

    // This solution is not that slow, but for 50 times resampling it takes about 2 seconds
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
