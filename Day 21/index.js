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
    let parsed = input.map((a) => {
        let [_, player, start] = a.match(/Player\s(\d*)\sstarting\sposition:\s(\d*)/i);
        return { player: parseInt(player), start: parseInt(start), score: 0, current: parseInt(start) };
    });
    let game = { rolled_dice: 0, players: parsed };
    let result = playGame(game);
    let players = result.players.sort((a, b) => b.score - a.score);
    return players[1].score * result.rolled_dice;
}

function solve2(input, mute = false) {
    let parsed = input.map((a) => {
        let [_, player, start] = a.match(/Player\s(\d*)\sstarting\sposition:\s(\d*)/i);
        return {
            player: parseInt(player),
            start: parseInt(start),
        };
    });
    global.lookupTable = {}; // we need this for recursion lookup!
    let result = universeGame(0, parsed[0].start, parsed[1].start, 0, 0);
    return Math.max(result[0], result[1]);
}

function playGame(game, winCondition = (player) => player.score >= 1000) {
    let dice_seed = 0;
    outer: do {
        for (let i = 0; i < game.players.length; i++) {
            let dices = [];
            for (let _ = 0; _ < 3; _++) {
                game.rolled_dice++;
                dices.push((dice_seed % 100) + 1);
                dice_seed = (dice_seed + 1) % 100;
            }

            let turns = dices.reduce((acc, cnt) => acc + cnt, 0);
            game.players[i].current = ((game.players[i].current + turns - 1) % 10) + 1;
            game.players[i].score += game.players[i].current;
            if (SomeOneHasWon(game.players, winCondition)) {
                break outer;
            }
        }
    } while (true);
    return game;
}

function universeGame(player, point1, point2, currentScore = 0, identifier = 0) {
    let StringIndexer = [player, point1, point2, currentScore, identifier].join();
    let wins = [0, 0];
    let result = global.lookupTable[StringIndexer];
    if (!result) {
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                for (let k = 1; k <= 3; k++) {
                    let indexes = i + j + k;
                    let score = ((point1 + indexes - 1) % 10) + 1;
                    let allScore = currentScore + score;
                    if (allScore >= 21) {
                        wins[player]++;
                    } else {
                        let next = universeGame(1 - player, point2, score, identifier, allScore);
                        next.forEach((res, index) => (wins[index] += res));
                    }
                }
            }
        }
        global.lookupTable[StringIndexer] = wins;
        result = wins;
    }
    return result;
}

function SomeOneHasWon(players, winCondition) {
    for (let i = 0; i < players.length; i++) {
        if (winCondition(players[i])) {
            return true;
        }
    }
    return false;
}

function testAll() {
    let t_input = [getFile('./sample.txt')];
    let t_result = [739785];
    let t_result2 = [444356092776315];

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

function initPrototype() {
    //some useful Functions, copy from Day 09
    Object.defineProperty(Array.prototype, 'equals', {
        value: function (second, amount = -1) {
            let first = this;
            if (!first.isArray || !second.isArray) {
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

    Object.defineProperty(Array.prototype, 'combine', {
        value: function (second, flat = true) {
            let first = this;
            if (!Array.isArray(first) || !Array.isArray(second)) {
                return [];
            }
            let result = [];
            for (let i = 0; i < first.length; i++) {
                for (let j = 0; j < second.length; j++) {
                    let p = [first[i], second[j]];
                    if (flat && (Array.isArray(first[i]) || Array.isArray(second[j]))) {
                        p = p.flat();
                    }
                    result.push(p);
                }
            }
            return result;
        },
    });
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

    initPrototype();
    if (doTests) {
        testAll();
    }
    // This solution is also not that slow, but for that amount of parallel universes it takes over 2 secs
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
