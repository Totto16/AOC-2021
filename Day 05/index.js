function getFile(filePath, seperator = '\n') {
    let result = require('fs')
        .readFileSync(filePath)
        .toString()
        .split(seperator)
        .filter((a) => a != '');
    if (result.includes('\r')) {
        result = result.replaceAll(/\r/, '');
    }
    return result;
}

function solve(input) {
    let parsed = input.map((a) =>
        a.split('->').map((b) =>
            b
                .trim()
                .split(',')
                .map((d) => parseInt(d))
        )
    ); // Reminder for myself, never forget to convert JS pseudo numbers, otherwise there will be some random bus happening (most of the time in strings of different length: eg 123 > 3 is true, but "123" > "3" NOT, damn ASCIIs)
    const max = parsed.reduce((acc, c) => {
        return Math.max(
            c.reduce((acc, b) => Math.max(Math.max(b[0], b[1]), acc), 0),
            acc
        );
    }, 0);
    let board = Array(max + 1)
        .fill(0)
        .map((x) => Array(max + 1).fill(0));
    for (let i = 0; i < parsed.length; i++) {
        let [[x1, y1], [x2, y2]] = parsed[i];
        if (x1 === x2) {
            if (y1 > y2) {
                let temp = y2;
                y2 = y1;
                y1 = temp;
            }
            for (let j = 0; j <= max; j++) {
                if (y1 <= j && y2 >= j) {
                    board[j][x1]++;
                }
            }
        } else if (y1 === y2) {
            if (x1 > x2) {
                let temp = x2;
                x2 = x1;
                x1 = temp;
            }
            for (let j = 0; j <= max; j++) {
                if (x1 <= j && x2 >= j) {
                    board[y1][j]++;
                }
            }
        } else {
            //it says we can forget about these
            //console.info("Not handled case!");
        }
    }
    // show board!
    // console.log(board.map(a=>a.map(b=>b===0?".":b.toString()).join(' ')).join('\n'));

    const result = board.map((a) => a.reduce((acc, c) => (c >= 2 ? 1 : 0) + acc, 0)).reduce((acc, b) => b + acc, 0);
    return result;
}

function solve2(input) {
    let parsed = input.map((a) =>
        a.split('->').map((b) =>
            b
                .trim()
                .split(',')
                .map((d) => parseInt(d))
        )
    ); // Reminder for myself, never forget to convert JS pseudo numbers, otherwise there will be some random bus happening (most of the time in strings of different length: eg 123 > 3 is true, but "123" > "3" NOT, damn ASCIIs)
    const max = parsed.reduce((acc, c) => {
        return Math.max(
            c.reduce((acc, b) => Math.max(Math.max(b[0], b[1]), acc), 0),
            acc
        );
    }, 0);
    let board = Array(max + 1)
        .fill(0)
        .map((x) => Array(max + 1).fill(0));
    for (let i = 0; i < parsed.length; i++) {
        let [[x1, y1], [x2, y2]] = parsed[i];
        if (x1 === x2) {
            if (y1 > y2) {
                let temp = y2;
                y2 = y1;
                y1 = temp;
            }

            for (let j = 0; j <= max; j++) {
                if (y1 <= j && y2 >= j) {
                    board[j][x1]++;
                }
            }
        } else if (y1 === y2) {
            if (x1 > x2) {
                let temp = x2;
                x2 = x1;
                x1 = temp;
            }

            for (let j = 0; j <= max; j++) {
                if (x1 <= j && x2 >= j) {
                    board[y1][j]++;
                }
            }
        } else {
            //now we have to cover these cases
            let startX = Math.abs(x1 - x2);
            let startY = Math.abs(y1 - y2);
            let signX = x1 - x2 < 0 ? -1 : 1;
            let signY = y1 - y2 < 0 ? -1 : 1;
            if (startX === startY) {
                for (let j = 0; j <= startX; j++) {
                    board[y1 - signY * j][x1 - signX * j]++;
                }
            } else {
                //these cases can't be handled
                //console.info("Not handled case!");
            }
        }
    }
    // show board!
    // console.log(board.map(a=>a.map(b=>b===0?".":b.toString()).join(' ')).join('\n'));

    const result = board.map((a) => a.reduce((acc, c) => (c >= 2 ? 1 : 0) + acc, 0)).reduce((acc, b) => b + acc, 0);
    return result;
}

function TestBoth() {
    let testInput = getFile('./sample.txt');

    let testResult = 5;
    let testResult2 = 12;

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
