const AUDIO = {
  click: 'click-3.mp3',
  flip: 'Standard Whip.mp3',
  success: 'Success Sound Effect.mp3',
  fail: 'Fail Sound Effect.mp3',
  bg: 'Future Design.mp3'
};

// ✅ Declare bgMusic globally and configure
const bgMusic = new Audio(AUDIO.bg);
bgMusic.loop = true;
bgMusic.volume = 0.02;

const bgColors = [
  "#fef9c3", "#d1fae5", "#e0f2fe", "#fce7f3", "#ede9fe",
  "#f3f4f6", "#ffe4e6", "#f0fdf4", "#e7f5ff", "#fff7ed"
];
let current = 0;
// Wait for DOM content to load
document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const startBtn = document.getElementById("start-btn");

  // Enable button only if username is non-empty (trimmed)
  usernameInput.addEventListener("input", () => {
    startBtn.disabled = usernameInput.value.trim().length === 0;
  });

  // When button clicked, save username and start game
  startBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (username === "") return;

    window.playerName = username;

    // Disable input and button during loading
    usernameInput.disabled = true;
    startBtn.disabled = true;
    startBtn.innerText = "Starting...";

    const loadingBarContainer = document.getElementById("start-loading-bar-container");
    const loadingBar = document.getElementById("start-loading-bar");

    loadingBarContainer.classList.remove("hidden");
    loadingBarContainer.classList.add("show");

    loadingBar.style.width = "0%";

    // Start loading only *after* clicking Enter
    setTimeout(() => {
      loadingBar.style.width = "100%";
    }, 100); // short delay before animation starts

    // Wait 3.5s, then show streamer setup first
    setTimeout(() => {
    showStreamerSetup("Starting stream...", () => {
    startGame(); // This triggers the first scenario or whatever comes next
  });
}, 3600);
  });

  // Try to autoplay background music on page load
  bgMusic.play().catch(() => {
    // If autoplay blocked, play on first user interaction
    function playBgMusic() {
      bgMusic.play().catch(() => {});
      window.removeEventListener("click", playBgMusic);
      window.removeEventListener("keydown", playBgMusic);
    }
    window.addEventListener("click", playBgMusic);
    window.addEventListener("keydown", playBgMusic);
  });
});

function playSound(src) {
  const sfx = new Audio(src);
  sfx.volume = 0.6;
  sfx.play().catch((e) => {
    console.warn("Audio play failed:", e);
  });
}
function startLoadingBar() {
  document.getElementById("start-btn").addEventListener("click", () => {
  const container = document.getElementById("loading-bar-container");
  const bar = document.getElementById("loading-bar");

  container.classList.add("show");    // fade it in
  bar.style.width = "100%";           // animate fill

  // Optional: transition to the next screen after it loads
  setTimeout(() => {
    startGame(); // or whatever function you use to begin
  }, 3000); // match transition duration
});
}

function showStreamerSetup(message, callback) {
  document.getElementById('start').classList.add('hidden');
  document.getElementById('streamer-setup').classList.remove('hidden');

  const popup = document.getElementById('scenario-popup');
  popup.classList.add('hidden'); // Make sure it's hidden initially
  popup.classList.add('show');   // Animation class, always present

  setTimeout(() => {
    popup.classList.remove('hidden'); // Show after 5s
    popup.innerText = "Welcome to your streamer setup!";

    let clickCount = 0;
    popup.addEventListener('click', () => {
      clickCount++;
      if (clickCount === 1) {
        popup.innerText = "Be careful of who you encounter online… stay safe out there!!";
      } else if (clickCount === 2) {
        popup.classList.add('hidden'); // Hide popup
        callback(); // Transition to next scene
      }
    });
  }, 5000); // Delay before showing popup
}



