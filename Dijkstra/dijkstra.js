// ---------- DECLARE ERROR ----------
class FileSystemError extends Error {
    constructor (message) {
        super(message)
        this.name = 'FileSystemError'
    }
}


// ---------- IMPORT TOOLS FROM LIBRARIES ----------
import {readFile} from "fs";


// ---------- DECLARE SOME CONST ----------
const INPUT_FILE_TEST = "./input.txt"
const priorities = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "^": 3
}
const operator_to_func = {
    '+': (first, second) => first + second,
    '-': (first, second) => first - second,
    '*': (first, second) => first * second,
    '/': (first, second) => first / second,
    '^': (first, second) => first ** second
}

// ---------- PRINT BEAUTIFIED ARRAY ----------
const show_array = (arr) => {
    console.log(JSON.stringify(arr, null, '\t'))
}

// ---------- PRINT LINE ----------
const print_line = () => {
    console.log('-------------------------')
}

// ---------- POLISH NOTATION ----------
const get_reverse_polish_notation = (input_string) => {
    const stack = []
    const out = []

    console.log("INPUT: ", input_string)
    for (const el of input_string) {
        const active_priority = priorities[el] || 0;

        if (el == "(") stack.push(el);
        else if (el == ")") {
            for (let i = stack.length - 1; i >= 0; i--) {
                if (stack[i] != "(") {
                    out.push(stack[i]);
                    stack.length--;
                }
                else {
                    stack.length--;
                    break;
                }
            }
        }
        else if (isNaN(el)) {
            for (let i = stack.length - 1; i >= 0; i--) {
                const item_priority = priorities[stack[i]]

                if (item_priority >= active_priority) {
                    out.push(stack[i]);
                    stack.length--;
                }
                else {
                    stack.push(el);
                    break
                }
            }

            if (!stack.length) stack.push(el);

        }
        else out.push(el);
    }

    for (let i = stack.length - 1; i >= 0; i--) out.push(stack[i])

    return out.join('');
}


const calculate_exp = (input_value) => {
    console.log(input_value)
    const stack = [];
    for (const el of input_value) {
        if (isNaN(el)) {
            const second = stack.pop(), first = stack.pop()
            const result = operator_to_func[el](first, second);
            stack.push(result);
        }
        else stack.push(parseInt(el));
    }
    return stack[0];
}

const dijkstra_algorithm = (input_exp) => {
    const reverse_polish = get_reverse_polish_notation(input_exp);
    return calculate_exp(reverse_polish);
}

const run_test = (input_file_path) => {
    readFile(input_file_path, 'utf-8', (err, data) => {
        if (err) throw new FileSystemError("Something got bad: " + err);

        const results = [];
        for (const line of data.toString().split('\n')) {
            const output = dijkstra_algorithm(line);
            const expected_output = eval(line.replaceAll("^", "**"))

            const test = {test: line, output: output, expected_output: expected_output};
            results.push(test)
        }

        console.table(results);
    })    
}


run_test(INPUT_FILE_TEST);

