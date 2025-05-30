(() => {
  // Word list (sample 200 common words)
  const wordList = [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "I",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
    // add more words as needed
  ];

  // Elements
  const wordContainer = document.getElementById("wordContainer");
  const inputBox = document.getElementById("inputBox");
  const stats = document.getElementById("stats");
  const modeRadios = document.getElementsByName("wordCount");
  const customCountInput = document.getElementById("customCountInput");
  const settingsButton = document.getElementById("settingsButton");
  const settingsPanel = document.getElementById("settingsPanel");
  const themeSelect = document.getElementById("themeSelect");
  const fontSizeRange = document.getElementById("fontSizeRange");
  const fontSizeValue = document.getElementById("fontSizeValue");
  const ownerMenu = document.getElementById("ownerMenu");
  const resetStatsBtn = document.getElementById("resetStatsBtn");

  // State
  let words = [];
  let started = false;
  let startTime = 0;
  let finished = false;

  // Persistent User ID
  const STORAGE_KEY_ID = "emulationtype_user_id";
  let userId = localStorage.getItem(STORAGE_KEY_ID);
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem(STORAGE_KEY_ID, userId);
  }

  // Owner ID — Replace with your actual ID to unlock owner menu
  const OWNER_ID = "your-unique-id-here";

  // Generate UUID v4 for user ID
  function generateUUID() {
    return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
  }

  // Check owner status
  function checkOwner() {
    if (userId === OWNER_ID) {
      ownerMenu.style.display = "block";
    } else {
      ownerMenu.style.display = "none";
    }
  }

  // Pick random words from list, count number needed
  function pickWords(count) {
    const selected = [];
    while (selected.length < count) {
      const w = wordList[Math.floor(Math.random() * wordList.length)];
      if (!selected.includes(w)) selected.push(w);
    }
    return selected;
  }

  // Render words in container
  function renderWords() {
    wordContainer.innerHTML = "";
    words.forEach((word, wIdx) => {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("word");
      word.split("").forEach(char => {
        const charSpan = document.createElement("span");
        charSpan.textContent = char;
        wordSpan.appendChild(charSpan);
      });
      wordContainer.appendChild(wordSpan);
      if (wIdx < words.length - 1) {
        wordContainer.appendChild(document.createTextNode(" "));
      }
    });
  }

  // Update character highlights based on input
  function updateHighlight() {
    const input = inputBox.value;
    let charCount = 0;
    words.forEach((word, wIdx) => {
      const wordSpan = wordContainer.children[wIdx * 2]; // skip spaces
      for (let i = 0; i < word.length; i++) {
        const charSpan = wordSpan.children[i];
        const inputChar = input[charCount] || "";
        if (!inputChar) {
          charSpan.className = "";
        } else if (inputChar === charSpan.textContent) {
          charSpan.className = "correct";
        } else {
          charSpan.className = "incorrect";
        }
        charCount++;
      }
      charCount++; // for space after word
    });
  }

  // Calculate WPM and accuracy stats
  function calculateStats() {
    if (!started) {
      stats.textContent = `WPM: 0 | Accuracy: 100%`;
      return;
    }
    const now = Date.now();
    const elapsedMinutes = (now - startTime) / 60000;
    const input = inputBox.value;

    let correctChars = 0;
    for (let i = 0; i < input.length; i++) {
      if (input[i] === words.join(" ")[i]) {
        correctChars++;
      }
    }
    const wpm = elapsedMinutes > 0 ? Math.round((correctChars / 5) / elapsedMinutes) : 0;
    const accuracy = input.length > 0 ? Math.round((correctChars / input.length) * 100) : 100;
    stats.textContent = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
  }

  // Start typing test timer
  function startTest() {
    if (started) return;
    started = true;
    startTime = Date.now();
  }

  // Finish test
  function finishTest() {
    finished = true;
    inputBox.disabled = true;
  }

  // Reset test state & UI
  function resetTest() {
    started = false;
    finished = false;
    inputBox.disabled = false;
    inputBox.value = "";
    stats.textContent = "WPM: 0 | Accuracy: 100%";
    setWords();
    inputBox.focus();
  }

  // Set words based on selected mode
  function setWords() {
    let count = 10; // default
    for (const radio of modeRadios) {
      if (radio.checked) {
        if (radio.value === "custom") {
          const customVal = parseInt(customCountInput.value);
          count = (customVal >= 5 && customVal <= 200) ? customVal : 30;
        } else {
          count = parseInt(radio.value);
        }
        break;
      }
    }
    words = pickWords(count);
    renderWords();
  }

  // Event listeners
  inputBox.addEventListener("input", () => {
    if (finished) return;
    if (!started) startTest();

    updateHighlight();
    calculateStats();

    // Check if test complete
    if (inputBox.value.trim() === words.join(" ")) {
      finishTest();
    }
  });

  // Change mode - regenerate words
  modeRadios.forEach(radio => {
    radio.addEventListener("change", () => {
      if (radio.value === "custom") {
        customCountInput.style.display = "inline-block";
      } else {
        customCountInput.style.display = "none";
      }
      resetTest();
    });
  });

  customCountInput.addEventListener("input", () => {
    if (document.querySelector('input[name="wordCount"]:checked').value === "custom") {
      resetTest();
    }
  });

  // Settings panel toggle
  settingsButton.addEventListener("click", () => {
    if (settingsPanel.style.display === "block") {
      settingsPanel.style.display = "none";
    } else {
      settingsPanel.style.display = "block";
    }
  });

  // Theme selector
  themeSelect.addEventListener("change", () => {
    if (themeSelect.value === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
    localStorage.setItem("emulationtype_theme", themeSelect.value);
  });

  // Font size range
  fontSizeRange.addEventListener("input", () => {
    const size = fontSizeRange.value;
    fontSizeValue.textContent = size;
    wordContainer.style.fontSize = `${size}px`;
    inputBox.style.fontSize = `${size}px`;
    localStorage.setItem("emulationtype_fontSize", size);
  });

  // Owner menu reset stats button
  resetStatsBtn.addEventListener("click", () => {
    alert("Stats reset (placeholder) — you can extend this!");
  });

  // Load settings from localStorage
  function loadSettings() {
    const savedTheme = localStorage.getItem("emulationtype_theme");
    if (savedTheme) {
      themeSelect.value = savedTheme;
      if (savedTheme === "light") {
        document.body.classList.add("light");
      }
    }
    const savedFontSize = localStorage.getItem("emulationtype_fontSize");
    if (savedFontSize) {
      fontSizeRange.value = savedFontSize;
      fontSizeValue.textContent = savedFontSize;
      wordContainer.style.fontSize = `${savedFontSize}px`;
      inputBox.style.fontSize = `${savedFontSize}px`;
    }
  }

  // Initialization
  function init() {
    loadSettings();
    checkOwner();
    setWords();
    inputBox.focus();
  }

  init();

  // Expose resetTest for Owner menu (optional)
  window.resetTest = resetTest;

})();
