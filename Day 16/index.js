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
    if (Array.isArray(input)) {
        input = input[0];
    }
    let numbers = parse_BITS(input);
    return getVersions(numbers);
}

function solve2(input, mute = false) {
    if (Array.isArray(input)) {
        input = input[0];
    }
    let numbers = parse_BITS(input);
    return evaluate(numbers);
}

function getVersions(obj) {
    let f = (acc, packet) => {
        if (Array.isArray(packet.sub_packets)) {
            return acc + packet.version + packet.sub_packets.reduce(f, 0);
        }
        return acc + packet.version;
    };
    let all = obj.reduce(f, 0);
    return all;
}

function evaluate(pack) {
    if (Array.isArray(pack) && pack.length == 1) {
        pack = pack[0];
    }

    if (pack.value) {
        return pack.value;
    } else {
        pack.sub_packets = pack.sub_packets.map((p) => evaluate(p));
        let two = pack.sub_packets.length > 1 ? pack.sub_packets[1] : null;
        let temp = pack.eval(pack.sub_packets[0], two);
        for (let i = 2; i < pack.sub_packets.length; i++) {
            temp = pack.eval(temp, pack.sub_packets[i]);
        }
        pack.value = temp;
    }
    return pack.value;

    return 0;
}

function parse_BITS(input, isHex = true, amount = -1) {
    const bits = isHex ? parseInput(input) : input;
    const packets = [];
    let packet_begin = 0;

    while (packet_begin < bits.length && (amount < 0 || amount > packets.length)) {
        let new_packet = {};
        let current_index = packet_begin;
        if (bits.substring(current_index).length < 10) {
            break;
        }
        new_packet.version = parseInt(bits.substring(current_index, current_index + 3), 2);
        current_index += 3;
        new_packet.typeID = parseInt(bits.substring(current_index, current_index + 3), 2);
        current_index += 3;
        if (new_packet.typeID == 4) {
            let subst = bits.substring(current_index, current_index + 5).split('');
            current_index += 5;
            new_packet.value = '';
            new_packet.type = 'literal';
            do {
                new_packet.value += subst.join('').substring(1);
                if (subst[0] == '0' || subst.length == 0) {
                    new_packet.value = parseInt(new_packet.value, 2);
                    break;
                }
                subst = bits.substring(current_index, current_index + 5).split('');
                current_index += 5;
            } while (true);
        } else {
            switch (new_packet.typeID) {
                case 0:
                    new_packet.type = 'sum';
                    new_packet.eval = (a, b) => {
                        if (b === null) {
                            if (a === null) {
                                console.error("FATAL in 'sum'");
                                process.exit(66);
                            }
                            return a;
                        }
                        if (a === null) {
                            if (b === null) {
                                console.error("FATAL in 'sum'");
                                process.exit(66);
                            }
                            return b;
                        }
                        return a + b;
                    };
                    break;
                case 1:
                    new_packet.type = 'product';
                    new_packet.eval = (a, b) => {
                        if (b === null) {
                            if (a === null) {
                                console.error("FATAL in 'product'");
                                process.exit(66);
                            }
                            return a;
                        }
                        if (a === null) {
                            if (b === null) {
                                console.error("FATAL in 'product'");
                                process.exit(66);
                            }
                            return b;
                        }
                        return a * b;
                    };
                    break;
                case 2:
                    new_packet.type = 'minimum';
                    new_packet.eval = (a, b) => {
                        if (b === null) {
                            if (a === null) {
                                console.error("FATAL in 'minimum'");
                                process.exit(66);
                            }
                            return a;
                        }
                        if (a === null) {
                            if (b === null) {
                                console.error("FATAL in 'minimum'");
                                process.exit(66);
                            }
                            return b;
                        }
                        return Math.min(a, b);
                    };
                    break;
                case 3:
                    new_packet.type = 'maximum';
                    new_packet.eval = (a, b) => {
                        if (b === null) {
                            if (a === null) {
                                console.error("FATAL in 'maximum'");
                                process.exit(66);
                            }
                            return a;
                        }
                        if (a === null) {
                            if (b === null) {
                                console.error("FATAL in 'maximum'");
                                process.exit(66);
                            }
                            return b;
                        }
                        return Math.max(a, b);
                    };
                    break;
                case 5:
                    new_packet.type = 'greater';
                    new_packet.eval = (a, b) => {
                        if (b === null) {
                            console.error('Not enough arguments provided "greater"');
                        }
                        return a > b ? 1 : 0;
                    };
                    break;
                case 6:
                    new_packet.type = 'less';
                    new_packet.eval = (a, b) => {
                        if (b === null) {
                            console.error('Not enough arguments provided "less"');
                        }
                        return a < b ? 1 : 0;
                    };
                    break;
                case 7:
                    new_packet.type = 'equal';
                    new_packet.eval = (a, b) => {
                        if (b === null) {
                            console.error('Not enough arguments provided "equal"');
                        }
                        return a == b ? 1 : 0;
                    };
                    break;
                default:
                    console.warn('Not recognized TypeID');
            }

            let Length_ID = bits.substring(current_index, current_index + 1);
            current_index += 1;
            if (Length_ID == '1') {
                let packet_amount = parseInt(bits.substring(current_index, current_index + 11), 2);

                current_index += 11;
                new_packet.sub_packets = parse_BITS(bits.substring(current_index), false, packet_amount);
                current_index += new_packet.sub_packets.reduce((acc, packs) => acc + packs.total_length, 0);
            } else {
                let packet_size = parseInt(bits.substring(current_index, current_index + 15), 2);
                current_index += 15;
                new_packet.sub_packets = parse_BITS(bits.substring(current_index, current_index + packet_size), false);
                current_index += packet_size;
            }
        }
        new_packet.total_length = current_index - packet_begin;
        packet_begin = current_index;
        packets.push(new_packet);
    }
    return packets;
}

function parseInput(input) {
    // parseInt(input,16).toString(2).padStart(input.length*4,"0") would work, but for large ones it fails!
    let result = [];
    for (let i = 0; i < input.length; i++) {
        result.push(parseInt(input[i], 16).toString(2).padStart(4, '0'));
    }
    return result.join('').padStart(input.length, '0');
}

function testAll() {
    let t_input = getFile('./sample.txt');
    let t_input2 = getFile('./sample2.txt');
    let t_result = [6, 9, 14, 16, 12, 23, 31];
    let t_result2 = [3, 54, 7, 9, 1, 0, 0, 1];

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
    }

    for (let i = 0; i < t_input2.length; i++) {
        const testInput2 = t_input2[i];
        const testResult2 = t_result2[i];
        let test2 = solve2(testInput2, true);
        if (test2 != testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
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
        testAll();
    }

    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
