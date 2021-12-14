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

async function main() {
    let options = { index: 'select', skipSlow: false, no_tests: false };
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
                default:
                    if (isNumber !== false) {
                        options.index = isNumber;
                    }
            }
        } else if (string.trim() === '?') {
            printHelp();
        }
    });
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

    process.exit(0);
}

async function runThat(options, AllNumbers) {
    if (options.index == 0) {
        term.blue(`Now running ALL Available Solutions:\n`);
        for (let i = 0; i < AllNumbers.length; i++) {
            const selected = AllNumbers[i];
            term.green(`Now running Solution for Day ${selected.number.toString().padStart(2, '0')}:\n`);
            const { code, output, time } = await runProcess(selected.filePath, options);
            if (code == 0) {
                term.cyan(`Got Results:\n${output[0].join('')}^yIt took ${formatTime(time)}\n\n`);
            } else {
                switch (code) {
                    case 43:
                        term.yellow(`${output[0].join('')}`);
                        term.yellow(`It took ${formatTime(time)}\n\n`);
                        break;
                    case 69:
                        term.red(`Test failed with: ${code}:\n${output[1].join('')}`);
                        term.yellow(`${output[2].join('')}^yIt took ${formatTime(time)}\n\n`);
                        break;
                    default:
                        term.red(`Got Error with code ${code}:\n${output[1].join('')}`);
                        term.yellow(`${output[2].join('')}^yIt took ${formatTime(time)}\n\n`);
                }
            }
        }
    } else {
        const selected = AllNumbers[options.index - 1];
        if (!selected) {
            term.red(`This number is not supported (yet): ${options.index}`);
            process.exit(1);
        }
        term.green(`Now running Solution for Day ${selected.number.toString().padStart(2, '0')}:\n`);
        const { code, output, time } = await runProcess(selected.filePath, options);
        if (code == 0) {
            term.cyan(`Got Results:\n${output[0].join('')}^yIt took ${formatTime(time)}\n\n`);
        } else {
            term.red(`Got Error with code ${code}:\n${output[1].join('\n')}`);
            term.yellow(`${output[2].join('')}^yIt took ${formatTime(time)}\n\n`);
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
    return await new Promise((resolve, reject) => {
        const output = [[], [], []]; // stdout, stderr, error
        const programm = spawn('node', [filePath, '--', ...toArgs(options)], {
            cwd: path.dirname(filePath),
            stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
        });

        programm.on('error', function (error) {
            output[2].push(error);
            resolve({ code: 69, output, time: performance.now() - start });
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

            if (res.type === 'error') {
                term.red(`${res.message}\n`);
                term.yellow('To interrupt this press c!\n');
                process.stdin.resume();
                process.stdin.setEncoding('utf8');
                process.stdin.on('data', function (data) {
                    if (data.startsWith('c')) {
                        programm.kill('SIGINT');
                        output[2].push('Cancelled by User\n');
                        resolve({ code: 7, output, time: performance.now() - start });
                    }
                });
            }
        });

        programm.on('close', function (code) {
            resolve({ code, output, time: performance.now() - start });
        });
    });
}

main();
