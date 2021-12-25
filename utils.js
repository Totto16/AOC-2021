let path = require('path');
let debug = false;

function logDebug(...args) {
    if (debug) {
        console.log(`[DEBUG] `, ...args);
        return true;
    }
    return false;
}

function getFile(filePath, filename, seperator = '\n', filterOutEmptyLines = true) {
    let dirname = path.dirname(filename ?? __filename);
    let file = path.join(dirname, filePath);
    let result = require('fs')
        .readFileSync(file)
        .toString()
        .split(seperator)
        .filter((a) => !filterOutEmptyLines || a != '');
    if (result.some((a) => a.split('').includes('\r'))) {
        result = result.map((a) => a.replaceAll(/\r/g, ''));
    }
    return result;
}

function initPrototypes() {
    //some useful Functions, copy from Day 09 and further along to have all useful functions on Arrays
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

    Object.defineProperty(Array.prototype, 'isArray', {
        value: function () {
            return true;
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

    Object.defineProperty(Array.prototype, 'fillElements', {
        value: function (start = 0, end = 1000) {
            let first = this;
            if (!Array.isArray(first)) {
                return [];
            }
            if (first.length > 3) {
                return first;
            }
            let newArray = [];
            for (let i = 0; i < first.length; i++) {
                if (first[i] === '..') {
                    let startNumber = i > 0 ? first[i - 1] : start;
                    let endNumber = i < first.length - 1 ? first[i + 1] : end;
                    let diff = endNumber >= startNumber ? 1 : -1;
                    let compareFunction = endNumber >= startNumber ? (a, b) => a <= b : (a, b) => a >= b;
                    for (let j = startNumber; compareFunction(j, endNumber); j += diff) {
                        newArray.push(j);
                    }
                }
            }
            return newArray;
        },
    });

    Object.defineProperty(Array.prototype, 'print', {
        value: function () {
            try {
                let toPrint = JSON.stringify(this);
                console.log(toPrint);
            } catch (e) {
                return false;
            }
            return;
        },
    });
}

function slowWarning(type) {
    process.on('SIGINT', () => {
        if (process.connected) {
            process.disconnect();
        }
        process.exit(0);
    });
    let message = type == 0 ? 'Attention: Moderately Slow' : type == 1 ? 'ATTENTION: SLOW' : 'Unknown Slow Type';
    let level = type == 0 ? 'moderate' : type == 1 ? 'severe' : 'unknown';
    return sendIpc({ type: 'slow', message, level });
}

function sendIpc(message, options) {
    if (process.send) {
        if (typeof message != 'string') {
            message = JSON.stringify(message);
        }
        process.send(message);
        return true;
    }
    logDebug(message);
    ccc;
    return false;
}

function parseArgs() {
    let args = { skipSlow: false, no_tests: false, mute: false, debug: false };
    process.argv.forEach((string) => {
        if (string.startsWith('-')) {
            let arg = string.replace('-', '');
            switch (arg) {
                case '-no-tests':
                    args.no_tests = true;
                    break;
                case 't':
                    args.no_tests = true;
                    break;
                case '-autoskipslow':
                    args.skipSlow = true;
                    break;
                case 's':
                    args.skipSlow = true;
                    break;
                case 'm':
                    args.mute = true;
                    break;
                case '-mute':
                    args.mute = true;
                    break;
                case 'd':
                    args.debug = true;
                    break;
                case '-debug':
                    args.debug = true;
                    break;
                case 'v':
                    args.debug = true;
                    break;
                case '-verbose':
                    args.debug = true;
                    break;
                default:
                    break;
            }
        }
    });
    return args;
}

function start(filename, methods, options) {
    options = options || {};
    sendIpc({ type: 'time', what: 'start' });
    let args = parseArgs();
    logDebug(`parsed argv: `, args, 'real argv:', process.argv);
    if (options.needsPrototypes) {
        initPrototypes();
    }

    if (methods.tests && !args.no_tests) {
        methods.tests(args.mute);
        sendIpc({ type: 'time', what: 'tests' });
    }
    if (options.slowness !== undefined && args.skipSlow) {
        sendIpc({ type: 'message', message: 'Auto Skipped Moderately Slow\n' });
        process.exit(43);
    }
    if (options.slowness !== undefined) {
        slowWarning(options.slowness);
    }
    filename = filename ?? __filename;
    let { seperator, filterOutEmptyLines } = options.inputOptions || { seperator: '\n', filterOutEmptyLines: true };
    if (methods.solve) {
        let realInput = getFile('./input.txt', filename, seperator, filterOutEmptyLines);
        let Answer = methods.solve(realInput);
        sendIpc({ type: 'message', message: `Part 1: '${Answer}'\n` });
        sendIpc({ type: 'time', what: 'part1' });
    } else if (methods.solveMessage) {
        sendIpc({ type: 'message', message: `Part 1: '${methods.solveMessage}\n'` });
        sendIpc({ type: 'time', what: 'part1' });
    }

    if (methods.solve2) {
        let realInput2 = getFile('./input.txt', filename, seperator, filterOutEmptyLines);
        let Answer2 = methods.solve2(realInput2);
        sendIpc({ type: 'message', message: `Part 2: '${Answer2}'\n` });
        sendIpc({ type: 'time', what: 'part2' });
    } else if (methods.solve2Message) {
        sendIpc({ type: 'message', message: `Part 2: '${methods.solve2Message}'\n` });
        sendIpc({ type: 'time', what: 'part2' });
    }

    process.exit(0);
}

module.exports = { start, getFile };
