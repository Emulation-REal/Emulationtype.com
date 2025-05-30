const wordList = [
  "emulation", "javascript", "keyboard", "typing", "challenge", "speed", "accuracy", "website", "github",
  "clone", "custom", "function", "return", "constant", "input", "output", "language", "code", "html", "css",
  "design", "development", "logic", "event", "variable", "value", "script", "modular", "system", "command",
  "element", "character", "array", "loop", "syntax", "random", "check", "result", "score", "timer", "layout",
  "theme", "owner", "permission", "status", "controller", "detect", "player", "generate", "validate", "render"
];

let wordContainer = document.getElementById("word-container");
let inputField = document.getElementById("input-field");
let modeSelector = document.getElementById("mode-selector");
let customInput = document.getElementById("custom-count");
let ownerMenu = document.getElementById("owner-menu");

let currentWords = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let currentWord = "";
let userID = getUserID();

function getUserID() {
  let id = localStorage.getItem("emulationtype_id");
  if (!id) {
    id = "user-" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("emulationtype_id", id);
  }
  return id;
}

function verifyOwner() {
  const ownerId = "your_id_here"; // 🔑 Replace with your ID
  if (userID === ownerId) {
    ownerMenu.style.display = "block";
  }
}

function shuffleWords(count) {
  const shuffled = [...wordList].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function renderWord() {
  wordContainer.innerHTML = "";

  const word = currentWords[currentWordIndex] || "";
  currentWord = word;

  for (let i = 0; i < word.length; i++) {
    const span = document.createElement("span");
    span.textContent = word[i];
    if (i === currentCharIndex) {
      span.classList.add("cursor");
    }
    wordContainer.appendChild(span);
  }
}

inputField.addEventListener("input", () => {
  const value = inputField.value;
  const spans = wordContainer.querySelectorAll("span");

  for (let i = 0; i < currentWord.length; i++) {
    const char = value[i];
    const span = spans[i];

    if (char == null) {
      span.classList.remove("correct", "incorrect");
    } else if (char === currentWord[i]) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  }

  currentCharIndex = value.length;

  if (value === currentWord) {
    inputField.value = "";
    currentWordIndex++;
    currentCharIndex = 0;

    if (currentWordIndex >= currentWords.length) {
      alert("Test completed!");
      inputField.disabled = true;
      return;
    }

    renderWord();
  }
});

modeSelector.addEventListener("change", () => {
  customInput.style.display = modeSelector.value === "custom" ? "inline-block" : "none";
});

function startTest() {
  inputField.disabled = false;
  inputField.value = "";
  inputField.focus();

  let count = parseInt(modeSelector.value);
  if (modeSelector.value === "custom") {
    count = parseInt(customInput.value) || 10;
  }

  currentWords = shuffleWords(count);
  currentWordIndex = 0;
  currentCharIndex = 0;
  renderWord();
}

verifyOwner();
