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
    let parsed = [];
    let toParse = input.map((a) => a.split(''));
    for (let i = 0; i < toParse[0].length - 2; i++) {
        let tmp = [];
        for (let j = 2; j < toParse.length - 1; j++) {
            let current = toParse[j][i];

            let check = current.match(/(A?)(B?)(C?)(D?)/);
            if (check[0] != '') {
                check.forEach((a, index) => {
                    if (index != 0 && a != '') {
                        tmp.push(index);
                    }
                });
            }
        }
        if (tmp.length != 0) {
            parsed.push(tmp);
        }
    }
    let result = simulate(parsed);
    return result;
}

function solve2(input, mute = false) {
    /* #D#C#B#A#
    #D#B#A#C# */
    //to insert in line 4 and 5
    input.splice(3, 0, '  #D#C#B#A#');
    input.splice(4, 0, '  #D#B#A#C#');
    let parsed = [];
    let toParse = input.map((a) => a.split(''));
    for (let i = 0; i < toParse[0].length - 2; i++) {
        let tmp = [];
        for (let j = 2; j < toParse.length - 1; j++) {
            let current = toParse[j][i];

            let check = current.match(/(A?)(B?)(C?)(D?)/);
            if (check[0] != '') {
                check.forEach((a, index) => {
                    if (index != 0 && a != '') {
                        tmp.push(index);
                    }
                });
            }
        }
        if (tmp.length != 0) {
            parsed.push(tmp);
        }
    }
    let result = simulate(parsed);
    return result;
}

function simulate(parsed) {
    global.memoization = {}; // for recursiveness and memoization
    global.minValue = Infinity; //  sow we don't worry about returning something from  the recursive function, we only store the minimum in this global value
    recSimul(parsed, [0, 0, 0, 0, 0, 0, 0], 0, parsed[0].length);
    return global.minValue;
}

let recSimul = function (room, hall, currentValue, RoomLength) {
    let tmp = room.join(',') + '|' + hall.join(',');
    let found = true;

    if (currentValue >= global.minValue) {
        return;
    }
    upper: for (let i = 0; i < room.length; i++) {
        // Second day where I have to use a label >.>
        for (let j = 0; j < RoomLength; j++) {
            if (room[i][j] != i + 1) {
                found = false;
                break upper;
            }
        }
    }
    if (found && global.minValue > currentValue) {
        global.minValue = currentValue;
        return;
    }
    if (global.memoization[tmp] && global.memoization[tmp] <= currentValue) {
        return;
    }
    global.memoization[tmp] = currentValue;

    for (let i = 0; i < room.length; i++) {
        let roomId = room[i].findIndex((a) => a != 0);
        if (roomId == -1) {
            continue;
        }
        let Num = room[i][roomId];
        if (Num == i + 1 && room[i].every((a) => a == Num || a == 0)) {
            continue;
        }
        let targetRoom = roomId;
        for (let j = i + 1; j >= 0; j--) {
            if (hall[j] != 0) {
                break;
            }
            targetRoom += j == 0 ? 1 : 2;

            let curRoom = [...room.map((a) => [...a])];
            let hallPoints = [...hall];

            hallPoints[j] = curRoom[i][roomId];

            if (hallPoints[j] != 0) {
                curRoom[i][roomId] = 0;
                recSimul(curRoom, hallPoints, currentValue + targetRoom * 10 ** (Num - 1), RoomLength);
            }
        }
        targetRoom = roomId;
        for (let j = i + 2; j < hall.length; j++) {
            if (hall[j] != 0) {
                break;
            }
            targetRoom += j == hall.length - 1 ? 1 : 2;

            let curRoom = [...room.map((a) => [...a])];
            let hallPoints = [...hall];

            hallPoints[j] = curRoom[i][roomId];
            if (hallPoints[j] != 0) {
                curRoom[i][roomId] = 0;
                recSimul(curRoom, hallPoints, currentValue + targetRoom * 10 ** (Num - 1), RoomLength);
            }
        }
    }
    lower: for (let i = 0; i < hall.length; i++) {
        if (hall[i] == 0) {
            continue;
        }
        let Num = hall[i];
        if (!room[Num - 1].every((a) => a == Num || a == 0)) {
            continue;
        }
        let targetRoom = 2;
        if (i < Num)
            for (let j = i + 1; j <= Num; j++, targetRoom++) {
                if (hall[j] != 0) {
                    continue lower;
                }
                if (j != 1) {
                    targetRoom++;
                }
            }
        else if (i > Num + 1) {
            for (let j = i - 1; j >= Num + 1; j--, targetRoom++) {
                if (hall[j] != 0) {
                    continue lower;
                }
                if (j != hall.length - 2) {
                    targetRoom++;
                }
            }
        }
        let roomId = room[Num - 1].findIndex((a) => a != 0);
        roomId = roomId == -1 ? RoomLength - 1 : roomId - 1;
        let curRoom = [...room.map((a) => [...a])];
        let hallPoints = [...hall];

        targetRoom += roomId;
        if (targetRoom != 0) {
            curRoom[Num - 1][roomId] = Num;
            if (Num != 0) {
                hallPoints[i] = 0;
                recSimul(curRoom, hallPoints, currentValue + targetRoom * 10 ** (Num - 1), RoomLength);
            }
        }
    }
};

function testAll() {
    let t_input = [getFile('./sample.txt')];
    let t_result = [12521];
    let t_result2 = [44169];

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
    // This solution is slow since it's also a bruteforce, it takes some time to test all possible low solutions, there are many shorthand evaluations, it breaks (or continues) in certain cases!
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
