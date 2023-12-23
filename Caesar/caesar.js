// ---------- DECLARE ERROR
class FileSystemError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileSystemError';
    }
}

// ---------- SUPPORTING FUNCTIONS
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

const is_lower_case = function(ch) {
    return ch >= alph_first && ch <= alph_last
}

const is_upper_case = function (ch) {
    return ch >= alph_first.toUpperCase() && ch <= alph_last.toUpperCase();
}

function print_line() {
    console.log('------------------------------------------------------------------------');
}

const form_frequency_table = function (encoded_text) {
    const actual_frequency = new Array(alph_size).fill(0);
     

    // fill 
    let count = 0;
    for (const ch of encoded_text.toLowerCase()) if (is_lower_case(ch)) {
        count += 1;
        actual_frequency[ch.charCodeAt(0) - alph_first.charCodeAt(0)] += 1;
    }

    for (let i = 0; i < alph_size; i++) actual_frequency[i] /= count;

    return actual_frequency;
}

// ---------- CAESAR CODE BREAK
const break_caesar_code = (encoded_text, frequency_table) => {
    const actual_frequency = form_frequency_table(encoded_text);

    let min_difference;
    let supposed_shift = 0;
    for (let b = 0; b < alph_size; b++) {

        let collected_sum = 0;
        for (let i = 0; i < (alph_size - 1); i++)  {
            let s = (frequency_table[i] - actual_frequency[(i + b) % alph_size]) ** 2;
            collected_sum += s;
        }
        if (min_difference == null || collected_sum < min_difference) {
            min_difference = collected_sum;
            supposed_shift = b;
        }
    }

    const result = caesar_code(encoded_text, -supposed_shift);
    return [result, supposed_shift];
}


// ---------- CAESAR CODE
function caesar_code(text, shift) {
    let result = new Array();
    for (const el of text) {
        if (is_upper_case(el)) {
            let new_el = ((el.charCodeAt(0) - alph_first.toUpperCase().charCodeAt(0)) + shift) % alph_size;
            if (new_el < 0) new_el += alph_size;

            const ch = String.fromCharCode(new_el + alph_first.toUpperCase().charCodeAt(0));
            result.push(ch);
        }
        else if (is_lower_case(el)) {
            let new_el = ((el.charCodeAt(0) - alph_first.charCodeAt(0)) + shift) % alph_size;
            if (new_el < 0) new_el += alph_size;

            const ch = String.fromCharCode(new_el + alph_first.charCodeAt(0));
            result.push(ch);
        }
        else result.push(el)
    }
    return result.join('');
}

// ---------- IMPORT LIBRARIES
const fs = require("fs");

// ---------- DEFINE CONSTANTS
const alph_first = 'а';
const alph_last = 'я';
const alph_size = alph_last.charCodeAt(0) - alph_first.charCodeAt(0) + 1;
const paragraph_size = 100000;


// ---------- MAIN 
fs.readFile("./frequency.csv", 'utf-8', (err, data) => {
    if (err) throw new FileSystemError("We got some error: " + err);
    let frequency_table = data.toString().split(', ').map(a => parseFloat(a));

    fs.readFile("./input.txt", 'utf-8', (err, data) => {
        if (err) throw new FileSystemError("We got some error: " + err);
        const random_index = getRandomInt(data.length - paragraph_size);
        data = data.toString().slice(random_index, random_index + paragraph_size);

        // show given text
        console.log("GIVEN TEXT: ");
        console.log(data.slice(0, 100));
        print_line();

        // generate random shift
        const shift = getRandomInt(alph_size);
        console.log("SHIFT: ", shift);
        const encoded_text = caesar_code(data, shift);
        print_line();

        // show encoded text
        console.log("ENCODED TEXT: ");
        console.log(encoded_text.slice(0, 100));
        print_line();

        // show decoded text
        const decoded_text = caesar_code(encoded_text, -shift);
        console.log("DECODED TEXT: ");
        console.log(decoded_text.slice(0, 100));
        print_line();

        const [result, supposed_shift] = break_caesar_code(encoded_text, frequency_table);
        console.log("SUPPOSED SHIFT: ", supposed_shift, " | RESULT: ");
        console.log(result.slice(0, 100));
        print_line();
    });
});
