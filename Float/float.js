// WARNING!
// substraction does not work ok

// ---------- DECLARE ERROR
class FileSystemError extends Error {
    constructor(message) {
        super(message);
        this.name = 'FileSystemError';
    }
}

// ---------- MAIN CONVERT CLASS
class Converter {
    NaN_enterpretation = '01111111100000000000000000000001';
    plus_infinity = '01111111100000000000000000000000';
    minus_infinity = '11111111100000000000000000000000';
    overflow_number = '340282346638528859811704183484516925440340282346638528859811704183484516925440340282346638528859811704183484516925440.0'
    zero_number = '0000000000000000000000';

    constructor(size_of_bytes = 4) {
        this.size_of_bytes = size_of_bytes;
    }
    
    #convert_int(input, for_order = false) {
        // convert to int by shift and immitate overflow
        let result = (input + (2 ** (this.size_of_bytes * 8 - 1)) - for_order).toString(2).substring(0, this.size_of_bytes * 8);
        // sign extension
        while (result.length < this.size_of_bytes * 8) result = '0' + result;
        return result;
    }

    #convert_float(input) {
        // remove all plus signes
        // input = input.replace('+', '');

        // check for negativity (needed to do because of infinity comparison)
        let is_negative = false;
        if (input.charAt(0) == '-') {
            is_negative = true;
            input = input.substring(1);
        }

        // lexiographically compare input value and infinity to detect overflow
        if (input.length > this.overflow_number.length) return is_negative ? this.minus_infinity : this.plus_infinity;
        else if (input.length == this.overflow_number.length && input.localeCompare(this.overflow_number) > 0) return is_negative ? this.minus_infinity : this.plus_infinity;
        input = is_negative ? -parseFloat(input) : parseFloat(input);

        // check for zero
        if (input === 0.0) return this.zero_number;

        let result = (input < 0) ? '1' : '0';

        let number = '';
        let one_position = -1;
        let j = parseInt(Math.log2(input));
        if (!j) j = 0;
        for (let i = j, value = input; value; --i) {
            if (2 ** i <= value) {
                number += '1'
                value -= 2 ** i;
                if (one_position == -1) one_position = j - i;
            }
            else number += '0';
        }

        let order = this.#convert_int(j - one_position, true);
        let mantissa = number.substring(one_position + 1, one_position + 24);
        for (let i = mantissa.length; i < 23; ++i) mantissa += '0';

        result += order + mantissa;
        return result;
    }

    #subtract_int(first, second) {
        let result = '';
        let value = 0;
        for (let i = first.length - 1; i >= 0; --i) {
            value = parseInt(first[i]) - parseInt(second[i]) - Math.min(value, 0);
            result = Math.max(0, value) + result;
        }
        return result;
    }

    normalize_float(first, second) {

        if (first.substring(1, 9) >= second.substring(1, 9)) {
            let order_difference = this.binary_to_decimal_int(first.substring(1, 9)) - this.binary_to_decimal_int(second.substring(1, 9))

            let zeros = '';
            for (let i = 0; i < order_difference; i++) zeros += '0';

            second = second.charAt(0) + first.substring(1, 9) + (zeros + '1' + second.substring(9)).substring(0, 24);
            first = first.substring(0, 9) + '1' + first.substring(9);
        }
        else {
            let order_difference = this.binary_to_decimal_int(second.substring(1, 9)) - this.binary_to_decimal_int(first.substring(1, 9))

            let zeros = '';
            for (let i = 0; i < order_difference; i++) zeros += '0';
            first = first.charAt(0) + second.substring(1, 9) + (zeros + '1' + first.substring(9)).substring(0, 24);
            second = second.substring(0, 9) + '1' + second.substring(9);
        }


        return [first, second];
    }

    binary_to_decimal_int(number) {
        let result = 0;
        for (let i = number.length - 1, j = 0; i >= 0; --i, j++) result += parseInt(number[i]) * (2 ** j);
        return result;
    }

    binary_to_decimal_float(number) {
        let mantissa = 1;

        for (let i = 0; i < 23; i++) {
            let n = parseInt(number[9+i]) / (2 ** (i + 1));
            mantissa += n;
        }

        const order = this.binary_to_decimal_int(number.substring(1, 9)) - 127
        const result = (number[0] == '0' ? 1 : -1) * mantissa * (2 ** order);
        return result;
    }

    run = function(input) {
        let result;
        if (!isNaN(input)) {
            if (input.includes('.')) result = this.#convert_float(input);
            else result = this.#convert_int(parseInt(input));
        } else result = this.NaN_enterpretation;

        return result;
    }
}

