// DEFINE SOME CONSTANTS
const empty_color = "#85877C";
const fill_color = "#0F0";
const field_size = 30;
const cell_size = 20;


const move_to_next_generation = () => {
    for (let i = 0; i < field_size; i++) field[i] = next_generation[i].slice();
}

const neighbour_count = (i, j) => {
    let count = -field[i][j];
    for (let row = i - 1; row <= (i + 1); row++) {
        for (let column = j - 1; column <= (j + 1); column++) {
            count += field[(row + field_size) % field_size][(column + field_size) % field_size];
        }
    }

    return count
}

const paint = () => {
    for (let i = 0; i < field_size; i++) {
        for (let j = 0; j < field_size; j++) {
            if (field[i][j]) context.fillStyle = fill_color;
            else context.fillStyle = empty_color;
            context.fillRect(i * cell_size, j * cell_size, cell_size, cell_size);
        }
    }
}

const fill_with_random_values = () => {
    console.log("here")
    for (let i = 0; i < field_size; i++) {
        for (let j = 0; j < field_size; j++) {
            field[i][j] = (Math.floor(Math.random() * 10) == 0);
        }
    }

    paint();
}

const pass_era = () => {
    for (let row = 0; row < field_size; row++) {
        for (let column = 0; column < field_size; column++) {
            let n_count = neighbour_count(row, column);
            next_generation[row][column] = (n_count == 3 || (n_count == 2 && field[row][column]));
        }
    }

    move_to_next_generation()
    paint()
}

const start = () => {
    if (!active_timer) {
        pulse.classList.add("active")
        active_timer = setInterval(() => {
            pass_era()
        }, 750)
    }
}

const stop = () => {
    clearInterval(active_timer);
    active_timer = null;
    pulse.classList.remove("active")
}


const canvas = document.getElementById("canvas");
const pulse = document.getElementById("pulse");
const context = canvas.getContext("2d");
let active_timer

// create empty table
const field = new Array(field_size);
const next_generation = new Array(field_size);
for (let i = 0; i < field_size; i++) {
    field[i] = new Array(field_size);
    next_generation[i] = new Array(field_size);
}

paint();

