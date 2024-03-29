import { start, getFile } from '../utils';
function solve(input: string[], mute = false) {
    const parsed = input.map((a) => {
        const [_, player, start] = /player\s(\d*)\sstarting\sposition:\s(\d*)/i.exec(a);
        return { player: parseInt(player), start: parseInt(start), score: 0, current: parseInt(start) };
    });
    const game = { rolled_dice: 0, players: parsed };
    const result = playGame(game);
    const players = result.players.sort((a, b) => b.score - a.score);
    return players[1].score * result.rolled_dice;
}

function solve2(input:string[], mute = false) {
    const parsed = input.map((a) => {
        const [_, player, start] = a.match(/player\s(\d*)\sstarting\sposition:\s(\d*)/i);
        return {
            player: parseInt(player),
            start: parseInt(start),
        };
    });
    global.lookupTable = {}; // we need this for recursion lookup!
    const result = universeGame(0, parsed[0].start, parsed[1].start, 0, 0);
    return Math.max(result[0], result[1]);
}

function playGame(game, winCondition = (player) => player.score >= 1000) {
    let dice_seed = 0;
    outer: do {
        for (let i = 0; i < game.players.length; i++) {
            const dices = [];
            for (let _ = 0; _ < 3; _++) {
                game.rolled_dice++;
                dices.push((dice_seed % 100) + 1);
                dice_seed = (dice_seed + 1) % 100;
            }

            const turns = dices.reduce((acc, cnt) => acc + cnt, 0);
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
    const StringIndexer = [player, point1, point2, currentScore, identifier].join();
    const wins = [0, 0];
    let result = global.lookupTable[StringIndexer];
    if (!result) {
        for (let i = 1; i <= 3; i++) {
            for (let j = 1; j <= 3; j++) {
                for (let k = 1; k <= 3; k++) {
                    const indexes = i + j + k;
                    const score = ((point1 + indexes - 1) % 10) + 1;
                    const allScore = currentScore + score;
                    if (allScore >= 21) {
                        wins[player]++;
                    } else {
                        const next = universeGame(1 - player, point2, score, identifier, allScore);
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
    const t_input = [getFile('./sample.txt', __filename)];
    const t_result = [739785];
    const t_result2 = [444356092776315];

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

// This solution is also not that slow, but for that amount of parallel universes it takes over 2 secs

start(__filename, { tests: testAll, solve, solve2 }, { needsPrototypes: true, slowness: 0 });