// ---------- MAIN CALC CLASS
class Calc {
    constructor() {
        this.conv = new Converter(1);
    }

    #binary_sum(first, second, slice=true) {
        let result = ''
        let prev_sum = 0;
        let s;
        for (let i = first.length - 1; i >= 0; --i) {
            s = parseInt(first[i]) + parseInt(second[i]) + prev_sum;
            prev_sum = s >= 2;
            result = (s % 2) + result;
        }
        if (prev_sum) result = '1' + result;

        if (slice) return result.substring(0, first.length);
        else return result;
    }

    //  DOES NOT WORK
    #float_invert(number) {
        let mantissa = ''
        for (const el of number.substring(9)) mantissa += (el === '1' ? '0' : '1');
        mantissa = this.#binary_sum(mantissa, '000000000000000000000001');
        return number.substring(0, 9) + mantissa;
    }

    // DOES NOT WORK
    #float_subtract(first, second, num1, num2) {

        let some = this.conv.normalize_float(first, second);
        first = some[0]
        second = some[1]
        second = this.#float_invert(second);

        const sign = num1 >= num2;

        let mantissa = this.#binary_sum(first.substring(9), second.substring(9), false);
        let order;
        if (mantissa.length > 24) order = this.#binary_sum(first.substring(1, 9), '00000001')
        else order = first.substring(1, 9);
        mantissa = mantissa.substring(1, 24);

        const n = (sign ? '0' : '1') + order + mantissa
        const result = this.conv.binary_to_decimal_float(n);
        return result;
    }

    #float_sum(first, second) {
        [first, second] = this.conv.normalize_float(first, second);

        let mantissa = this.#binary_sum(first.substring(9), second.substring(9), false);
        let order;
        if (mantissa.length > 24) order = this.#binary_sum(first.substring(1, 9), '00000001')
        else order = first.substring(1, 9);
        mantissa = mantissa.substring(1, 24);

        const result = this.conv.binary_to_decimal_float('0' + order + mantissa);
        return result;
    }

    run = (input) => {
        if (input.includes('+')) {
            let numbers = input.split('+');
            return this.#float_sum(this.conv.run(numbers[0].trim()), this.conv.run(numbers[1].trim()));
        }
        // DOES NOT WORK
        else if (input.includes('-')) {
            let numbers = input.split('-');
            return this.#float_subtract(this.conv.run(numbers[0].trim()), this.conv.run(numbers[1].trim()), parseFloat(numbers[0]), parseFloat(numbers[1]));
        }
    }
}


// ---------- READ INPUT FILE
const fs = require('fs');

fs.readFile('in.txt', 'utf-8', (err, data) => {
    if (err) throw new FileSystemError(err);

    data = data.toString();

    size_of_bytes = parseInt(process.argv[3]);
    if (!size_of_bytes) size_of_bytes = 1;

    if (process.argv[2] == 'conv') handler = new Converter(size_of_bytes);
    else if (process.argv[2] == 'calc') handler = new Calc();

    result = handler.run(data).toString();

    fs.writeFile('out.txt', result, 'utf-8', (err) => {
        if (err) throw new FileSystemError(err);
        console.log('Success!');
    });
})
