import { start, getFile } from '../utils';
function solve(input: string[], mute = false) {
    const enhancement = input[0].split('').map((a) => (a == '#' ? 1 : 0));
    const image = [];
    for (let i = 1; i < input.length; i++) {
        image.push(input[i].split('').map((a) => (a == '#' ? 1 : 0)));
    }
    const resultingImage = enhanceImage(enhancement, image, 2);
    return resultingImage.count();
}

function solve2(input:string[], mute = false) {
    const enhancement = input[0].split('').map((a) => (a == '#' ? 1 : 0));
    const image = [];
    for (let i = 1; i < input.length; i++) {
        image.push(input[i].split('').map((a) => (a == '#' ? 1 : 0)));
    }
    const resultingImage = enhanceImage(enhancement, image, 50);
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
    const startPoint = [repeat, repeat];
    const newStartPoint = [0, 0];
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
    const temp = result.copy();
    for (let _ = 0; _ < repeat; _++) {
        for (let i = 0; i < result[0].length; i++) {
            for (let j = 0; j < result.length; j++) {
                const pixels = Array(9).fill(0);
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
                const parsed = parseInt(pixels.join(''), 2);
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
    const t_input = [getFile('./sample.txt', __filename)];
    const t_result = [35];
    const t_result2 = [3351];

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

// This solution is not that slow, but for 50 times resampling it takes about 2 seconds

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true, slowness: 0 });
