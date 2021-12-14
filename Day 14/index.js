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
    let parsed = input.map(a=>a.includes('->')?a.split('->').map(b=>b.trim()):a);
    let template = parsed[0];
    let insertion = parsed.filter(a=>Array.isArray(a)).reduce((obj, arr) => (obj[arr[0]] = arr[1], obj) ,{});

    let rounds = 10;

    for(let i = 0; i < rounds; i++){
        let temp_template = template.split('');
        for(let j = 0; j < template.split('').length-1; j++){
            let subst = template.substring(j,j+2);
            let insert = insertion[subst];

            if(!insert ||subst.split('').length != 2){
                console.warn("Couldn't find an appropriate Insertion pair: ",subst," !")
            }else{
                temp_template.splice(2*j+1,0,insert)
            }
        }
        template = temp_template.join('');
    }
    let result = Object.values(template.split('').reduce((obj, cnt)=>{
        if(!obj[cnt]){
            obj[cnt] = 0;
        }
        obj[cnt]++;
        return obj;
    },{})).sort((a, b) => b - a);
    return result[0] - result[result.length-1];
}

function solve2(input, mute = false) {
    let parsed = input.map(a=>a.includes('->')?a.split('->').map(b=>b.trim()):a);
    let template = parsed[0];
    let insertion = parsed.filter(a=>Array.isArray(a)).reduce((obj, arr) => (obj[arr[0]] = arr[1], obj) ,{});

    let rounds = 40;

    for(let i = 0; i < rounds; i++){
        let temp_template = template.split('');
        for(let j = 0; j < template.split('').length-1; j++){
            let subst = template.substring(j,j+2);
            let insert = insertion[subst];

            if(!insert ||subst.split('').length != 2){
                console.warn("Couldn't find an appropriate Insertion pair: ",subst," !")
            }else{
                temp_template.splice(2*j+1,0,insert)
            }
        }
        template = temp_template.join('');
        if (!mute) {
            console.log(`Round ${i+1}/${rounds} ToCompute: ${template.split('').length}`);
        }
    }
    let result = Object.values(template.split('').reduce((obj, cnt)=>{
        if(!obj[cnt]){
            obj[cnt] = 0;
        }
        obj[cnt]++;
        return obj;
    },{})).sort((a, b) => b - a);
    return result[0] - result[result.length-1];
}

function testAll() {
    let t_input = [getFile('./sample.txt')];

    let t_result = [1588];
    let t_result2 = [2188189693529];
    for (let i = 0; i < t_input.length; i++) {
        const testInput = t_input[i];
        const testResult = t_result[i];
        const testResult2 = t_result2[i];
        let test = solve(testInput, true);
        if (test != testResult) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 1: Got '${test}' but expected '${testResult}'`
            );
            process.exit(69);
        }
        let test2 = solve2(testInput, false);
        if (test2 != testResult2) {
            console.error(
                `Wrong Solving Mechanism on Iteration ${i + 1} Test 2: Got '${test2}' but expected '${testResult2}'`
            );
            process.exit(69);
        }
    }
}

function slowWarning() {
    process.on('SIGINT', () => {
        process.exit(0);
    });
    if(process.send){
        process.send(JSON.stringify({ type: 'error', message: 'ATTENTION: SUPER DUPER MEGA SLOW' }));
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

    if (autoSkipSlow) {
        console.log('Auto Skipped Slow');
        process.exit(0);
    }

    slowWarning();
    let realInput = getFile('./input.txt');
    let Answer = solve(realInput);
    console.log(`Part 1: '${Answer}'`);
    let Answer2 = solve2(realInput);
    console.log(`Part 2: '${Answer2}'`);
}

main();
