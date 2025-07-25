// Element References
const display = document.getElementById('display');
const buttonContainer = document.getElementById('buttonContainer');
const modeToggle = document.getElementById('modeToggle');
const themeToggle = document.getElementById('themeToggle');
const historyBtn = document.getElementById('historyBtn');
const historyPanel = document.getElementById('historyPanel');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistory');

let isScientific = false;
let history = [];

const simpleButtons = [
  '7', '8', '9', '/', 'AC',
  '4', '5', '6', '*', '%',
  '1', '2', '3', '-', '.',
  '0', '=', '+', '', ''
];


const scientificButtons = [
  // First row: Clear, Delete, Brackets, Mode
  'AC', 'DEL', '(', ')', 'Rad', 'Deg',

  // Second row: Trig functions & inverse
  'Inv', 'sin', 'cos', 'tan', 'x!', '√',

  // Third row: Logs, constants, powers
  'ln', 'log', 'π', 'e', 'xʸ', 'EXP',

  // Fourth row: Numbers and %
  '7', '8', '9', '/', '%',
  '4', '5', '6', '*', 'Ans',
  '1', '2', '3', '-', '±',
  '0', '.', '=', '+'
];

function renderButtons() {
  buttonContainer.innerHTML = '';
  const btns = isScientific ? scientificButtons : simpleButtons;
  btns.forEach(label => {
    if (label === '') {
      buttonContainer.appendChild(document.createElement('div'));
    } else {
      const btn = document.createElement('button');
      btn.textContent = label;
      btn.addEventListener('click', () => handleButtonClick(label));
      buttonContainer.appendChild(btn);
    }
  });
}

function handleButtonClick(value) {
  switch (value) {
    case 'AC':
      display.value = '';
      break;
    case '=':
      try {
        const result = eval(replaceConstants(display.value));
        addToHistory(`${display.value} = ${result}`);
        display.value = result;
      } catch {
        display.value = 'Error';
      }
      break;
    case 'π':
      display.value += Math.PI;
      break;
    case 'e':
      display.value += Math.E;
      break;
    case '√':
      display.value = Math.sqrt(parseFloat(display.value));
      break;
    case 'x!':
      display.value = factorial(parseInt(display.value));
      break;
    case 'Ans':
      display.value += history.length ? history[history.length - 1].split('=')[1].trim() : '';
      break;
    default:
      display.value += value;
  }
}

function replaceConstants(str) {
  return str.replace(/π/g, Math.PI).replace(/e/g, Math.E);
}

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

function addToHistory(entry) {
  history.push(entry);
  const li = document.createElement('li');
  li.textContent = entry;
  historyList.appendChild(li);
}

modeToggle.addEventListener('change', () => {
  isScientific = modeToggle.checked;
  renderButtons();
});

themeToggle.addEventListener('change', () => {
  document.body.classList.toggle('light');
});

historyBtn.addEventListener('click', () => {
  historyPanel.style.display = historyPanel.style.display === 'block' ? 'none' : 'block';
});

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  historyList.innerHTML = '';
});

// Keyboard Input
document.addEventListener('keydown', (e) => {
  const allowed = '0123456789+-*/().%';
  if (allowed.includes(e.key)) display.value += e.key;
  if (e.key === 'Enter') handleButtonClick('=');
  if (e.key === 'Backspace') display.value = display.value.slice(0, -1);
});

// Init
renderButtons();
