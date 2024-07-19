const calculator = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
};

// Perform calculations based on the operator
const performCalculation = {
  "/": (firstOperand, secondOperand) => firstOperand / secondOperand,
  "*": (firstOperand, secondOperand) => firstOperand * secondOperand,
  "+": (firstOperand, secondOperand) => firstOperand + secondOperand,
  "-": (firstOperand, secondOperand) => firstOperand - secondOperand,
  "%": (firstOperand, secondOperand) => (firstOperand * secondOperand) / 100,
  "=": (firstOperand, secondOperand) => secondOperand,
};

// Function to limit the display value to a maximum of 10 digits including decimal places
function formatDisplayValue(value) {
  let [integerPart, decimalPart] = value.split(".");
  if (decimalPart) {
    decimalPart = decimalPart.slice(0, 10); // Limit decimal part to 10 digits
    return `${integerPart}.${decimalPart}`;
  }
  return value;
}

// Function to handle digit input
function inputDigit(digit) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) {
    calculator.displayValue = digit;
    calculator.waitingForSecondOperand = false;
  } else {
    // Limit display value to 10 characters including decimal places
    if (displayValue.length < 10 || displayValue.includes(".")) {
      calculator.displayValue =
        displayValue === "0" ? digit : displayValue + digit;
      calculator.displayValue = formatDisplayValue(calculator.displayValue);
    }
  }
}

// Function to handle decimal point input
function inputDecimal(dot) {
  const { displayValue, waitingForSecondOperand } = calculator;

  if (waitingForSecondOperand === true) return;

  // If the `displayValue` does not contain a decimal point
  if (!displayValue.includes(dot)) {
    calculator.displayValue += dot;
    calculator.displayValue = formatDisplayValue(calculator.displayValue);
  }
}

// Function to handle operator input
function handleOperator(nextOperator) {
  const { firstOperand, displayValue, operator } = calculator;
  const inputValue = parseFloat(displayValue);

  if (operator && calculator.waitingForSecondOperand) {
    calculator.operator = nextOperator;
    return;
  }

  if (firstOperand == null && !isNaN(inputValue)) {
    calculator.firstOperand = inputValue;
  } else if (operator) {
    const result = performCalculation[operator](firstOperand, inputValue);
    calculator.displayValue = String(result);
    calculator.displayValue = formatDisplayValue(calculator.displayValue);
    calculator.firstOperand = result;
  }

  calculator.waitingForSecondOperand = true;
  calculator.operator = nextOperator;
}

// Function to reset the calculator
function resetCalculator() {
  calculator.displayValue = "0";
  calculator.firstOperand = null;
  calculator.waitingForSecondOperand = false;
  calculator.operator = null;
}

// Function to update the display with the current value
function updateDisplay() {
  const display = document.querySelector("#calculator-screen");
  display.textContent = calculator.displayValue;
}

// Function to handle backspace
function handleBackspace() {
  let { displayValue } = calculator;

  if (displayValue.length > 1) {
    displayValue = displayValue.slice(0, -1);
  } else {
    displayValue = "0";
  }

  calculator.displayValue = displayValue;
  calculator.displayValue = formatDisplayValue(calculator.displayValue);
}

// Function to simulate a button click for visual feedback
function simulateButtonClick(button) {
  button.classList.add("active");
  setTimeout(() => {
    button.classList.remove("active");
  }, 100); // Duration of the active effect
}

// Add event listeners for calculator buttons
const keys = document.querySelector(".calculator-keys");
keys.addEventListener("click", (event) => {
  const { target } = event;

  if (!target.matches("button")) {
    return;
  }

  if (target.classList.contains("operator")) {
    handleOperator(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("decimal")) {
    inputDecimal(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("all-clear")) {
    resetCalculator();
    updateDisplay();
    return;
  }

  if (target.classList.contains("percent")) {
    handleOperator(target.value);
    updateDisplay();
    return;
  }

  if (target.classList.contains("backspace")) {
    handleBackspace();
    updateDisplay();
    return;
  }

  inputDigit(target.value);
  updateDisplay();
});

// Add keyboard support
document.addEventListener("keydown", (event) => {
  const key = event.key;
  const button = document.querySelector(`button[value="${key}"]`);

  if (button) {
    simulateButtonClick(button);

    if (key >= "0" && key <= "9") {
      inputDigit(key);
    } else if (key === ".") {
      inputDecimal(key);
    } else if (["+", "-", "*", "/"].includes(key)) {
      handleOperator(key);
    } else if (key === "Enter" || key === "=") {
      handleOperator("=");
    } else if (key === "Escape") {
      resetCalculator();
    } else if (key === "%") {
      handleOperator("%");
    } else if (key === "Backspace") {
      handleBackspace();
    }

    updateDisplay();
  }
});
