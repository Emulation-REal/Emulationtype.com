const wordList = [
  "emulation", "javascript", "keyboard", "typing", "challenge", "speed",
  "accuracy", "website", "github", "monkeytype", "clone", "custom"
];

const wordContainer = document.getElementById("word-container");
const inputField = document.getElementById("input-field");

let currentWordIndex = 0;
let currentCharIndex = 0;
let currentWord = wordList[currentWordIndex];

function renderWord() {
  wordContainer.innerHTML = "";

  for (let i = 0; i < currentWord.length; i++) {
    const span = document.createElement("span");
    span.textContent = currentWord[i];

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
    currentWordIndex = (currentWordIndex + 1) % wordList.length;
    currentWord = wordList[currentWordIndex];
    currentCharIndex = 0;
    renderWord();
  }
});

renderWord();
