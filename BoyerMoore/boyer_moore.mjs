// --------------- IMPORT ---------------
import {readFile} from 'fs'

// --------------- CONSTANTS ---------------
const INPUT_FILE = "./input.txt"


// --------------- ERROR CLASS ---------------
class FileSystemError extends Error {
    constructor (message) {
        super(message)
        this.name = "File System Error"
    }
}


function get_indexes_table(input_string) {
    const indexes_table = {}
    for (const el of input_string) if (indexes_table[el] === undefined) indexes_table[el] = input_string.lastIndexOf(el);
    return indexes_table;
}

function boyer_moore(input_string, template) {
    const indexes_table = get_indexes_table(template);

    for (let i = 0; i <= input_string.length - template.length;) {

        let bFlag = true;
        for (let j = template.length - 1; j >= 0; j--) {
            if (input_string[i + j] !== template[j]) {
                const last_index = indexes_table[input_string[i+j]];
                if (last_index === undefined) i += j + 1
                else i += Math.max(1, j - last_index);

                bFlag = false
                break;
            }
        }

        if (bFlag) return i;
    }

    return -1
}

function run_test(input_file) {
    readFile(input_file, 'utf-8', (error, data) =>  {
        if (error) throw new FileSystemError("We got some trouble: ", error);

        data = data.toString()
        const tests = []
        for (const line of data.split('\n')) {
            if (line.trim()) {
                const splitted_data = line.split(' ');
                const answer = boyer_moore(splitted_data[0], splitted_data[1])
                const right_answer = splitted_data[0].indexOf(splitted_data[1]);

                tests.push({
                    input_string: splitted_data[0],
                    template: splitted_data[1],
                    boyer_moore_answer: answer,
                    right_answer: right_answer
                })
            }
        }

        console.table(tests);
    })
}



run_test(INPUT_FILE);

