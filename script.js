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
  popup.classList.add('hidden');
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('hidden');
    popup.classList.add('clickable-popup');

    let clickCount = 0;

    typeText(popup, "Welcome to your streamer setup!");

    popup.onclick = function handleClick() {
      if (popup.style.pointerEvents === "none") return; // Guard against early clicks

      clickCount++;
      if (clickCount === 1) {
        typeText(popup, "Be careful of who you encounter online… stay safe out there!!");
      } else if (clickCount === 2) {
        popup.classList.remove('clickable-popup');
        popup.classList.add('hidden');
        popup.removeEventListener('click', handleClick);
        showScene3();
      }
    };
  }, 3000);
}

function showScene3() {
  const popup = document.getElementById('scenario-popup');
  const setupScreen = document.getElementById('streamer-setup');

  // Hide other elements, reset popup
  popup.innerText = "";
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');

  // Step 1: Show context + problem
 typeText(popup, "After a great stream, you get a DM from someone claiming to be from 'Redwolf Gaming'...");
  
  let clickCount = 0;

  popup.onclick = () => {
    clickCount++;

    if (clickCount === 1) {
      typeText(popup, "They offer you $300 to promote their new game and send a link to ‘sign the collab form.’ What do you do?");
    }

    else if (clickCount === 2) {
  // 👇 Do NOT hide popup — let question stay on screen
  popup.classList.remove('clickable-popup');
  popup.onclick = null; // remove further clicks
  showChoicesForScene3();
    }
  };
}
function showChoicesForScene3() {
  const buttonsContainer = document.getElementById('scenario-buttons');
  buttonsContainer.innerHTML = ''; // Clear old buttons
  buttonsContainer.classList.remove('hidden');

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
    btn.disabled = true; // Disable while typing
    buttonsContainer.appendChild(btn);

    // Typing animation for button text
    typeText(btn, choice.text, 25, () => {
      btn.disabled = false;
      btn.onclick = () => {
        buttonsContainer.classList.add('hidden'); // Hide buttons after choosing
        showOutcome(choice.outcome, showScene4); // Next scene
      };
    });
  });
}


function showOutcome(text, nextSceneCallback) {
  const popup = document.getElementById('scenario-popup');

  typeText(popup, text);
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');

    // Remove previous event listeners by resetting onclick
  popup.onclick = null;

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
function showScene4() {
  alert("Scene 4 coming soon!");
}

function typeText(element, text, speed = 30, callback) {
  let index = 0;
  let buffer = "";

  element.style.pointerEvents = "none"; // Disable clicking while typing

  function type() {
    if (index < text.length) {
      buffer += text.charAt(index);
      element.textContent = buffer; // Use textContent to preserve spacing correctly
      index++;
      setTimeout(type, speed);
    } else {
      element.style.pointerEvents = "auto"; // Re-enable after typing
      if (callback) callback();
    }
  }

  type();
}
function showPopupWithTyping(text, callback) {
  const popup = document.getElementById('scenario-popup');
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');

  popup.onclick = null; // Clear existing click behavior
  typeText(popup, text, 30, () => {
    popup.onclick = () => {
      popup.classList.add('hidden');
      popup.classList.remove('clickable-popup');
      if (callback) callback();
    };
  });
}

