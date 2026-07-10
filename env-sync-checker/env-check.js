const parseEnv = require("./lib/parser.js");
const compareEnv = require("./lib/comparator.js");
const report = require("./lib/reporter.js");

let envPath = ".env"
let examplePath = ".env.example"

for(let i=0;i<process.argv.length;i++){
    if (process.argv[i] === "--env"){
         envPath = process.argv[i + 1];
    }      

    if (process.argv[i] === "--example"){
        examplePath = process.argv[i + 1];
    }
        
}

const env = parseEnv(envPath);
const envExample = parseEnv(examplePath);


if(Object.keys(env.variables).length===0 && Object.keys(envExample.variables).length===0){
    console.log(`Both ${envPath} and ${examplePath} contains no environment variables.`);
    process.exit(1);
}
else if(Object.keys(env.variables).length===0 ){
    console.log(`${envPath} contains no environment variables.`);
    process.exit(1);
    
}
else if(Object.keys(envExample.variables).length===0 ){
    console.log(`${examplePath} contains no environment variables.`);
    process.exit(1);
    
}
else{
    const compare = compareEnv(env, envExample);
    report(env,envExample,compare);
    if (
        compare.missingKeys.length > 0 ||
        compare.extraKeys.length > 0 ||
        env.duplicates.length > 0 ||
        envExample.duplicates.length > 0 ||
        env.emptyKeys.length > 0 ||
        envExample.emptyKeys.length > 0
    ) {
        process.exit(1);
    }
    
}


