//  ---------- DECLARE ERROR ---------- 
class FileSystemError extends Error {
    constructor (message) {
        super(message)
        this.name = 'FileSystemError'
    }
}

//  ---------- Stack for polish notation ---------- 
class PolishNotationStack extends Array {

    constructor(is_left_associativity) {
        super()
        this.is_left_associativity = is_left_associativity;
    }

    clear_stack_frame(output_array) {
        for (let i = this.length - 1; i >= 0; i--) {
            if (this[i] != "(") {
                output_array.push(this[i]);
                this.length--;
            }
            else {
                this.length--;
                break;
            }
        }
    }

    add_element(el, output_array) {
        const element_priority = priorities[el] || 0;

        for (let i = this.length - 1; i >= 0; i--) {
            const item_priority = priorities[this[i]]

            if (item_priority > element_priority || (item_priority == element_priority && ((el != "^" || this[i] != "^") || this.is_left_associativity))) {
                output_array.push(this[i]);
                this.length--;
            }
            else {
                this.push(el);
                break
            }
        }

        if (!this.length) this.push(el);
    }
}


// ---------- IMPORT TOOLS FROM LIBRARIES
import {readFile} from "fs";
import { exit } from "process";

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

// --------------- SUPPORT FUNCS ---------------
const show_array = (arr) => {
    console.log(JSON.stringify(arr, null, '\t'))
}

const print_line = () => {
    console.log('-------------------------')
}

const get_reverse_polish_notation = (input_value, is_left_associativity) => {
    const stack = new PolishNotationStack(is_left_associativity)
    const out = []

    for (const el of input_value.replaceAll(' ', '').split(/([\+\-\*\/\^\(\)])/)) {
        if (el === '') continue;
        else if (el == "(") stack.push(el);
        else if (el == ")") stack.clear_stack_frame(out);
        else if (isNaN(el)) stack.add_element(el, out);
        else out.push(el);
    }

    for (let i = stack.length - 1; i >= 0; i--) out.push(stack[i])

   return out.join(' ');
}


const calculate_exp = (input_value) => {
    const stack = [];
    for (const el of input_value.split(' ')) {
        if (isNaN(el)) {
            const second = stack.pop(), first = stack.pop()
            const result = operator_to_func[el](first, second);
            stack.push(result);
        }
        else stack.push(parseFloat(el));
    }
    return stack[0];
}

const dijkstra_algorithm = (input_exp) => {
    const reverse_polish = get_reverse_polish_notation(input_exp, is_left_associativity);
    return calculate_exp(reverse_polish);
}

const run_test = (input_file_path, is_left_associativity) => {
    readFile(input_file_path, 'utf-8', (err, data) => {
        if (err) throw new FileSystemError("Something got bad: " + err);

        const results = [];
        for (const line of data.toString().split('\n')) {
            if (!line) continue;
            const output = dijkstra_algorithm(line, is_left_associativity);
            const expected_output = eval(line.replaceAll("^", "**"))

            const test = {test: line, output: output, expected_output: expected_output};
            results.push(test)
        }

        if (is_left_associativity) console.log("\n\nBe careful! JavaScript uses right associativity. Result may be different than we except")
        console.table(results);
    })    
}


let is_left_associativity = false;
switch (process.argv[2]) {
    case '-h':
        console.log(`
            A simple program realises Dijkstra algorithm
            
            Usage:
                All you need is to fill input.txt file with all expressions
            
            Flags:
                -r: right associativity
                -l: left associativity
        `)
        exit();
    case '-r':
        is_left_associativity = false;
        break;
    case '-l':
        is_left_associativity = true;
        break;
}

run_test(INPUT_FILE_TEST, is_left_associativity);

