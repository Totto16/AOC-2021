function getFile(filePath, seperator = '\n') {
    let result = require('fs').readFileSync(filePath).toString().split(seperator); //ATTENTION; NOT FILTER!!
    if (result.some((a) => a.split('').includes('\r'))) {
        result = result.map((a) => a.replaceAll(/\r/g, ''));
    }
    return result;
}

function solve(input) {
    let drawnNumber = input[0].split(',').map((a) => parseInt(a));
    let boards = [];
    let DrawnBoards = [];
    let boardCounter = 0;

    for (let i = 2; i < input.length; i++) {
        let currentColumn = input[i];
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
                    .filter((a) => a != '')
                    .map((a) => parseInt(a))
            );
            DrawnBoards[boardCounter].push(
                currentColumn
                    .split(' ')
                    .filter((a) => a != '')
                    .map((a) => 0)
            );
        }
    }

    for (let i = 0; i < drawnNumber.length; i++) {
        let actualNumber = drawnNumber[i];
        boards.forEach((board, bIndex) => {
            board.forEach((column, cIndex) => {
                column.forEach((item, iIndex) => {
                    if (actualNumber == item) {
                        DrawnBoards[bIndex][cIndex][iIndex] = 1;
                    }
                });
            });
        });
        let Winner = SomeoneHasWon(DrawnBoards);
        if (Winner > -1) {
            let WinnerScore = 0;
            for (let cIndex = 0; cIndex < boards[Winner].length; cIndex++) {
                let column = boards[Winner][cIndex];
                for (let index = 0; index < column.length; index++) {
                    let item = column[index];
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
    let AllWinners = [];
    for (let bIndex = 0; bIndex < ToCheck.length; bIndex++) {
        let board = ToCheck[bIndex];
        for (let cIndex = 0; cIndex < board.length; cIndex++) {
            let column = board[cIndex];
            let ColumnWin = column.reduce((acc, curr) => acc && curr, 1);
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
                let rowItem = board[j][i];
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

function solve2(input) {
    let drawnNumber = input[0].split(',').map((a) => parseInt(a));
    let boards = [];
    let DrawnBoards = [];
    let boardCounter = 0;
    let LastWinners = [];

    for (let i = 2; i < input.length; i++) {
        let currentColumn = input[i];
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
                    .filter((a) => a != '')
                    .map((a) => parseInt(a))
            );
            DrawnBoards[boardCounter].push(
                currentColumn
                    .split(' ')
                    .filter((a) => a != '')
                    .map((a) => 0)
            );
        }
    }

    for (let i = 0; i < drawnNumber.length; i++) {
        let actualNumber = drawnNumber[i];
        boards.forEach((board, bIndex) => {
            board.forEach((column, cIndex) => {
                column.forEach((item, iIndex) => {
                    if (actualNumber == item) {
                        DrawnBoards[bIndex][cIndex][iIndex] = 1;
                    }
                });
            });
        });
        let Winners = SomeoneHasWon(DrawnBoards, true);
        let NotWonYet = boards.filter((a, index) => {
            if (Winners.includes(index)) {
                return false;
            } else {
                return true;
            }
        });
        let LastOneWon = [];
        if (NotWonYet.length == 0) {
            let NotWonYetLast = boards
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

        if (LastOneWon.length == 1) {
            let Winner = LastOneWon[0];
            let WinnerScore = 0;
            for (let cIndex = 0; cIndex < boards[Winner].length; cIndex++) {
                let column = boards[Winner][cIndex];
                for (let index = 0; index < column.length; index++) {
                    let item = column[index];
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
    let testInput = getFile('./sample.txt');

    let testResult = 4512;
    let testResult2 = 1924;

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
        TestBoth();
    }

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);

    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
