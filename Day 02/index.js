


function solve(input){
    let result = [0,0];
    for(let i = 0; i < input.length ; i++){
        let current = input[i];
        if(current.includes("forward")){
            let number = parseInt (current.replace(/forward /i,""))
            result[0] +=number;
        }else if(current.includes("down")){
            let number = parseInt(current.replace(/down /i,""))
            result[1] += number;
        }else if(current.includes("up")){
            let number = parseInt(current.replace(/up /i,""))
            result[1] -= number;
        }else{
            console.warn("Not recognized: %s", current)
        }
    }
        return result.reduce((a,b)=>a*b,1);
    }
    
    let testInput = "forward 5|down 5|forward 8|up 3|down 8|forward 2".split("|"); 
    
    let testResult = 150;
    
    let test = solve(testInput)
    if(test != testResult){
        console.error(`Wrong Solving Mechanism: Got '${test}' but expected '${testResult}'`)
        process.exit(69);
    }
    
    
    let realInput = require("fs").readFileSync("./input.txt").toString().replace("\r","").split("\n").filter(a=>a!=="")
    
    let Answer = solve(realInput);
    console.log(`Answer\n${Answer}`);