import { start, getFile } from '../utils';
function solve(input: string[]) {
    const drawnNumber = input[0].split(',').map((a) => parseInt(a));
    const boards: number[] = [];
    const DrawnBoards: number[][] = [];
    let boardCounter = 0;

    for (let i = 2; i < input.length; i++) {
        const currentColumn = input[i];
        if (currentColumn === '') {
            boardCounter++;
        } else {
            if (!Array.isArray(boards[boardCounter])) {
                boards[boardCounter] = [];
                DrawnBoards[boardCounter] = [];
            }
            boards[boardCounter].push(
                currentColumn
                    .split(' ')
                    .filter((a) => a !== '')
                    .map((a) => parseInt(a))
            );
            DrawnBoards[boardCounter].push(
                currentColumn
                    .split(' ')
                    .filter((a) => a !== '')
                    .map((a) => 0)
            );
        }
    }

    for (let i = 0; i < drawnNumber.length; i++) {
        const actualNumber = drawnNumber[i];
        boards.forEach((board, bIndex) => {
            board.forEach((column, cIndex) => {
                column.forEach((item, iIndex) => {
                    if (actualNumber == item) {
                        DrawnBoards[bIndex][cIndex][iIndex] = 1;
                    }
                });
            });
        });
        const Winner = SomeoneHasWon(DrawnBoards);
        if (Winner > -1) {
            let WinnerScore = 0;
            for (let cIndex = 0; cIndex < boards[Winner].length; cIndex++) {
                const column = boards[Winner][cIndex];
                for (let index = 0; index < column.length; index++) {
                    const item = column[index];
                    if (DrawnBoards[Winner][cIndex][index] === 0) {
                        WinnerScore += item;
                    }
                }
            }
            return actualNumber * WinnerScore;
        }
    }
    return 'ERROR';
}

function SomeoneHasWon(ToCheck, checkForAll = false) {
    const AllWinners = [];
    for (let bIndex = 0; bIndex < ToCheck.length; bIndex++) {
        const board = ToCheck[bIndex];
        for (let cIndex = 0; cIndex < board.length; cIndex++) {
            const column = board[cIndex];
            const ColumnWin = column.reduce((acc, curr) => acc && curr, 1);
            if (ColumnWin) {
                if (checkForAll) {
                    AllWinners.push(bIndex);
                } else {
                    return bIndex;
                }
            }
        }

        for (let i = 0; i < board.length; i++) {
            let RowsWin = 1;
            for (let j = 0; j < board.length; j++) {
                const rowItem = board[j][i];
                RowsWin = RowsWin && rowItem;
            }
            if (RowsWin) {
                if (checkForAll) {
                    AllWinners.push(bIndex);
                } else {
                    return bIndex;
                }
            }
        }
    }

    if (checkForAll) {
        return AllWinners;
    } else {
        return -1;
    }
}

function solve2(input: string[]) {
    const drawnNumber = input[0].split(',').map((a) => parseInt(a));
    const boards = [];
    const DrawnBoards = [];
    let boardCounter = 0;
    let LastWinners = [];

    for (let i = 2; i < input.length; i++) {
        const currentColumn = input[i];
        if (currentColumn === '') {
            boardCounter++;
        } else {
            if (!Array.isArray(boards[boardCounter])) {
                boards[boardCounter] = [];
                DrawnBoards[boardCounter] = [];
            }
            boards[boardCounter].push(
                currentColumn
                    .split(' ')
                    .filter((a) => a !== '')
                    .map((a) => parseInt(a))
            );
            DrawnBoards[boardCounter].push(
                currentColumn
                    .split(' ')
                    .filter((a) => a !== '')
                    .map((a) => 0)
            );
        }
    }

    for (let i = 0; i < drawnNumber.length; i++) {
        const actualNumber = drawnNumber[i];
        boards.forEach((board, bIndex) => {
            board.forEach((column, cIndex) => {
                column.forEach((item, iIndex) => {
                    if (actualNumber == item) {
                        DrawnBoards[bIndex][cIndex][iIndex] = 1;
                    }
                });
            });
        });
        const Winners = SomeoneHasWon(DrawnBoards, true);
        const NotWonYet = boards.filter((a, index) => {
            if (Winners.includes(index)) {
                return false;
            } else {
                return true;
            }
        });
        const LastOneWon = [];
        if (NotWonYet.length === 0) {
            const NotWonYetLast = boards
                .map((a, index) => {
                    if (LastWinners.includes(index)) {
                        return -1;
                    } else {
                        return index;
                    }
                })
                .filter((a) => a >= 0);
            if (NotWonYetLast.length > 1) {
                console.warn("More than one haven't won last time!");
            }
            LastOneWon.push(NotWonYetLast[0]);
        }

        if (LastOneWon.length === 1) {
            const Winner = LastOneWon[0];
            let WinnerScore = 0;
            for (let cIndex = 0; cIndex < boards[Winner].length; cIndex++) {
                const column = boards[Winner][cIndex];
                for (let index = 0; index < column.length; index++) {
                    const item = column[index];
                    if (DrawnBoards[Winner][cIndex][index] === 0) {
                        WinnerScore += item;
                    }
                }
            }
            return actualNumber * WinnerScore;
        } else {
            LastWinners = Winners;
        }
    }
    return 'ERROR';
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename, '\n', false);

    const testResult = 4512;
    const testResult2 = 1924;

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

start(
    __filename,
    { tests: TestBoth, solve, solve2 },
    { inputOptions: { separator: '\n', filterOutEmptyLines: false } }
);
