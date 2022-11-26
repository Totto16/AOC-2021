import { start, getFile } from '../utils';
function solve(input: string[]) {
    const parsed = input.map((a) =>
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
    const board: number[][] = Array(max + 1)
        .fill(undefined)
        .map((): number[] => Array(max + 1).fill(0)) as number[][];
    for (let i = 0; i < parsed.length; i++) {
        let [[x1, y1], [x2, y2]] = parsed[i];
        if (x1 === x2) {
            if (y1 > y2) {
                const temp = y2;
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
                const temp = x2;
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

function solve2(input: string[]): number {
    const parsed = input.map((a) =>
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
    const board = Array(max + 1)
        .fill(0)
        .map((x) => Array(max + 1).fill(0));
    for (let i = 0; i < parsed.length; i++) {
        let [[x1, y1], [x2, y2]] = parsed[i];
        if (x1 === x2) {
            if (y1 > y2) {
                const temp = y2;
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
                const temp = x2;
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
            const startX = Math.abs(x1 - x2);
            const startY = Math.abs(y1 - y2);
            const signX = x1 - x2 < 0 ? -1 : 1;
            const signY = y1 - y2 < 0 ? -1 : 1;
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
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 5;
    const testResult2 = 12;

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
