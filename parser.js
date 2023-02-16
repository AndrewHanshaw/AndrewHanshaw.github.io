document.addEventListener('DOMContentLoaded', function() {
    const parser = math.parser();
    userInput = new String("Enter Input");

    let textField = document.querySelector('input'); // box where user input comes from
    let resultIn = document.getElementById('ResultInches');
    let resultCM = document.getElementById('ResultCM');

    const radioButtons = document.querySelectorAll('input[name="precisionRadio"]');
    let selectedPrecision = 0.015625; // set default precision

    radioButtons.forEach(radioButton => {
        radioButton.addEventListener("click", function() {
            selectedPrecision = this.value;
            calcResult();
        });
    });
    name.innerHTML = userInput;

    textField.addEventListener('keyup', function(event) {
        calcResult();
    });

    function calcResult() {
        let parsedInput;
        // if there are any errors from the math.js function parser, they will be ignored, and the result will just be 0.
        // The user will have to fix their input to work with the parser
        try {parsedInput = parser.evaluate(parseInput(textField.value));}
        catch(e) {parsedInput = 0;}
        if(parsedInput == null) {parsedInput = 0;}

        //format the results
        let output = createInchOutput(parsedInput, selectedPrecision)
        let outputCM = convertToCM(parsedInput);

        //display the results on the page
        resultIn.innerHTML = output;
        resultCM.innerHTML = outputCM;
    }
});

function parseInput(input) {
    input = parseAlpha(input);
    input = parseLastChar(input);
    input = parseOperator(input);
    input = parseFPI(input);
    input = parseParen(input);
    input = parseDiv(input);
    input = parseFeet(input);
    input = input.replace(/"/g, '');
    return input;
}

function parseAlpha(input) {
    input = input.replace(/[A-z]/g, '');
    return input;
}

function parseLastChar(input) {
    let regex = /\+|-|\(/;
    if(regex.exec(input[input.length-1]) != null ) {
        input = input.slice(0,input.length-1);
        input = parseLastChar(input); //recursive call in case of multiple operators or ( in a row
    }
    return input;
}

function parseOperator(input) {
    input = input.replace(" +", "+");
    input = input.replace("+ ", "+");
    input = input.replace(" -", "-");
    input = input.replace("- ", "-");
    return input;
}

function parseFPI (input) {
    //let match = input.match(/(\d+(\.\d+)?)'(\d+(\.\d+)?)/g); // search for values stored as feet plus inches (XX'X)
    let match = input.match(/(\d+(\.\d+)?)'( *\d+(\.\d+)?)/g); // search for values stored as feet plus inches (XX'X)

    if(match == null) { // if there is no match
        return input;
    }
    for(let i = 0; i < match.length; i++) {
        let temp = match[i].replace("'", "'+");
        input = input.replace(match[i], temp);
    }
    return input;
}

function parseParen (input) {
    let regex = /\+|-/g;
    let operators = [];
    let temp;

    while ( (temp = regex.exec(input)) ) {
        operators.push(temp.index);
    }
    if (operators.length <= 1) {
        return input;
    }

    let offset = 0;
    input = input.slice(0, operators[0]+1) + "(" + input.slice(operators[0]+1);
    offset++;

    if(operators.length != 2) {
        for (let i = 1; i < (operators.length-1); i++) {
            input = input.slice(0, operators[i]+offset) + ")" + input.slice(operators[i]+offset);
            offset++;
            input = input.slice(0, operators[i]+offset+1) + "("  + input.slice(operators[i]+offset+1);
            offset++;
        }
    }

    input = input.slice(0, operators[operators.length-1]+offset) + ")" + input.slice(operators[operators.length-1]+offset);
    offset++;
    input = input.slice(0, operators[operators.length-1]+offset+1) + "("  + input.slice(operators[operators.length-1]+offset+1);
    //offset++;
    input = input+ ")";
    return input;
}

function parseDiv (input) {
    let regex = / \d+(\.d+)?\/\d+(\.d+)?/g;
    let match = [];
    let temp;
    let offset = 0;
    while ( (temp = regex.exec(input)) ) {
        match.push([temp.index, temp[0]]);
    }
    if(match == null) { // if there is no match
        return input;
    }

    for (let i = 0; i < (match.length); i++) {
        input = input.slice(0, match[i][0]+offset) + "+(" + input.slice(match[i][0]+offset);
        offset += 2;
        input = input.slice(0, match[i][0]+offset+match[i][1].length) + ")" + input.slice(match[i][0]+offset+match[i][1].length);
        offset++;
    }
    return input;
}

function parseFeet (input) {
    let match = input.match(/\(*(\d+(\.\d+)?)(\/\d+(\.\d+)?)?\)*'/g); // search for values stored as feet (XX' or XX.XX' or (XX)' or (XX/XX)' ) using regex // old /(\d+(\.\d+)?)'/g
    if(match == null) { // if there is no match
        return input;
    }
    for(let i = 0; i < match.length; i++) {
        let temp = match[i].replace("'", "'+");
        input = input.replace(match[i], (match[i].replace("'", "") + "*12") );
    }
    return input;
}

function createInchOutput (input, precision) {
    //format the provided input
    input = input.toFixed(4);
    input = input.replace(/\.?0+$/, '');
    let pos = true;
    if(input < 0) {
        input = math.abs(input);
        pos = false;
    }

    //split the output into separate parts
    let wholePart = math.floor(input);
    let decimal = input-wholePart;
    let feet = math.floor((wholePart - (wholePart % 12))/12);
    let inches = wholePart-(feet*12);
    let roundedVal = Math.round(decimal / precision) * precision;
    let fraction = (math.format(math.fraction(roundedVal), { fraction: 'ratio' } ) );
    if(roundedVal == 1) {
        inches++;
        decimal = 0;
    }

    //create string output
    let output = `Result: `;

    //logic to determine when symbols are required
    if(input == 0) {return output;}
    if(pos == false) {output += `-`;}
    output += `${input}", or `;
    if(pos == false) {output += `-`;}
    if (feet != 0) {output +=  `${feet}'-`;}
    output += `${inches}`;
    if(decimal != 0) {
        output += ` ${fraction}`;
    }
    output += `"`;

    return output;
}

function convertToCM(input) {
    input = input*2.54;
    input = input.toFixed(4);
    input = input.replace(/\.?0+$/, '');
    output = `(${input} cm)`;
    return output;
}