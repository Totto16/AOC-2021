


function solve2(input2){
    // pos, depth, aim
    let result = [0,0,0];
    for(let i = 0; i < input2.length ; i++){
        let current = input2[i];
        if(current.includes("forward")){
            let number = parseInt (current.replace(/forward /i,""))
            result[0] +=number;
            result[1] += result[2] * number;
        }else if(current.includes("down")){
            let number = parseInt(current.replace(/down /i,""))
            result[2] += number;
        }else if(current.includes("up")){
            let number = parseInt(current.replace(/up /i,""))
            result[2] -= number;
        }else{
            console.warn("Not recognized: %s", current)
        }
    }
        return result[0] * result[1]
    }
    
    let testInput = "forward 5|down 5|forward 8|up 3|down 8|forward 2".split("|"); 
    
    let testResult = 900;
    
    let test = solve2(testInput)
    if(test != testResult){
        console.error(`Wrong Solving Mechanism: Got '${test}' but expected '${testResult}'`)
        process.exit(69);
    }
    
    
    let realInput = require("fs").readFileSync("./input2.txt").toString().replace("\r","").split("\n").filter(a=>a!=="")
    
    let Answer = solve2(realInput);
    console.log(`Answer\n${Answer}`);