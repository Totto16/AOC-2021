const fs = require('fs');
const path = require('path');
const term = require('terminal-kit').terminal;
const { exec } = require('child_process');

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
    let option = 'select';
    process.argv.forEach((string) => {
        if (string.startsWith('--')) {
            let arg = string.replace('--', '');
            let isNumber = !isNaN(parseInt(arg)) ? parseInt(arg) : false;
            if (arg === 'all') {
                option = 0;
            } else if (isNumber !== false) {
                option = isNumber;
            }
        }
    });
    term.magenta('Loading Available Solutions...\n');
    const AllNumbers = [];
    for (const filePath of walkSync(__dirname, true, /Day (\d{2})/i, /.*\.js$/i)) {
        const Group = filePath.match(/Day (\d{2})/i);
        if (!Group) {
            continue;
        }
        const number = parseInt(Group[1]);
        AllNumbers.push({ number, filePath });
    }
    if (option === 'select') {
        term.green('Select an Option:\n');
        const items = ['all: Run all Available Solutions'].concat(
            AllNumbers.map((a) => `${a.number}: Run the Solution of Day ${a.number.toString().padStart(2, '0')}`)
        );
        term.singleColumnMenu(items, {}, async function (error, response) {
            term.previousLine(AllNumbers.length + 1);
            term.eraseDisplayBelow();
            await runThat(response.selectedIndex, AllNumbers);
            process.exit(0);
        });
    } else {
        await runThat(option, AllNumbers);
        process.exit(0);
    }
}

async function runThat(index, AllNumbers) {
    if (index == 0) {
        term.blue(`Now running ALL Available Solutions:\n`);
        for (let i = 0; i < AllNumbers.length; i++) {
            const selected = AllNumbers[i];
            term.green(`Now running Solution for Day ${selected.number.toString().padStart(2, '0')}:\n`);
            const { code, output } = await runProcess(selected.filePath);
            if (code == 0) {
                term.cyan(`Got Results:\n${output[0].join('\n')}`);
            } else {
                term.red(`Got Error with code ${code}:\n${output[1].join('\n')}`);
                term.yellow(`${output[2].join('\n')}`);
            }
        }
    } else {
        index--;
        const selected = AllNumbers[index];
        term.green(`Now running Solution for Day ${selected.number.toString().padStart(2, '0')}:\n`);
        const { code, output } = await runProcess(selected.filePath);
        if (code == 0) {
            term.cyan(`Got Results:\n${output[0].join('\n')}`);
        } else {
            term.red(`Got Error with code ${code}:\n${output[1].join('\n')}`);
            term.yellow(`${output[2].join('\n')}`);
        }
    }
}

async function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

async function runProcess(filePath) {
    return await new Promise((resolve, reject) => {
        const output = [[], [], []];
        const programm = exec(`node "${filePath}"`, { cwd: path.dirname(filePath) }, function (error, stdout, stderr) {
            if (error) {
                output[2].push(error);
                reject({ code: 69, output });
            }
            output[0].push(stdout);
            output[1].push(stderr);
        });

        programm.on('close', function (code) {
            resolve({ code, output });
        });
    });
}

main();
