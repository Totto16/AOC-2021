const fs = require('fs');
const path = require('path');
const term = require('terminal-kit').terminal;
const { spawn } = require('child_process');
const { performance } = require('perf_hooks');

function* walkSync(dir, relative, FolderMatch, fileMatch) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            if (!FolderMatch || FolderMatch.test(file.name)) {
                yield* walkSync(path.join(dir, file.name), relative, FolderMatch, fileMatch);
            }
        } else {
            if (!fileMatch || fileMatch.test(file.name)) {
                yield path.join(dir, file.name);
            }
        }
    }
}

function parseArgs() {
    let options = { index: 'select', skipSlow: false, no_tests: false, mute: false, debug: false };
    process.argv.forEach((string) => {
        if (string.startsWith('-')) {
            let arg = string.replace('-', '');
            let arg2 = string.replace('--', '');
            let isNumber = !isNaN(parseInt(arg2)) ? parseInt(arg2) : false;
            switch (arg) {
                case '-all':
                    options.index = 0;
                    break;
                case '-help':
                    printHelp();
                    break;
                case 'h':
                    printHelp();
                    break;
                case '?':
                    printHelp();
                    break;
                case '-no-tests':
                    options.no_tests = true;
                    break;
                case 't':
                    options.no_tests = true;
                    break;
                case '-autoskipslow':
                    options.skipSlow = true;
                    break;
                case 's':
                    options.skipSlow = true;
                    break;
                case 'm':
                    options.mute = true;
                    break;
                case '-mute':
                    options.mute = true;
                    break;
                case 'd':
                    options.debug = true;
                    break;
                case '-debug':
                    options.debug = true;
                    break;
                case 'v':
                    options.debug = true;
                    break;
                case '-verbose':
                    options.debug = true;
                    break;
                case 'f':
                    printOutChristmasTree();
                    break;
                case '-format':
                    printOutChristmasTree();
                    break;
                case '-tree':
                    printOutChristmasTree();
                    break;
                default:
                    if (isNumber !== false) {
                        options.index = isNumber;
                    }
                    break;
            }
        } else if (string.trim() === '?') {
            printHelp();
        }
    });
    return options;
}

async function main() {
    UserCancel();
    let options = parseArgs();
    if (options.debug) {
        !options.mute && term.white('[DEBUG] argv: ', JSON.stringify(options), '\n');
    }
    term.magenta('Loading Available Solutions...\n');
    const AllNumbers = [];
    for (const filePath of walkSync(__dirname, true, /Day (\d{2})/i, /index\.js$/i)) {
        const Group = filePath.match(/Day (\d{2})/i);
        if (!Group) {
            continue;
        }
        const number = parseInt(Group[1]);
        AllNumbers.push({ number, filePath });
    }
    if (options.index === 'select') {
        term.green('Select an Option:\n');
        const items = ['all: Run all Available Solutions'].concat(
            AllNumbers.map((a) => `${a.number}: Run the Solution of Day ${a.number.toString().padStart(2, '0')}`)
        );
        term.singleColumnMenu(items, {}, async function (error, response) {
            term.previousLine(AllNumbers.length + 1);
            term.eraseDisplayBelow();
            await runThat({ ...options, index: response.selectedIndex }, AllNumbers);
            process.exit(0);
        });
    } else {
        await runThat(options, AllNumbers);
        process.exit(0);
    }
}

function printHelp(returnAvailable = false) {
    const AvailableArgs = [
        {
            type: 'normal',
            args: ['--all'],
            description: 'Runs all available Solutions',
        },
        {
            type: 'normal',
            args: ['--format', '-f', '--tree'],
            description: 'Prints the picture of the calender on the website!',
        },
        {
            type: 'normal',
            args: ['--help', '-h', '-?'],
            description: 'Shows this help page',
        },
        {
            type: 'internal',
            args: ['--no-tests', '-t'],
            representation: 'no_tests',
            description: 'Skips the tests, the performance is slightly better',
        },
        {
            type: 'internal',
            args: ['--autoskipslow', '-s'],
            representation: 'skipSlow',
            description: 'Auto skips solutions marked as slow',
        },
        {
            type: 'internal',
            args: ['--mute', '-m'],
            representation: 'mute',
            description: 'Completely mutes everything (Status code will indicate only the status))',
        },
        {
            type: 'internal',
            args: ['--verbose', '-v', '--debug', '-d'],
            representation: 'debug',
            description: 'Print additional Information, at the moment only additional timing and argv logging is available. for additional debugging set debug in \'utils.js\' to \'true\'',
        },
        {
            type: 'which',
            args: ['--{number}'],
            params: ['{number} is a valid Number from Day 1 - actual Day, maximum 25'],
            description: 'Runs the Solution for that day',
        },
    ];

    if (returnAvailable) {
        return AvailableArgs;
    }

    term.blue('HELP Page:\n\n');
    term.cyan('node . [options]\n\nOptions:\n');

    AvailableArgs.forEach((arg) => {
        let { args, params, description } = arg;
        let text = `${args.join(', ')}${params ? ` -> ${params.join(', ')}` : ''} : ${description}`;
        term.green(`${text}\n`);
    });
    term.red(
        '\n\n',
        "Note: The selection mode has some serious bugs, like Aborting with Ctrl+C doesn't work ans some minor ones, so if you need to run one please consider using --{number} instead!"
    );
    process.exit(0);
}

