// ----------- DECLARE VARIABLES
const input_string = "колоколокол";
const template = "колокол";

// ---------- FORM ALPH
const alph = {}
for (const el of template) alph[el] = 0;

// ---------- FORM DELTA TABLE
const del = new Array();
for (let j = 0; j <= template.length; j++) del[j] = {};

// ---------- FILL DELTA TABLE

// iterate through states
for (let i = 0; i <= template.length; i++) {
    // iterate through alph
    for (const ch in alph) {
        // form prefix + given char from alph
        const s = template.substring(0, i) + ch

        // trying to find max suffix that is prefix of given template
        del[i][ch] = 0;
        for (let j = 0; j < s.length; j++) {
            if (template.startsWith(s.substring(j))) {
                del[i][ch] = s.length - j
                break
            }
        }
    }
}

// ---------- SHOW DELTA TABLE
console.table(del);

// ---------- FIND SUBSTRINGS
const end_state = template.length
let active_state = 0;
for (let i = 0; i < input_string.length; i++) {
    active_state = del[active_state][input_string.charAt(i)];
    if (active_state == end_state) console.log("RESULT: ", i - end_state + 1);
}
