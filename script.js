const displayEquationText = document.querySelector('#equation-text');
const displayResultText = document.querySelector('#result-text');

let equationBuffer = [];
let mainResult = null;
let updateFromResult = false;

function addSymbol(symbol) {

    if (/[0-9]/.test(symbol)) {
        addNumber(symbol);
        updateDisplay();
        return;
    }

    switch (symbol) {
        case 'AC':
            clearAll();
            break;
        case 'C':
            removeLastElement();
            break;
        case '/':
            addOperator('÷');
            break;
        case '*':
            addOperator('*');
            break;
        case '-':
            addOperator('-');
            break;
        case '+':
            addOperator('+');
            break;
        case '.':
            if (equationBuffer.length !== 0 && !/[-÷*+=.]/.test(equationBuffer[equationBuffer.length - 1])) {
                equationBuffer[equationBuffer.length - 1] += '.';
            }
            break;
        case '=':
            evaluate();
            break;
    }

    updateDisplay();
    if (symbol === '=') updateFromResult = true;
}

function addOperator(operator) {
    //if buffer is not empty or last symbol is not an operator
    if (equationBuffer.length !== 0 && !/[-÷*+=]/.test(equationBuffer[equationBuffer.length - 1])) {
        equationBuffer.push(operator);
    }
}

function addNumber(number) {

    //if buffer is empty or last symbol is an operator
    if (equationBuffer.length === 0 || /[-÷*+=]/.test(equationBuffer[equationBuffer.length - 1])) {
        equationBuffer.push(number);
        return;
    }

    equationBuffer[equationBuffer.length - 1] += number;
}

function removeLastElement() {
    mainResult = '';

    if (equationBuffer.length === 0)
        return;

    if (equationBuffer[equationBuffer.length - 1].length > 1) {
        equationBuffer[equationBuffer.length - 1] = equationBuffer[equationBuffer.length - 1].slice(0, -1);
    } else {
        equationBuffer.splice(equationBuffer.length - 1, 1);
    }
}

function clearAll() {
    equationBuffer.splice(0, equationBuffer.length);
    mainResult = '';
}

//['5', '+', '10', '*', '2'] = 5 + 10 * 2 = 5 + 20 = 25

function isBigDecimal(number) {
    return String(number).split('.')[1]?.length > 5;
}

function evaluate() {

    let tempEquation = [...equationBuffer];

    if (tempEquation.length === 0) {
        mainResult = 'Nothing to calculate!';
        return;
    }

    if (/[-÷*+=]/.test(tempEquation[tempEquation.length - 1])) {
        tempEquation.splice(tempEquation.length - 1, 1);
    }

    if (tempEquation.length === 1) {
        mainResult = tempEquation[0];
        return;
    }

    let result = null;

    while (tempEquation.length > 1) {

        let operator = tempEquation[1];
        let operatorIndex = 1;

        for (let j = 1; j < tempEquation.length; j++) {
            if (/[÷*]/.test(tempEquation[j])) {
                operator = tempEquation[j];
                operatorIndex = j;
                break;
            }
        }

        switch (operator) {
            case '+':
                result = Number(tempEquation[operatorIndex - 1]) + Number(tempEquation[operatorIndex + 1]);
                break;
            case '-':
                result = Number(tempEquation[operatorIndex - 1]) - Number(tempEquation[operatorIndex + 1]);
                break;
            case '*':
                result = Number(tempEquation[operatorIndex - 1]) * Number(tempEquation[operatorIndex + 1]);
                break;
            case '÷':
                if (Number(tempEquation[operatorIndex + 1]) === 0) {
                    mainResult = 'Error: division by zero!';
                    equationBuffer.splice(0, equationBuffer.length);
                    return;
                }
                result = Number(tempEquation[operatorIndex - 1]) / Number(tempEquation[operatorIndex + 1]);
                break;
        }

        result = isBigDecimal(result) ? result.toFixed(5) : String(result);

        console.log(tempEquation[operatorIndex - 1], operator, tempEquation[operatorIndex + 1], '=', result);
        console.log(tempEquation);
        tempEquation.splice(operatorIndex - 1, 3, result);
    }

    mainResult = result;
}

function updateDisplay() {

    if (updateFromResult) {

        let operator = /[-÷*+=]/.test(equationBuffer[equationBuffer.length - 1]) ? equationBuffer[equationBuffer.length - 1] : null;

        equationBuffer.splice(0, equationBuffer.length);
        equationBuffer.push(mainResult);
        mainResult = null;
        updateFromResult = false;

        if (operator) {
            equationBuffer.push(operator);
        }
    }

    displayEquationText.textContent = equationBuffer.join(' ');

    if (mainResult) {
        displayResultText.textContent = mainResult;
    } else {
        displayResultText.textContent = '';
    }
}

document.querySelector('#btn-one').addEventListener('click', () => addSymbol('1'));
document.querySelector('#btn-two').addEventListener('click', () => addSymbol('2'));
document.querySelector('#btn-three').addEventListener('click', () => addSymbol('3'));
document.querySelector('#btn-four').addEventListener('click', () => addSymbol('4'));
document.querySelector('#btn-five').addEventListener('click', () => addSymbol('5'));
document.querySelector('#btn-six').addEventListener('click', () => addSymbol('6'));
document.querySelector('#btn-seven').addEventListener('click', () => addSymbol('7'));
document.querySelector('#btn-eight').addEventListener('click', () => addSymbol('8'));
document.querySelector('#btn-nine').addEventListener('click', () => addSymbol('9'));
document.querySelector('#btn-zero').addEventListener('click', () => addSymbol('0'));

document.querySelector('#btn-dot').addEventListener('click', () => addSymbol('.'));

document.querySelector('#btn-plus').addEventListener('click', () => addSymbol('+'));
document.querySelector('#btn-minus').addEventListener('click', () => addSymbol('-'));
document.querySelector('#btn-mult').addEventListener('click', () => addSymbol('*'));
document.querySelector('#btn-div').addEventListener('click', () => addSymbol('/'));
document.querySelector('#btn-equal').addEventListener('click', () => addSymbol('='));

document.querySelector('#btn-c').addEventListener('click', () => addSymbol('C'));
document.querySelector('#btn-ac').addEventListener('click', () => addSymbol('AC'));
