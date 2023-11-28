/*
    Let me introduce Ultra Stupid Language
*/

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

// ---------- COMPILER
class Usl {
    constructor() {
        this.variables = {}
        this.labels_to_address = {}
    }

    preprocess(program_to_run) {
        const result = [];
        const to_run = program_to_run.split(/\s+/).concat(['EXIT']);

        for (const element of to_run) {
            if (element.endsWith(':')) this.labels_to_address[element] = result.length;
            else result.push(element);
        }

        return result;
    }

    run(program_to_run) {
        // PREPROCESSING STUFF
        const to_run = this.preprocess(program_to_run);

        let ip = 0;
        let psw = 0;
        while (1) {
            switch (to_run[ip]) {
                case '':
                    ip += 1;
                    break;
                case 'SET':
                    this.variables[to_run[ip + 1]] = isNaN(to_run[ip + 2]) ? this.variables[to_run[ip + 2]] : to_run[ip + 2];
                    ip += 3;
                    break
                case 'OUTPUT':
                    if (isNaN(to_run[ip + 1])) console.log(this.variables[to_run[ip + 1]]);
                    else console.log(to_run[ip + 1]);

                    ip += 2;
                    break;
                case 'ADD':
                    this.variables[to_run[ip + 1]] = this.variables[to_run[ip + 2]] + this.variables[to_run[ip + 3]];
                    ip += 4;
                    break;
                case 'MULTIPLY':
                    this.variables[to_run[ip + 1]] = this.variables[to_run[ip + 2]] * this.variables[to_run[ip + 3]];
                    ip += 4;
                    break;
                case 'DIVIDE':
                    this.variables[to_run[ip + 1]] = this.variables[to_run[ip + 2]] / this.variables[to_run[ip + 3]];
                    ip += 4;
                    break;
                case 'MOD':
                    this.variables[to_run[ip + 1]] = this.variables[to_run[ip + 2]] % this.variables[to_run[ip + 3]];
                    ip += 4;
                    break;
                case 'INT':
                    this.variables[to_run[ip + 1]] = parseInt(this.variables[to_run[ip + 1]]);
                    ip += 2;
                    break;
                case 'INCREMENT':
                    this.variables[to_run[ip + 1]] += 1;
                    ip += 2;
                    break;
                case 'COMPARE':
                    const first = this.variables[to_run[ip + 1]];
                    const second = isNaN(to_run[ip + 2]) ? this.variables[to_run[ip + 2]] : parseFloat(to_run[ip + 2]);
                    
                    if (first > second) psw = 1;
                    else if (first < second) psw = -1;
                    else psw = 0;

                    ip += 3;
                    break;
                case 'JUMP_IF_EQUAL':
                    if (!psw) ip = this.labels_to_address[to_run[ip + 1] + ':'];
                    else ip += 2;

                    break;
                case 'JUMP_IF_LESS':
                    if (psw == -1) ip = this.labels_to_address[to_run[ip + 1] + ':'];
                    else ip += 2;

                    break;
                case 'JUMP_IF_MORE':
                    if (psw == 1) ip = this.labels_to_address[to_run[ip + 1] + ':'];
                    else ip += 2;

                    break;
                case 'JUMP':
                    ip = this.labels_to_address[to_run[ip + 1] + ':'];
                    break;
                case 'INPUT':
                    this.variables[to_run[ip + 1]] = input.question("INPUT YOUR TEXT: ");
                    ip += 2;
                    break;
                case 'EXIT':
                    return;
            }
        }
    }
}

fs.readFile(process.argv[2], (error, data) => {
    if (error) throw new FileSystemError('We got some error: ' + error);

    data = data.toString();
    const usl = new Usl();
    usl.run(data);
})