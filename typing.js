const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript is fun and powerful.",
  "Typing tests can improve your speed and accuracy.",
  "Practice makes perfect when learning to code."
];

let timer = null;
let startTime;
let quote = "";
let totalTyped = 0;

const quoteDisplay = document.getElementById("quote-display");
const quoteInput = document.getElementById("quote-input");
const wpmDisplay = document.getElementById("wpm");
const cpmDisplay = document.getElementById("cpm");
const accuracyDisplay = document.getElementById("accuracy");
const bestWpmDisplay = document.getElementById("best-wpm");
const restartBtn = document.getElementById("restart");
const darkToggle = document.getElementById("dark-toggle");

function loadNewQuote() {
  quote = quotes[Math.floor(Math.random() * quotes.length)];
  quoteDisplay.innerHTML = quote
    .split("")
    .map(char => `<span>${char}</span>`)
    .join("");
  quoteInput.value = "";
  resetStats();
}

function startTimer() {
  startTime = new Date();
  timer = setInterval(updateStats, 1000);
}

function updateStats() {
  const elapsed = (new Date() - startTime) / 1000 / 60; // in minutes
  const typed = quoteInput.value;
  totalTyped = typed.length;

  const correctChars = [...typed].filter((char, idx) => char === quote[idx]).length;
  const accuracy = ((correctChars / totalTyped) * 100).toFixed(0) || 100;

  const wordsTyped = typed.trim().split(/\s+/).length;
  const wpm = Math.round(wordsTyped / elapsed) || 0;
  const cpm = Math.round(totalTyped / elapsed) || 0;

  wpmDisplay.innerText = wpm;
  cpmDisplay.innerText = cpm;
  accuracyDisplay.innerText = accuracy + "%";

  updateBestScore(wpm);
}

function updateBestScore(currentWpm) {
  const bestWpm = localStorage.getItem("bestWpm") || 0;
  if (currentWpm > bestWpm) {
    localStorage.setItem("bestWpm", currentWpm);
    bestWpmDisplay.innerText = currentWpm;
  }
}

function showStoredBest() {
  const bestWpm = localStorage.getItem("bestWpm") || 0;
  bestWpmDisplay.innerText = bestWpm;
}

function highlightInput() {
  const input = quoteInput.value;
  const spanArray = quoteDisplay.querySelectorAll("span");

  spanArray.forEach((span, index) => {
    const char = input[index];
    if (char == null) {
      span.classList.remove("correct", "incorrect");
    } else if (char === span.innerText) {
      span.classList.add("correct");
      span.classList.remove("incorrect");
    } else {
      span.classList.add("incorrect");
      span.classList.remove("correct");
    }
  });

  if (input === quote) {
    clearInterval(timer);
    updateStats();
  }
}

quoteInput.addEventListener("input", () => {
  if (!timer) startTimer();
  highlightInput();
});

restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  loadNewQuote();
});

darkToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  darkToggle.innerText = document.body.classList.contains("dark")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

function resetStats() {
  wpmDisplay.innerText = "0";
  cpmDisplay.innerText = "0";
  accuracyDisplay.innerText = "100%";
}

loadNewQuote();
showStoredBest();