function printOutChristmasTree() {
    function* gen(){
        let available = "bcmyrgw".split('');
        do{
            let i = Math.floor(Math.random()*available.length)
            yield `^${available[i]}`;
        }while(true)
    }
    let color = gen();
    term.cyan(`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n`);
    term.cyan(` .       .  .      .  . '  ...   ^w.   ^c.  ${color.next().value}.  ^y..''''\n`);
    term.cyan(`    .  .           . . .        ^w. ^c.  ${color.next().value}.^c.${color.next().value}.  ^y:      \n`);
    term.cyan(` ~     . .      '     .    .' ${color.next().value}. ^w.' ${color.next().value}.  ^y....'      \n`);
    term.cyan(`~     . '...    ' .         ${color.next().value}. ^y.^r.^w|\\^r.^y.''           \n`);
    term.cyan(`   ..                      ${color.next().value}. ^y:                   \n`);
    term.cyan(`     .'         . '.     ${color.next().value}.^y:'                     \n`);
    term.cyan(`.    ~    '    ^b.^c'..        ${color.next().value}.^y'''''.....  ...^r.     \n`);
    term.cyan(`^b.^c~ .          .  .        ^y:'..${color.next().value}. ^y..${color.next().value}.  ${color.next().value}.^y''${color.next().value}.   ^r':   \n`);
    term.cyan(`   ^b'^c .           .   . .  ^y:   ''  ''''..  ${color.next().value}. ${color.next().value}.^r'^y.  \n`);
    term.blue(`.            .^c.      ^b.    ^y:             '..'.${color.next().value}.^y:  \n`);
    term.blue(`          .         .    ^y:       :'''..   ..'${color.next().value}.^y:  \n`);
    term.blue(`    .   . '          ^c. ^y.'    ..''${color.next().value}.   ${color.next().value}. ^y'''${color.next().value}.^y...:  \n`);
    term.blue(` .     . '.         ^c. ^y: ...''${color.next().value}. ^y..':   ^r..^y..'      \n`);
    term.blue(`. .    . .   .   ${color.next().value}.  ${color.next().value}. ^y:'${color.next().value}.^y...'''    ^y'^r''           \n`);
    term.yellow(`'.'.  ^b.    ^c'   ${color.next().value}.^y:'. ....'                        \n`);
    term.yellow(`   :         ${color.next().value}.^b' ^y:  '                             \n`);
    term.yellow(`   :        ${color.next().value}. ^y..'                                \n`);
    term.yellow(`   '. ^b.    ${color.next().value}.^b. ^y:                                  \n`);
    term.yellow(`    '.     ^b.${color.next().value}. ^y:                                   \n`);
    term.yellow(`     :  ^c.^b.${color.next().value}. ^y:                                     \n`);
    term.yellow(`     '. ^b.${color.next().value}.  ^y:             ^wA^yO^gC ^c2^b0^m2^r1              \n`);
    term.yellow(`      : ^b~.${color.next().value}.^y.'                ^gb^cy                 \n`);
    term.yellow(`      : ${color.next().value}. ^y.'                ^yT^go^ct^bt^mo               \n`);
    term.yellow(`      :..:                                      \n`);
    process.exit(0);
}

