'use strict'
const input = document.getElementById('input');
const buttonIds = [
  { id: 'button0', getValue: () => '0' },
  { id: 'button1', getValue: () => '1' },
  { id: 'button2', getValue: () => '2' },
  { id: 'button3', getValue: () => '3' },
  { id: 'button4', getValue: () => '4' },
  { id: 'button5', getValue: () => '5' },
  { id: 'button6', getValue: () => '6' },
  { id: 'button7', getValue: () => '7' },
  { id: 'button8', getValue: () => '8' },
  { id: 'button9', getValue: () => '9' },
  { id: 'buttonClear', getValue: () => '' },
  { id: 'buttonDivide', getValue: () => '/' },
  { id: 'buttonMultiply', getValue: () => '*' },
  { id: 'buttonSub', getValue: () => '-' },
  { id: 'buttonAdd', getValue: () => '+' },
  { id: 'buttonPercent', getValue: () => '%' },
  { id: 'buttonDeci', getValue: () => '.' },
  { id: 'buttonSign', getValue: (input) => {return "-(" + input.value + ")"} },
  { id: 'buttonEqual', getValue: (input, calculation) => { calculation(input.value) } }
];

buttonIds.forEach(({ id, getValue }) => {
  document.getElementById(id).addEventListener('click', () => {  
    if (id == 'buttonEqual') {
      getValue(input, Solve);
    } 
    else if (id == "buttonSign") {
      input.value = getValue(input);
    }
    else if (id == "buttonClear") {
      input.value = getValue();
    }
    else {
      input.value += getValue();
    }
  })
});
const REGEX_ELEMENT_IDENTIFIER = /(\d*\.\d+|\d+|\+|-|\*|\/|\(|\))/g;

let operators = {
  "+": {
    presedence : "1",
    operation : function(a,b) {
      return a + b;
    }
  },
  "-": {
    presedence : "1",
    operation : function(a,b) {
      return a - b;
    }
  },
  "*": {
    presedence : "2",
    operation : function(a,b) {
      return a * b;
    }
  },
  "/": {
    presedence : "2",
    operation : function(a,b) {
      return a / b;
    }
  },
  "(": {
    presedence : "3",
    operation : function(a,b) {
      return a + b;
    }
  }
};

let operatorStack = [];
let outputQueue = [];

//TODO fix the solve equation to push opperands onto a stack until an opperator is pulled, then pop the top two opperators for evaluation Push result.
function Solve(expression) {
  let inputArray = InputToArray(expression);
  operatorStack = [];
  outputQueue = [];
  //TODO Might want to validate that there were no invalid symbols before hand that did not get captured
  ToPostfix(inputArray);
  input.value = Calculate(outputQueue);
  console.log(operatorStack);
  console.log(outputQueue);
}

function Calculate(postFixQueue) {
  let a, b, o;
  while (postFixQueue.length > 1) {
    a = Number(postFixQueue.shift());
    b = Number(postFixQueue.shift());
    o = postFixQueue.shift();

    postFixQueue.unshift(operators[o].operation(a,b));
    console.log(postFixQueue);
  }
  return postFixQueue.shift();
}

function InputToArray(input) {
  let inputStr = input;
  return inputStr.match(REGEX_ELEMENT_IDENTIFIER);
}

function ToPostfix(infixExpArray) {  
  let expression = infixExpArray;
  for(let i = 0; i < expression.length; i++) {
    if(IsNumber(expression[i])) {
      outputQueue.push(expression[i]);
    }
    else if(IsOperator(expression[i])) {
      TryAddingToStack(expression[i]);
    }
    else if(expression[i] === ")") {
      PopToOpeningParentheses();
    }
  }
  PopRemainingOperators();
}

function PopToOpeningParentheses() {
  try{
    let opFromStack = operatorStack.pop();
    while(opFromStack !== "(") {
      outputQueue.push(opFromStack);
      opFromStack = operatorStack.pop();
    }
  }
  catch(error) {
    console.write(error);
  }
}

function IsNumber(string) {
  return (string.match(/(\d*\.\d+|\d+)/));
}

function IsOperator(string) {
  return (string.match(/(\+|-|\*|\/|\()/));
}

function TryAddingToStack(operator)
{
  let presedence = GetOperatorPresedence(operator);

  while(operatorStack.length > 0) {
    let opFromStack = operatorStack.pop();

    if(opFromStack === "(" || presedence > GetOperatorPresedence(opFromStack)) {
      operatorStack.push(opFromStack);
      operatorStack.push(operator);
      return;
    }
    else{
      outputQueue.push(opFromStack);
    }
  }
  operatorStack.push(operator);
}

function PopRemainingOperators() {
  while(operatorStack.length > 0) {
    outputQueue.push(operatorStack.pop());
  }
}

function GetOperatorPresedence(operator) {
  return operators[operator].presedence;
}

//TODO Validate that the input string is valid
//function ValidateInput(input)
