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
  popup.classList.add('hidden'); // Hide initially
  popup.classList.add('show');   // Always include animation class

  setTimeout(() => {
    popup.classList.remove('hidden');           // Show after 3s
    popup.classList.add('clickable-popup');     // Show arrow
    popup.innerText = "Welcome to your streamer setup!";

    let clickCount = 0;
    popup.addEventListener('click', function handleClick() {
      clickCount++;
      if (clickCount === 1) {
        popup.innerText = "Be careful of who you encounter online… stay safe out there!!";
      } else if (clickCount === 2) {
        popup.classList.remove('clickable-popup'); // Remove arrow
        popup.classList.add('hidden');             // Hide popup
        popup.removeEventListener('click', handleClick); // Cleanup
        showScene3(); // ✅ Start Scene 3 here
      }
    });
  }, 3000); // 3-second delay after entering scene
}

function showScene3() {
  const popup = document.getElementById('scenario-popup');
  const setupScreen = document.getElementById('streamer-setup');

  // Hide other elements, reset popup
  popup.innerText = "";
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');

  // Step 1: Show context + problem
  popup.innerText = "After a great stream, you get a DM from someone claiming to be from 'Redwolf Gaming'...";
  
  let clickCount = 0;

  popup.onclick = () => {
    clickCount++;

    if (clickCount === 1) {
      popup.innerText = "They offer you $300 to promote their new game and send a link to ‘sign the collab form.’ What do you do?";
    }

    else if (clickCount === 2) {
      popup.classList.add('hidden');
      popup.classList.remove('clickable-popup');
      showChoicesForScene3();
    }
  };
}
function showChoicesForScene3() {
  const setupScreen = document.getElementById('streamer-setup');

  // Clear any previous buttons
  const oldBtns = document.querySelectorAll('.choice-btn');
  oldBtns.forEach(btn => btn.remove());

  const choices = [
    {
      text: "Click the link to fill in your info",
      outcome: "❌ The form looked official, but later your stream auto-ended. Password? Changed.\n\n“Damn. That was a phishing link. Gotta be more careful.”"
    },
    {
      text: "Reply asking them to email you instead",
      outcome: "🟡 They reply from a random Gmail with typos. Sus.\n\n“Brands usually use official emails. This smells fishy.”"
    },
    {
      text: "Block and report the account",
      outcome: "✅ You blocked them and warned your viewers.\n\n“Good call. Sponsors go through proper platforms.”"
    }
  ];

  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.classList.add('choice-btn');
    btn.innerText = choice.text;
    btn.onclick = () => {
      showOutcome(choice.outcome, showScene4); // When done, go to Scene 4
    };
    setupScreen.appendChild(btn);
  });
}
function showOutcome(text, nextSceneCallback) {
  const popup = document.getElementById('scenario-popup');

  popup.innerText = text;
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');

  // Remove choice buttons after selection
  document.querySelectorAll('.choice-btn').forEach(btn => btn.remove());

  let clicked = false;
  popup.onclick = () => {
    if (!clicked) {
      clicked = true;
      popup.classList.add('hidden');
      popup.classList.remove('clickable-popup');
      nextSceneCallback();
    }
  };
}

