class Node {
    constructor(frequency, ch=null, one_child=null, zero_child=null) {
        this.frequency = frequency;
        this.ch = ch;

        if (one_child) for (const el of one_child.ch) translate_table[el] = '1' + translate_table[el]
        if (zero_child) for (const el of zero_child.ch) translate_table[el] = '0' + translate_table[el]

        this.children = {'1': one_child, '0': zero_child};
    }
}


// INITIALIZE START VARIABLES
const s = "abaccb"

// FORM ALPHABET
const alph = {}
for (const el of s) {
    const value = alph[el] || 0;
    alph[el] = value + 1;
}

nodes = []
for (const el in alph) {
    const node = new Node(alph[el], el);
    nodes.push(node);
}

const translate_table = {};
for (const el in alph) translate_table[el] = '';

// console.table(nodes);
do {
    nodes.sort((a, b) => {
        return b.frequency - a.frequency;
    })

    first = nodes.pop();
    second = (nodes.pop() || new Node(0, ''));

    const node = new Node(first.frequency + second.frequency, first.ch + second.ch, first, second);
    nodes.push(node);
} while (nodes.length > 1)

console.log(translate_table);

let encoded = ""
for (const ch of s) encoded += translate_table[ch];

console.log("ENCODED: ", encoded);

let decoded = "";
let active_node = nodes[0];
for (let i = 0; i < encoded.length; ++i) {
    active_node = active_node.children[encoded[i]];
    if (active_node.ch.length == 1) {
        decoded += active_node.ch;
        active_node = nodes[0]
    }
}

console.log("DECODED: ", decoded);
