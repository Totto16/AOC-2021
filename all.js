//TODO read all files from respective subfolders and run them! (use terminal-kit)

const fs = require('fs');
const path = require('path');
const term = require( 'terminal-kit' ).terminal ;
const child_process = require('child_process');

function *walkSync(dir, FolderMatch, fileMatch) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
        if (file.isDirectory()) {
            if(!FolderMatch || FolderMatch.test(file.name)){
                yield* walkSync(path.join(dir, file.name), FolderMatch, fileMatch);
            }
        } else {
            if(!fileMatch ||  fileMatch.test(file.name)){
                yield path.join(dir, file.name);
            }
        }
    }
}




async function main(){
    term.yellow( 'Loading Available Solutions...\n' ) ;
    const AllNumbers = [];
    for (const filePath of walkSync(__dirname, /Day (\d{2})/i ,/.*\.js$/i)) {
        const Group = filePath.match(/Day (\d{2})/i);
        if(!Group){
            continue;
        }
        const number = parseInt (Group[1])
        AllNumbers.push({number,filePath})
    }
    term.green("Select an Option:\n")
    const items = ['all: Run all Available Solutions'].concat(AllNumbers.map(a=>`${a.number}: Run the Solution of Day ${a.number.toString().padStart(2,"0")}`))
    term.singleColumnMenu( items 
        , {} , async function( error , response ) {
        term.previousLine(AllNumbers.length+1)
        term.eraseDisplayBelow();
        if(response.selectedIndex==0){
            term.blue(`Now running ALL Available Solutions:\n`)
            for(let i = 0; i< AllNumbers.length; i++){
                const selected = AllNumbers[i];
                term.green(`Now running Solution for Day ${selected.number.toString().padStart(2,"0")}:\n`)
                await runProcess(selected.filePath);
            }
        }else{
            response.selectedIndex--;
            const selected = AllNumbers[response.selectedIndex];
            term.green(`Now running Solution for Day ${selected.number.toString().padStart(2,"0")}:\n`)
            await runProcess(selected.filePath);
        }
        process.exit(0)
    } ) ;
}

async function runProcess(filePath){

}





main();