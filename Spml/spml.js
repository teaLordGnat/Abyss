// ---------- DECLARE ERROR
class FileSystemError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileSystemError';
    }
}

// ---------- IMPORT LIBRARIES
const fs = require('fs');
const input = require('readline-sync');
// const readline = require("readline");

// ---------- COMPILER
class Spml {
    constructor (program_to_run) {
        this.mem = (new MemoryManager()).concat(program_to_run.split(/ |\r\n/)).concat(['EXIT']);
        this.ip = 0;
    }

    run() {
        while (1) {
            switch (this.mem[this.ip]) {
                case '':
                    this.ip += 1
                    break;
                case 'SET':
                    // Устанавливаем новое значение в переменную
                    this.mem.setVariable(this.ip + 1, this.mem[this.ip + 2])
                    // this.mem.setVariable(this.mem.getVariable(this.ip + 1), this.mem.getVariable(this.ip + 2))
                    this.ip += 3;
                    break;
                case 'INPUT':
                    // Вводим значение от пользователя и записываем его в переменную

                    // const rl = readline.createInterface({
                    //     input: process.stdin,
                    //     output: process.stdout,
                    // });

                    // rl.question(`INPUT TEXT: `, function (user_input) {
                        // rl.close();
                    // })
                    const user_input = input.question("INPUT YOUR TEXT: ");
                    this.mem.setVariable(this.ip + 1, user_input)
                    this.ip += 2;
                    break;
                case 'INT':
                    this.mem.setVariable(this.ip + 1, parseInt(this.mem.getVariable(this.ip + 1)))
                    this.ip += 2;
                    break;
                case 'OUTPUT':
                    console.log(this.mem.getVariable(this.ip + 1))
                    this.ip += 2;
                    break;
                case 'ADD':
                    this.mem.setVariable(this.ip + 3, this.mem.getVariable(this.ip + 1) + this.mem.getVariable(this.ip + 2))
                    this.ip += 4;
                    break;
                case 'FIBONACCI':
                    this.mem.setVariable(this.ip + 2, fibonacchi_number(this.mem.getVariable(this.ip + 1)));
                    this.ip += 3;
                    break;
                case 'LCD':
                    this.mem.setVariable(this.ip + 3, lcd(this.mem.getVariable(this.ip + 1), this.mem.getVariable(this.ip + 2)));
                    this.ip += 4;
                    break;
                case 'EXIT':
                    return;
            }
        }
    }
}

// ---------- MEMORY MANAGER
class MemoryManager extends Array {
    constructor () {
        super()
        this.variables_table = {}
    }

    // setVariable(name, value) {
    //     this.variables_table[name] = value;
    // }

    // getVariable(name) {
    //     return this.variables_table[name];
    // }

    getVariable(var_index) {
        return this[this.variables_table[this[var_index]]];
    }

    setVariable(var_index, value) {
        this[this.variables_table[this[var_index]] || (this.variables_table[this[var_index]] = this.length)] = value;
    }
}

// const fibonacchi_number = (target_number) => {
//     if (target_number <= 2) { return 1; }

//     let a = 1;
//     let b = 1;
//     let c;
//     let count = 2;
//     while (count < target_number) {
//         c = a + b;
//         a = b;
//         b = c;
//         count += 1
//     }
//     return b;
// }

// const lcd = (first_number, second_number) => {
//     let rest;

//     let a = first_number;
//     let b = second_number
//     while (rest = a % b) {
//         a = b;
//         b = rest;
//     }
//     return first_number * second_number / b;
// }

// Считываем переданый файл
fs.readFile(process.argv[2], (error, data) => {

    // Обрабатываем возможную ошибку
    if (error) throw new FileSystemError('We got some error: ' + error);

    // Обрабатываем считанный текст
    data = data.toString();

    const spml = new Spml(data);
    spml.run();
});
