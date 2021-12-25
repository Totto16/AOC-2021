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
    }
    return UniquePoints.size;
}

function solve2(input, mute = false) {
    let parsed = input.map((inp) => {
        let [_, state, ...rest] = inp.match(/(\w*)\sx=(-?\d*)\.\.(-?\d*),y=(-?\d*)\.\.(-?\d*),z=(-?\d*)\.\.(-?\d*)/i);
        let [x1, x2, y1, y2, z1, z2] = rest.map((a) => parseInt(a));
        return {
            state: state == 'on',
            coords: [
                [x1, x2],
                [y1, y2],
                [z1, z2],
            ],
        };
    });

    const OnCoords = parsed
        .reduce((acc, line) => {
            let mapFunction = (coords) => {
                let intersect = coords
                    .map((limit, i) => [Math.max(line.coords[i][0], limit[0]), Math.min(line.coords[i][1], limit[1])])
                    .filter(([one, two]) => two >= one);
                if (intersect.length != 3) {
                    return [coords];
                } else {
                    let splitFunction = (cube, tmp, count = 0) => {
                        let firstPart = [
                            [cube[count][0], tmp[count][0] - 1],
                            [tmp[count][1] + 1, cube[count][1]],
                        ]
                            .filter(([b1, b2]) => b2 >= b1)
                            .map((limit) => Object.assign([...cube], { [count]: limit }));

                        let secondPart = [];
                        if (count < 2) {
                            secondPart = splitFunction(
                                Object.assign([...cube], { [count]: tmp[count] }),
                                tmp,
                                count + 1
                            );
                        }

                        return [...firstPart, ...secondPart];
                    };

                    return splitFunction(coords, intersect);
                }
            };

            let rest = line.state ? [line.coords] : [];
            let result = [...acc.flatMap(mapFunction), ...rest];
            return result;
        }, [])
        .map((a) => a.reduce((acc, [first, second]) => acc * (second - first + 1), 1))
        .reduce((acc, cnt) => cnt + acc, 0);

    return OnCoords;
}

function testAll() {
    let t_input = [getFile('./sample.txt', __filename), getFile('./sample2.txt', __filename)];
    let t_input2 = [getFile('./sample3.txt', __filename)];
    let t_result = [39, 590784];
    let t_result2 = [2758514936282235];

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
    }
    for (let i = 0; i < t_input2.length; i++) {
        const testInput2 = t_input2[i];
        const testResult2 = t_result2[i];
        let test2 = solve2(testInput2, true);
        if (test2 != testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

let { start, getFile } = require('../utils.js');

// This solution is slow for the first approach, but i wanted to use my array functions fillElements (in other langauges [x..y] just works :()) and combine, I coded combine but never actually used it, but with that it is a super readable solution :)

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true, slowness: 0 });