async function runThat(options, AllNumbers) {
    if (options.index == 0) {
        term.blue(`Now running ALL Available Solutions:\n`);
        for (let i = 0; i < AllNumbers.length; i++) {
            const selected = AllNumbers[i];
            term.green(`Now running Solution for Day ${selected.number.toString().padStart(2, '0')}:\n`);
            const { code, output, timing } = await runProcess(selected.filePath, options);
            let timeString;
            if (options.debug) {
                timeString = 'Timings:\n';
                let sortedTimings = Object.entries(timing).sort((a, b) => a[1] - b[1]);
                sortedTimings.forEach(([name, time], index) => {
                    if (name != 'start') {
                        timeString += `^g${name}: ${formatTime(time - sortedTimings[index - 1][1])}${
                            index < sortedTimings.length - 1 ? '\n' : '\n'
                        }`;
                    }
                });
                timeString += `^gall: ${formatTime(timing.end - timing.start)}`;
            } else {
                timeString = `It took ${formatTime(timing.end - timing.start)}`;
            }
            if (code == 0) {
                !options.mute && term.cyan(`Got Results:\n${output[0].join('')}\n^y${timeString}\n\n`);
            } else {
                switch (code) {
                    case 43:
                        !options.mute && term.yellow(`${output[0].join('')}`);
                        !options.mute && term.yellow(`${timeString}\n\n`);
                        break;
                    case 7:
                        !options.mute && term.yellow(`${output[2].join('')}\n^y${timeString}\n\n`);
                        break;
                    case 69:
                        term.red(`Test failed with: ${code}:\n${output[1].join('')}`);
                        term.yellow(`${output[2].join('')}\n^y${timeString}\n\n`);
                        break;
                    default:
                        term.red(`Got Error with code ${code}:\n${output[1].join('')}`);
                        term.yellow(`${output[2].join('')}\n^y${timeString}\n\n`);
                }
            }
        }
        printOutChristmasTree();
    } else {
        const selected = AllNumbers[options.index - 1];
        if (!selected) {
            term.red(`This number is not supported: ${options.index}\n`);
            process.exit(1);
        }
        !options.mute && term.green(`Now running Solution for Day ${selected.number.toString().padStart(2, '0')}:\n`);
        const { code, output, timing } = await runProcess(selected.filePath, options);
        let timeString;
        if (options.debug) {
            timeString = 'Timings:\n';
            let sortedTimings = Object.entries(timing).sort((a, b) => a[1] - b[1]);
            sortedTimings.forEach(([name, time], index) => {
                if (name != 'start') {
                    timeString += `^g${name}: ${formatTime(time - sortedTimings[index - 1][1])}${
                        index < sortedTimings.length - 1 ? '\n' : '\n'
                    }`;
                }
            });
            timeString += `^gall: ${formatTime(timing.end - timing.start)}`;
        } else {
            timeString = `It took ${formatTime(timing.end - timing.start)}`;
        }
        if (code == 0) {
            !options.mute && term.cyan(`Got Results:\n${output[0].join('')}\n^y${timeString}\n\n`);
        } else {
            switch (code) {
                case 43:
                    !options.mute && term.yellow(`${output[0].join('')}`);
                    !options.mute && term.yellow(`${timeString}\n\n`);
                    break;
                case 7:
                    !options.mute && term.yellow(`${output[2].join('')}\n^y${timeString}\n\n`);
                    break;
                case 69:
                    term.red(`Test failed with: ${code}:\n${output[1].join('')}`);
                    term.yellow(`${output[2].join('')}\n^y${timeString}\n\n`);
                    break;
                default:
                    term.red(`Got Error with code ${code}:\n${output[1].join('')}`);
                    term.yellow(`${output[2].join('')}\n^y${timeString}\n\n`);
            }
        }
    }
}

function formatTime(input) {
    if (1 > input) {
        let ns = Math.round(input * 1000);
        return `^g0.${ns} ms`;
    } else if (1000 > input) {
        let ms = Math.round(input);
        return `^g${ms} ms`;
    } else if (60 * 1000 > input) {
        let s = Math.floor(input / 1000);
        let ms = Math.round(input % 1000);
        return `^r${s}.${ms} s`;
    }
}

async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function toArgs(options) {
    const AvailableOptions = printHelp(true).filter((arg) => arg.type == 'internal');
    let result = [];
    for (let i = 0; i < AvailableOptions.length; i++) {
        if (options[AvailableOptions[i].representation]) {
            result.push(AvailableOptions[i].args[0]);
        }
    }
    return result;
}

async function runProcess(filePath, options) {
    const start = performance.now();
    let timing = { start };
    return await new Promise((resolve, reject) => {
        const output = [[], [], []]; // stdout, stderr, error
        const programm = spawn('node', [filePath, ...toArgs(options)], {
            cwd: path.dirname(filePath),
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        });

        programm.on('error', function (error) {
            output[2].push(error);
            if (programm.connected) {
                programm.disconnect();
            }
            timing.end = performance.now();
            resolve({ code: 69, output, timing });
        });

        programm.stdout.on('data', function (data) {
            output[0].push(data.toString());
        });

        programm.stderr.on('data', function (data) {
            output[1].push(data.toString());
        });

        programm.on('message', function (message) {
            let res;
            try {
                res = JSON.parse(message);
            } catch (err) {
                term.red("Couldn't parse IPC message!\n");
            }
            switch (res.type) {
                case 'slow':
                    term.red(`${res.message}\n`);
                    term.yellow('To interrupt this press c!\n');
                    process.stdin.resume();
                    process.stdin.setEncoding('utf8');
                    process.stdin.on('data', function (data) {
                        if (data.startsWith('c')) {
                            programm.kill('SIGINT'); // used signal(but not triggerable by Ctrl+C), to indicate the right thing!
                            process.stdin.pause();
                            output[2].push('Cancelled by User\n');
                            if (programm.connected) {
                                programm.disconnect();
                            }
                            timing.end = performance.now();
                            resolve({ code: 7, output, timing });
                        }
                    });
                    break;
                case 'time':
                    timing[res.what] = performance.now();
                    break;
                case 'message':
                    output[0].push(res.message);
                    break;
                default:
                    term.red(`Not recognized IPC message of type: ${res.type}`);
                    break;
            }
            if (res.type === 'error') {
            }
        });
        programm.on('close', function (code) {
            if (programm.connected) {
                programm.disconnect();
            }
            timing.end = performance.now();
            resolve({ code, output, timing });
        });
    });
}

function UserCancel() {
    process.on('SIGINT', () => {
        term.red(`\nEverything was cancelled by User\n`);
        process.exit(0);
    });
}

main();
