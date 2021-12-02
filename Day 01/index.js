
//SOME NASTY BUG IS IN HERE!!! IT Doesn'T WORK



function solve(input){

let result = [0, 0, 0];

let previous = null;
    for(let i = 1; i < input.length ; i++){
        let current = input[i];
        previous = input[i-1];;
        if(isNaN(current)){
           // console.warn("isNAN " + current)
        }

        let num = current == previous ? 1 : current > previous ? 2 : 0;
        console.log(num >= 3 || num <0 ? num :"")
        result[num] = result[num] + 1; 
        
    }
return result;
}

let testInput = [199, 200, 208, 210, 200, 207, 240, 269, 260, 263]; 

let testResult = 7;

let test = solve(testInput)
if(test[2] != testResult && test.reduce((a,b)=>a+b,0)!=testInput.length){
    console.error(`Wrong Solving Mechanism: Got '${test[2]}' but expected '${testResult}'`)
    process.exit(69);
}


let realInput = require("fs").readFileSync("./input.txt").toString().replace("\r","").split("\n").filter(a=>a!=="")

let Answer = solve(realInput);
if(Answer.reduce((a,b)=>a+b,0)!=realInput.length){
    console.error(`Wrong Solving Mechanism, Length not matching: ${Answer.reduce((a,b)=>a+b,0)} vs actual Length of ${realInput.length}`)
    process.exit(69);
}

console.log(`Answer\n${Answer[2]}`);