// ---------- DECLARE SOME VARIABLES

let initial_string = 'Hello, Kitty!';
let case_insensitive = false;

// ---------- CHECK FLAGS

for (const el of process.argv) {
    if (el === '-h' || el === '--help') {
        console.log(`
            Some program that uses brute force to find substring in str.

            FLAGS:
                1. -h or --help: displays this message
                2. -c: makes search case-insensitive 

            USAGE EXAMPLES:
                node brute_force.js --help
                node brute_force.js -c
        `);
        return 0;
    }
    else if (el === '-c') case_insensitive = true;
}

// ---------- GETTING USER INPUT
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question(`Type substring to search in \'${initial_string}\': `, function (substr) {
    rl.close();

    // ---------- IMPLEMENT CASE-INSENSETIVE SEARCh
    if (case_insensitive) {
        initial_string = initial_string.toLowerCase();
        substr = substr.toLowerCase();
    }

    // ---------- BRUTE FORCE IMPLEMENTATION
    for (let i = 0; i + substr.length <= initial_string.length; ++i) {
        if (initial_string.substring(i, i + substr.length) == substr) {
            console.log("We found a needed index: " + i);
            return 0;
        }
    }
    console.log("We haven't found anything...");
});
