// ---------- DECLARE SOME VARIABLES

let initial_string = 'Hello, Kitty!';
let case_insensitive = false;

// ---------- CHECK FLAGS

for (const el of process.argv) {
    if (el === '-h' || el === '--help') {
        console.log(`
            Some program that uses simple hash function to find substring in str.

            FLAGS:
                1. -h or --help: displays this message
                2. -c: makes search case-insensitive 

            USAGE EXAMPLES:
                node hash_string.js --help
                node hash_string.js -c
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

    // ---------- SIMPLE HASH FUNCTION IMPLEMENTATION

    // setting default hash sum value

    let desired_hash_sum = 0;
    let current_hash_sum = 0;
    for (let i = 0; i < substr.length; ++i) {
        desired_hash_sum += substr.charCodeAt(i);
        current_hash_sum += initial_string.charCodeAt(i);
    }

    // search for substring
    for (let i = 0; i + substr.length < initial_string.length; ++i) {
        if (desired_hash_sum == current_hash_sum && initial_string.substring(i, i + substr.length)) {
            console.log("We found a needed index: " + i);
            return 0;
        }

        current_hash_sum += initial_string.charCodeAt(i + substr.length) - initial_string.charCodeAt(i);
    }

    console.log("We haven't found anything...");
});


