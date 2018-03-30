'use strict'
document.getElementById("button0").addEventListener("click", function(){
  document.getElementById("input").value += "0";
});
document.getElementById("button1").addEventListener("click", function(){
  document.getElementById("input").value += "1";
});
document.getElementById("button2").addEventListener("click", function(){
  document.getElementById("input").value += "2";
});
document.getElementById("button3").addEventListener("click", function(){
  document.getElementById("input").value += "3";
});
document.getElementById("button4").addEventListener("click", function(){
  document.getElementById("input").value += "4";
});
document.getElementById("button5").addEventListener("click", function(){
  document.getElementById("input").value += "5";
});
document.getElementById("button6").addEventListener("click", function(){
  document.getElementById("input").value += "6";
});
document.getElementById("button7").addEventListener("click", function(){
  document.getElementById("input").value += "7";
});
document.getElementById("button8").addEventListener("click", function(){
  document.getElementById("input").value += "8";
});
document.getElementById("button9").addEventListener("click", function(){
  document.getElementById("input").value += "9";
});
document.getElementById("buttonClear").addEventListener("click", function(){
  document.getElementById("input").value = "";
});
document.getElementById("buttonDivide").addEventListener("click", function(){
  document.getElementById("input").value += "/";
});
document.getElementById("buttonMultiply").addEventListener("click", function(){
  document.getElementById("input").value += "*";
});
document.getElementById("buttonSub").addEventListener("click", function(){
  document.getElementById("input").value += "-";
});
document.getElementById("buttonAdd").addEventListener("click", function(){
  document.getElementById("input").value += "+";
});
document.getElementById("buttonPercent").addEventListener("click", function(){
  document.getElementById("input").value += ")";
});
document.getElementById("buttonDeci").addEventListener("click", function(){
  document.getElementById("input").value += "(";
});
document.getElementById("buttonSign").addEventListener("click", function(){
  document.getElementById("input").value = "-(" + document.getElementById("input").value + ")";
});
document.getElementById("buttonEqual").addEventListener("click", function(){
  Calculate(document.getElementById("input").value);
});

let presedenceArray = ["+", "1", "-", "1", "*", "2", "/", "2", "(", "3"];
const REGEX_ELEMENT_IDENTIFIER = /(\d+|\+|-|\*|\/|\(|\))/g;

let operatorStack = [];
let outputQueue = [];

function Calculate(expression){
  let inputArray = InputToArray(expression);
  operatorStack = [];
  outputQueue = [];
  //TODO Might want to validate that there were no invalid symbols before hand that did not get captured
  ToPostfix(inputArray);
  document.getElementById("input").value = outputQueue.join("");
}

function InputToArray(input){
  let inputStr = input;
  return inputStr.match(REGEX_ELEMENT_IDENTIFIER);
}

function ToPostfix(infixExpArray){
  let expression = infixExpArray;
  for(let i = 0; i < expression.length; i++){
    if(IsNumber(expression[i])){
      outputQueue.push(expression[i]);
    }
    else if(IsOperator(expression[i])){
      TryAddingToStack(expression[i]);
    }
    else if(expression[i] === ")"){
      PopToOpeningParentheses();
    }
  }
  PopRemainingOperators();
}

function PopToOpeningParentheses(){
  try{
    let opFromStack = operatorStack.pop();
    while(opFromStack !== "("){
      outputQueue.push(opFromStack);
      opFromStack = operatorStack.pop();
    }
  }
  catch(error){
    console.write(error);
  }
}

function IsNumber(string){
  return (string.match(/\d+/));
}

function IsOperator(string){
  return (string.match(/(\+|-|\*|\/|\()/));
}

function TryAddingToStack(operator)
{
  let presedence = GetOperatorPresedence(operator);

  while(operatorStack.length > 0){
    let opFromStack = operatorStack.pop();

    if(opFromStack === "(" || presedence > GetOperatorPresedence(opFromStack)){
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

function GetOperatorPresedence(operator){
  let opIndex = presedenceArray.findIndex(op => op === operator);
  if (opIndex !== -1)
  {
    return presedenceArray[opIndex+1];
  }
  return -1;
}

function PopRemainingOperators(){
  while(operatorStack.length > 0){
    outputQueue.push(operatorStack.pop());
  }
}

//TODO Validate that the input string is valid
//function ValidateInput(input)
