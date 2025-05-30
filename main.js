// Generate or get permanent ID
let userID = localStorage.getItem("emulationtype_id");
if (!userID) {
  userID = "user-" + Math.random().toString(36).substr(2, 9);
  localStorage.setItem("emulationtype_id", userID);
}
console.log("Your ID:", userID);

// === WORDS ===
const WORDS = [
  "keyboard", "javascript", "emulation", "developer", "browser", "function",
  "asynchronous", "repository", "design", "matrix", "code", "project", "performance",
  "module", "interactive", "feature", "type", "visual", "component", "theme", "data",
  "logic", "parameter", "terminal", "array", "object", "syntax", "callback", "button",
  "typing", "network", "input", "focus", "media", "speed", "accuracy", "configurable",
  "settings", "interface", "render", "loop", "timer", "custom", "dynamic", "global",
  "access", "identifier", "token", "mod", "admin", "emulationtype", "script"
];

// === DOM ===
const wordsContainer = document.getElementById("words");
const input = document.getElementById("input");
const modeSelector = document.getElementById("mode-selector");
const customCount = document.getElementById("custom-count");
const settingsBtn = document.getElementById("settings");
const settingsPanel = document.getElementById("settings-panel");
const themeSelect = document.getElementById("theme-select");
const ownerMenu = document.getElementById("owner-menu");

// === State ===
let currentWords = [];
let wordIndex = 0;

// === Functions ===
function generateWords(count) {
  currentWords = [];
  for (let i = 0; i < count; i++) {
    currentWords.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  wordsContainer.textContent = currentWords.join(" ");
  wordIndex = 0;
  input.value = "";
  input.focus();
}

function applyTheme(theme) {
  switch (theme) {
    case "dark":
      document.body.style.backgroundColor = "#0f0f0f";
      document.body.style.color = "white";
      break;
    case "light":
      document.body.style.backgroundColor = "white";
      document.body.style.color = "#111";
      break;
    case "blue":
      document.body.style.backgroundColor = "#0d1117";
      document.body.style.color = "#00ffff";
      break;
  }
  localStorage.setItem("theme", theme);
}

function checkOwnerAccess() {
  const ownerID = "user-yourid"; // Replace with your actual ID
  if (userID === ownerID) {
    ownerMenu.style.display = "block";
  }
}

// === Events ===
modeSelector.addEventListener("change", () => {
  if (modeSelector.value === "custom") {
    customCount.style.display = "inline";
  } else {
    customCount.style.display = "none";
    generateWords(parseInt(modeSelector.value));
  }
});

customCount.addEventListener("change", () => {
  const val = parseInt(customCount.value);
  if (!isNaN(val)) generateWords(val);
});

input.addEventListener("input", () => {
  const typed = input.value.trim().split(" ");
  if (typed.length >= currentWords.length) {
    alert("✅ Finished!");
    generateWords(currentWords.length);
  }
});

settingsBtn.addEventListener("click", () => {
  settingsPanel.style.display = settingsPanel.style.display === "block" ? "none" : "block";
});

themeSelect.addEventListener("change", () => {
  applyTheme(themeSelect.value);
});

// === Init ===
applyTheme(localStorage.getItem("theme") || "dark");
generateWords(10);
checkOwnerAccess();
