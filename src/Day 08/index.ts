import { start, getFile } from '../utils';
function solve(input: string[]) {
    // this part is the easy one xD, so there is some overhead in this function
    const digits = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];
    const uniqueNumbers = digits.filter((a, index) => {
        const cnt = digits.reduce((acc, it) => acc + (a.length == it.length), 0);
        return cnt <= 1;
    });
    let result = 0;
    for (let i = 0; i < input.length; i++) {
        const singleLine = input[i];
        const parsed = singleLine.split('|').map((a) => a.trim().split(' '));
        result += parsed[1].filter((a) => uniqueNumbers.map((a) => a.length).includes(a.length)).length;
    }
    return result;
}

function solve2(input: string[]) {
    //her were some nasty bugs, so I had to retry it again
    const digits = ['abcefg', 'cf', 'acdeg', 'acdfg', 'bcdf', 'abdfg', 'abdefg', 'acf', 'abcdefg', 'abcdfg'];
    let result = 0;

    for (let i = 0; i < input.length; i++) {
        const singleLine = input[i];
        const mappedDigits = [digits, [...digits.keys()], Array(10).fill('')];
        const [given, toGuess] = singleLine.split('|').map((a) =>
            a
                .trim()
                .split(' ')
                .map((a) => a.split('').sort().join(''))
        );
        let mapped = Array(10).fill('');
        for (let j = 0; j < given.length; j++) {
            const current = given[j];
            if (current.length == 2) {
                mapped[1] = current;
            } else if (current.length == 3) {
                mapped[7] = current;
            } else if (current.length == 4) {
                mapped[4] = current;
            } else if (current.length == 7) {
                mapped[8] = current;
            } else {
                if (current.length == 5) {
                    [2, 3, 5].forEach((a) => {
                        if (!Array.isArray(mapped[a])) {
                            mapped[a] = [];
                        }
                        mapped[a].push(current);
                    });
                } else {
                    [0, 6, 9].forEach((a) => {
                        if (!Array.isArray(mapped[a])) {
                            mapped[a] = [];
                        }
                        mapped[a].push(current);
                    });
                }
            }
        }

        // here we use some combination technic,  4 + 9 hasn't every line possible! 4 + 0 or 4 + 6 has every line!
        mapped[9] = mapped[9]
            .filter((a) => {
                const all = Sum(mapped[4], a);
                return all.length == 6;
            })
            .join('');

        // its nearly the same here
        mapped[6] = mapped[6]
            .filter((a) => {
                const all = Sum(mapped[1], a);
                return all.length == 7;
            })
            .join('');

        // here we use the already determined ones
        mapped[0] = mapped[0]
            .filter((a) => {
                return a !== mapped[6] && a !== mapped[9];
            })
            .join('');

        // a similar approach
        mapped[2] = mapped[2]
            .filter((a) => {
                const all = Sum(mapped[9], a);
                return all.length == 7;
            })
            .join('');

        // also a similar approach
        mapped[5] = mapped[5]
            .filter((a) => {
                const all = Sum(mapped[6], a);
                return all.length == 6;
            })
            .join('');

        // as above
        mapped[3] = mapped[3]
            .filter((a) => {
                return a !== mapped[2] && a !== mapped[5];
            })
            .join('');

        //sort them to better check them for equality
        mapped = mapped.map((a) => a.split('').sort().join(''));
        const res = toGuess.map((a) => {
            return mapped.indexOf(a.split('').sort().join(''));
        });
        result += res.map((a, ind) => a * 10 ** (res.length - ind - 1)).reduce((acc, cnt) => acc + cnt, 0);
    }
    return result;
}

function Sum(string1, string2) {
    return [...new Set(string1.split('').concat(string2.split('')))];
}

function TestBoth() {
    const testInput = getFile('./sample.txt', __filename);

    const testResult = 26;
    const testResult2 = 61229;

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
