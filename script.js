const AUDIO = {
  bg: 'Future Design.mp3'
};

// ✅ Declare bgMusic globally and configure
const bgMusic = new Audio(AUDIO.bg);
bgMusic.loop = true;
bgMusic.volume = 0.01;

function playClickSound() {
  const clickSfx = document.getElementById("click-sfx");
  if (clickSfx) {
    clickSfx.volume = 0.2; // 🔉 Set volume to 20%
    clickSfx.currentTime = 0;
    clickSfx.play();
  }
}


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
const hoverSfx = document.getElementById('hover-sfx');

document.addEventListener('mouseover', (e) => {
  if (e.target.classList.contains('choice-btn')) {
    hoverSfx.currentTime = 0;
    hoverSfx.play();
  }
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
    const username = document.getElementById("username").value.trim() || "Streamer";
    const usernameDisplay = document.getElementById("username-display");

    // Show username at top-left
    usernameDisplay.innerText = `👤 ${username}`;
    usernameDisplay.style.display = 'block';

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
  const setupScreen = document.getElementById('streamer-setup');
  setupScreen.classList.remove('hidden');

  // Set username display
  const usernameDisplay = document.getElementById('username-display');
  const username = document.getElementById('username').value.trim();

  if (username) {
    usernameDisplay.innerText = `👤 ${username}`;
    usernameDisplay.style.display = 'block'; // make sure it's visible
  } else {
    usernameDisplay.style.display = 'none';
  }

  const popup = document.getElementById('scenario-popup');
  popup.classList.add('hidden');
  popup.classList.add('show');

  setTimeout(() => {
    popup.classList.remove('hidden');
    popup.classList.add('clickable-popup');
    popup.innerText = "";

    let clickCount = 0;

    typeText(popup, "Welcome to your streamer setup!");

    popup.onclick = function handleClick() {
      if (popup.style.pointerEvents === "none") return;
      playClickSound();
      clickCount++;

      if (clickCount === 1) {
        typeText(popup, "Be careful of who you encounter online… stay safe out there!!");
      } else if (clickCount === 2) {
        typeText(popup, "🍇 Collect all 5 grapes by choosing the best actions in each scenario!");
      } else if (clickCount === 3) {
        popup.classList.remove('clickable-popup');
        popup.classList.add('hidden');
        popup.removeEventListener('click', handleClick);
        showScene3(); // Start the first real scenario
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
    playClickSound();
    clickCount++;

    if (clickCount === 1) {
      typeText(popup, "They offer you $300 to promote their new game and send a link to ‘sign the collab form.’\nWhat do you do?");
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
  outcome: {
    crash: true,
    streamer: "…Wait. What just happened to my stream?",
    message: "❌ The form looked official, but later your stream auto-ended. Password? Changed.\n\n“Dang it... I shouldn't have clicked it...”",
    chat: [
      "[System]: Stream has ended.",
      "[GamerX]: uh… what just happened?",
      "[PixelFan3/1]: hacker???",
      "[L33tPlayer]: yoooo be safe streamer!"
    ]
  }
},
  {
    text: "Reply asking them to email you instead",
    outcome: {
      streamer: "Huh, they replied... from a Gmail account?",
      message: "🟡 They reply from a random Gmail with typos. Sus.\n\n“Brands usually use official emails. This smells fishy.”",
      chat: [
        "[IRLToast]: dude that’s sketchy af",
        "[SimpNation420]: bro email?? 💀",
        "[tech_goblin]: that’s not how sponsorships work"
      ],
      glitch: false
    }
  },
  {
    text: "Block and report the account",
    outcome: {
      isCorrect: true,
      streamer: "Nah, not today. That felt off.",
      message: "✅ You blocked them and warned your viewers.\n\n“Good call. Sponsors go through proper platforms.”",
      chat: [
        "[PixelSnacc]: W move 🔥",
        "[RealOn3]: 200 IQ play fr",
        "[JustJelly]: mod behaviour"
      ],
      glitch: false
    }
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
      playClickSound();
      buttonsContainer.classList.add('hidden');
      showOutcome(choice.outcome, showScene4, choice.chatKey); // ← add chatKey
      };
    });
  });
}

function showOutcome(outcomeObj, nextSceneCallback) {
  const popup = document.getElementById('scenario-popup');
  const viewerChat = document.getElementById('viewer-chat');
  const crashGlitch = document.getElementById('crash-glitch'); // NEW element for crash effect

  // Reset popup
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');
  popup.innerText = "";
  popup.onclick = null;

  // Hide viewer chat initially
  viewerChat.classList.add('hidden');
  viewerChat.innerText = "";

  // Remove any old buttons
  document.querySelectorAll('.choice-btn').forEach(btn => btn.remove());

  let stage = 0;
  let isTypingChat = false;  // <-- flag to block clicks during chat typing

  const advance = () => {
    if (isTypingChat) return;  // ignore clicks while chat is typing

    stage++;

    if (stage === 1) {
      // If this is a crash outcome (e.g., phishing), run glitch effect
      if (outcomeObj.crash) {
        // Dim background
        document.getElementById('streamer-setup').style.filter = 'brightness(0.4)';

        // Activate glitch overlay
        crashGlitch.classList.add('active');

        // Delay then continue story
        setTimeout(() => {
          crashGlitch.classList.remove('active');
          document.getElementById('streamer-setup').style.filter = '';
          typeText(popup, outcomeObj.streamer);
        }, 2500);
      } else {
        typeText(popup, outcomeObj.streamer);
      }

    } else if (stage === 2) {
      typeText(popup, outcomeObj.message);

      // ✅ Award grape ONLY if the outcome is marked correct
      if (outcomeObj.isCorrect) {
        starsEarned++;
        const grape = document.getElementById(`grape-${starsEarned}`);
        if (grape) {
          grape.classList.remove('hidden', 'show'); // just in case
          grape.classList.add('show');

          const grapeSfx = document.getElementById('grape-sfx');
          if (grapeSfx) {
            grapeSfx.volume = 0.08; // 🔉 adjust volume here (0.0 to 1.0)
            grapeSfx.currentTime = 0; // rewind to start
            grapeSfx.play();
          }
        }
      }

    } else if (stage === 3) {
      // Show viewer chat with typing effect
      viewerChat.classList.remove('hidden');

      let lines = outcomeObj.chat;
      let i = 0;
      viewerChat.innerText = "";

      const notifSound = document.getElementById('notif-sfx');
      notifSound.volume = 0.15;

      isTypingChat = true;  // block clicks while chat types

      function typeChatLine() {
        if (i < lines.length) {
          viewerChat.innerText += lines[i] + "\n";

          notifSound.currentTime = 0;  // rewind to start
          notifSound.play();

          // Stop sound after 1 second
          setTimeout(() => {
            notifSound.pause();
            notifSound.currentTime = 0;
          }, 1000);

          i++;
          setTimeout(typeChatLine, 2000); // Delay between chat lines
        } else {
          // Done typing all chat lines — enable clicks again
          isTypingChat = false;
        }
      }

      typeChatLine();

    } else {
      popup.classList.add('hidden');
      popup.classList.remove('clickable-popup');
      popup.onclick = null;
      viewerChat.classList.add('hidden');
      transitionToScene(nextSceneCallback);
    }
  };

  popup.onclick = advance;
  playClickSound();
  advance(); // Start first step
}



function typeText(element, text, speed = 30, callback) {
  let index = 0;
  let buffer = "";

  element.style.pointerEvents = "none"; // Disable clicking while typing
  const typingSfx = document.getElementById("typing-sfx");
  if (typingSfx) {
    typingSfx.volume = 0.05;
    typingSfx.loop = true;
    typingSfx.currentTime = 0;
    typingSfx.play();
  }

  function type() {
    if (index < text.length) {
      buffer += text.charAt(index);
      element.textContent = buffer;
      index++;
      setTimeout(type, speed);
    } else {
      element.style.pointerEvents = "auto"; // Re-enable after typing
      if (typingSfx) {
        typingSfx.pause();
        typingSfx.currentTime = 0;
      }
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
      playClickSound();
      popup.classList.add('hidden');
      popup.classList.remove('clickable-popup');
      if (callback) callback();
    };
  });
}
function transitionToScene(callback, text = "The next stream begins...") {
  const overlay = document.createElement('div');
  overlay.className = 'transition-overlay';
  document.body.appendChild(overlay);

  const message = document.createElement('div');
  message.className = 'transition-text';
  overlay.appendChild(message);

  typeText(message, text, 40, () => {
    overlay.classList.add('clickable');

    overlay.onclick = () => {
      
      overlay.classList.remove('clickable');
      overlay.style.animation = 'fadeOut 0.8s forwards';

      setTimeout(() => {
        document.body.removeChild(overlay);
        callback();
      }, 800); // Match fade duration
    };
  });
}
let starsEarned = 0;

function awardStar() {
  starsEarned++;
  const star = document.getElementById(`star-${starsEarned}`);
  if (star) star.classList.add('earned');
}
function transitionToScene8(callback) {
  const popup = document.getElementById('scenario-popup');
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');
  popup.innerText = "";

  typeText(popup, "✅ Stream over. Let's see how you did...");

  popup.onclick = () => {
    playClickSound();
    popup.classList.add('hidden');
    popup.classList.remove('clickable-popup');
    callback(); // call showScene8
  };
}


function showScene4() {
  const popup = document.getElementById('scenario-popup');
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');
  popup.innerText = "";

  let clickCount = 0;

  typeText(popup, "After your stream, someone you recently collaborated with DMs you.");

  popup.onclick = () => {
    playClickSound();
    clickCount++;

    if (clickCount === 1) {
      typeText(popup, `"You're really chill, haha. Loved the energy today."`);
    } else if (clickCount === 2) {
      typeText(popup, `"Hey... send me a fun selfie? Just for me 😉 I won’t share it, promise."`);
    } else if (clickCount === 3) {
      popup.classList.remove('clickable-popup');
      popup.onclick = null;
      showChoicesForScene4();
    }
  };
}

function showChoicesForScene4() {
  const buttonsContainer = document.getElementById('scenario-buttons');
  buttonsContainer.innerHTML = '';
  buttonsContainer.classList.remove('hidden');

  const choices = [
    {
      text: "They seem cool – maybe a flirty selfie is fine?",
      outcome: {
        crash: true,
        streamer: "…Wait. Why is this picture all over social media!!",
        message: "❌ They screenshot your photo and started spreading it.\n\n“Even people you *think* you trust can turn on you. Don't send picures / videos to those you don't know. Always protect your boundaries.”",
        chat: [
          "[System]: Screenshot leaked.",
          "[xoxoBlur]: that’s so messed up…",
          "[ModShredder]: we’re reporting this.",
          "[ChocoHeart]: sending hugs 🧡"
        ]
      }
    },
    {
      text: "Say no but keep chatting – don’t want to offend them.",
      outcome: {
        streamer: "They said 'it’s chill'... but now they’re asking me for weird favors.",
        message: "🟡 You tried to be polite, but things got uncomfortable fast.\n\n“Sometimes you have to keep a distance to remain comfortable and safe.”",
        chat: [
          "[IRLToast]: yikes… red flag 😬",
          "[crunchghost]: ppl need to respect creators man",
          "[rat_racer]: always trust your gut!"
        ]
      }
    },
    {
      text: "Block and report.",
      outcome: {
        isCorrect: true,
        streamer: "Blocked them. I don’t need that energy.",
        message: "✅ You stood your ground and protected your space.\n\n“Respecting yourself means setting hard boundaries when needed. This helps you stay safe from potential online predators.”",
        chat: [
          "[JustJelly]: W queen 👑",
          "[RealOn3]: stream safety first, always",
          "[ModShredder]: clean block, mod approved ✅"
        ]
      }
    }
  ];

  choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.classList.add('choice-btn');
    btn.disabled = true;
    buttonsContainer.appendChild(btn);

    typeText(btn, choice.text, 25, () => {
      btn.disabled = false;
      btn.onclick = () => {
      playClickSound();
        buttonsContainer.classList.add('hidden');
        showOutcome(choice.outcome, showScene5); // Placeholder for next scene
      };
    });
  });
}
function showScene5() {
  const popup = document.getElementById('scenario-popup');
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');
  popup.innerText = "";

  let clickCount = 0;

  typeText(popup, "One of your top chatters, ‘MysticVoid’, DMs you after stream.");

  popup.onclick = () => {
    playClickSound();
    clickCount++;

    if (clickCount === 1) {
      typeText(popup, "They’ve been in your community for weeks. Super generous. Super supportive.");
    } else if (clickCount === 2) {
      typeText(popup, "But today’s message hits different…");
    } else if (clickCount === 3) {
      typeText(popup, "‘Hey, I think we really connect. Can we talk more privately? Like, outside of stream?’");
    } else if (clickCount === 4) {
      popup.classList.remove('clickable-popup');
      popup.onclick = null;
      showChoicesForScene5();
    }
  };
}

function showChoicesForScene5() {
  const buttonsContainer = document.getElementById('scenario-buttons');
  buttonsContainer.innerHTML = '';
  buttonsContainer.classList.remove('hidden');

  const choices = [
    {
      text: "Sure, here's my Number – just don’t be weird lol",
      outcome: {
        crash: true,
        streamer: "I thought I was just being friendly…",
        message: "❌ They started spamming your DMs, got clingy, and started drama when ignored.\n\n“Its difficult to keep my distance now...”\nDon't give out your personal information.",
        chat: [
          "[System]: Private messages increasing rapidly.",
          "[GamerX]: bro is obsessed 😳",
          "[IRLToast]: parasocial moment…",
          "[realDealz]: ughh i hate when this happens"
        ]
      }
    },
    {
      text: "Appreciate the support, but I keep my personal life separate.",
      outcome: {
        isCorrect: true,
        streamer: "Gotta protect my space. I'm not just content.",
        message: "✅ They seemed disappointed, but you stood firm.\n\n“We can still talk when I'm on stream!”\nKeeping your distance prevents unwanted situations.",
        chat: [
          "[streambean]: smart boundaries 💯",
          "[SoftFury]: respecttttt",
          "[L33tPlayer]: personal space is key"
        ]
      }
    },
    {
      text: "Ignore the message completely.",
      outcome: {
        streamer: "Now they’re spamming chat with passive-aggressive comments.",
        message: "🟡 You hoped ignoring it would make it go away. It didn’t.\n\n“Sometimes silence sends the wrong message.”\nCould've avoided this from the beginning...",
        chat: [
          "[MysticVoid]: guess you're too cool to reply now huh",
          "[ModShredder]: yo chill mystic",
          "[xoxoBlur]: this ain’t the place for this"
        ]
      }
    }
  ];

  // Shuffle choices
  const shuffled = choices.sort(() => Math.random() - 0.5);

  shuffled.forEach(choice => {
    const btn = document.createElement('button');
    btn.classList.add('choice-btn');
    btn.disabled = true;
    buttonsContainer.appendChild(btn);

    typeText(btn, choice.text, 25, () => {
      btn.disabled = false;
      btn.onclick = () => {
      playClickSound();
        buttonsContainer.classList.add('hidden');
        showOutcome(choice.outcome, showScene6); // or your next scene function
      };
    });
  });
}
function showScene6() {
  const popup = document.getElementById('scenario-popup');
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');
  popup.innerText = "";

  let clickCount = 0;

  typeText(popup, "A fan slides into your DMs with a sweet deal… but something feels off.");

  popup.onclick = () => {
    playClickSound();
    clickCount++;

    if (clickCount === 1) {
      typeText(popup, `"Hey! Want a free gaming console? Just click this link and fill in your info!"`);
    } else if (clickCount === 2) {
      popup.classList.remove('clickable-popup');
      popup.onclick = null;
      showChoicesForScene6();
    }
  };
}

function showChoicesForScene6() {
  const buttonsContainer = document.getElementById('scenario-buttons');
  buttonsContainer.innerHTML = '';
  buttonsContainer.classList.remove('hidden');

  const choices = [
    {
      text: "Click the link and enter your details right away.",
      outcome: {
        crash: true,
        streamer: "…Wait. My account’s acting weird!",
        message: "❌ You got hacked! Someone’s scamming your followers using your account.",
        chat: [
          "[System]: Account compromised!",
          "[FanBoy123]: No way! Stay safe!",
          "[ModAlert]: Mods are on it!",
          "[GamerGirl]: That’s brutal, man."
        ],
      }
    },
    {
      text: "Ask for proof that the giveaway is legit.",
      outcome: {
        streamer: "They sent a generic reply with no real proof.",
        message: "🟡 Seems sketchy. Always verify before trusting.",
        chat: [
          "[Skeptic101]: I wouldn’t trust that.",
          "[SafeStreamer]: Smart to ask questions!",
          "[PixelPro]: Always verify, folks."
        ],
      }
    },
    {
      text: "Ignore and report the message as suspicious.",
      outcome: {
        isCorrect: true,
        streamer: "You reported the suspicious account. Good call!",
        message: "✅ Protecting your community means saying no to scams.",
        chat: [
          "[ChatKing]: Respect!",
          "[ModAlert]: Reported and handled.",
          "[FanSafe]: Thanks for keeping it real."
        ],
      }
    }
  ];

  // Shuffle choices so order isn’t predictable
  const shuffledChoices = choices.sort(() => Math.random() - 0.5);

  shuffledChoices.forEach(choice => {
    const btn = document.createElement('button');
    btn.classList.add('choice-btn');
    btn.disabled = true;
    buttonsContainer.appendChild(btn);

    typeText(btn, choice.text, 25, () => {
      btn.disabled = false;
      btn.onclick = () => {
      playClickSound();
        buttonsContainer.classList.add('hidden');
        showOutcome(choice.outcome, showScene7);  // Assuming you have a showScene7
        if (choice.outcome.isCorrect) {
          addGrapeToShelf();
        }
      };
    });
  });
}

function showScene7() {
  const popup = document.getElementById('scenario-popup');
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');
  popup.innerText = "";

  let clickCount = 0;

  typeText(popup, "You’re prepping for your next stream when you see a post trending on X (formerly Twitter)...");

  popup.onclick = () => {
    playClickSound();
    clickCount++;

    if (clickCount === 1) {
      typeText(popup, "It claims that a major creator DRJOHN said something outrageously offensive — and it’s blowing up.");
    } else if (clickCount === 2) {
      typeText(popup, "You know the streamer. You’ve even collabed with DRJOHN before.");
    } else if (clickCount === 3) {
      popup.classList.remove('clickable-popup');
      popup.onclick = null;
      showChoicesForScene7();
    }
  };
}

function showChoicesForScene7() {
  const buttonsContainer = document.getElementById('scenario-buttons');
  buttonsContainer.innerHTML = '';
  buttonsContainer.classList.remove('hidden');

  const choices = [
    {
      text: "Check the full clip and context before reacting",
      outcome: {
        isCorrect: true,
        streamer: "Turns out the clip was edited. They were actually calling out that offensive behavior, not promoting it.",
        message: "✅ You took the time to verify before reacting.\n\n“Jumping the gun can ruin reputations and spread misinformation. Smart move.”",
        chat: [
          "[JustJelly]: that’s why I trust this streamer 💯",
          "[RealOn3]: FINALLY someone fact-checks",
          "[SnaccTime]: context is everything fr"
        ]
      }
    },
    {
      text: "Immediately tweet your disappointment to your followers",
      outcome: {
        streamer: "Oh shoot… Turns out the clip was edited. They were actually calling out that offensive behavior, not promoting it.",
        message: "🟡 You joined the outrage mob — but it backfired.\n\n“Always check for credibility before commenting on the matter. Once it's out there, it's hard to take back.”",
        chat: [
          "[Viewer123]: bro delete that tweet 🚀",
          "[oopsDoxxed]: this aged like milk",
          "[ModShredder]: facts > feelings next time"
        ]
      }
    },
    {
      text: "Post a reaction video calling them out, then go live",
      outcome: {
        crash: true,
        streamer: "…Wait. They just called me out for spreading lies?!",
        message: "❌ Turns out the clip was edited. Your reaction went viral but for the wrong reasons. You’ve just become the disinfo.",
        chat: [
          "[System]: Stream has ended.",
          "[xoxoBlur]: this you?? 🙀",
          "[PixelSnacc]: L take",
          "[RealOn3]: spreading lies ain’t it chief"
        ]
      }
    }
  ];

  // Shuffle choices to randomize order
  const shuffled = choices.sort(() => Math.random() - 0.5);

  shuffled.forEach(choice => {
    const btn = document.createElement('button');
    btn.classList.add('choice-btn');
    btn.disabled = true;
    buttonsContainer.appendChild(btn);

    typeText(btn, choice.text, 25, () => {
      btn.disabled = false;
      btn.onclick = () => {
      playClickSound();
        buttonsContainer.classList.add('hidden');
        showOutcome(choice.outcome, () => {
          showClosingTransition(showScene8); // 👈 New transition before final scene
        });
      };
    });
  });
}

function showClosingTransition(callback) {
  const popup = document.getElementById('scenario-popup');
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');
  popup.innerText = "";

  typeText(popup, "✅ Stream complete. Let's take a look at how you did...");

  // Add animated arrow if needed
  const arrow = document.createElement('div');
  arrow.className = 'next-arrow';
  arrow.innerHTML = "&#10148;&#10148;"; // double right arrow
  popup.appendChild(arrow);

  popup.onclick = () => {
    playClickSound();
    popup.classList.add('hidden');
    popup.classList.remove('clickable-popup');
    callback(); // ➜ showScene8
  };
}


function showScene8() {
  const popup = document.getElementById('scenario-popup');
  const viewerChat = document.getElementById('viewer-chat');
  const grapeShelf = document.getElementById('grape-shelf');

  // Reset screen
  document.querySelectorAll('.choice-btn').forEach(btn => btn.remove());
  viewerChat.classList.add('hidden');
  popup.innerHTML = ""; // Clear previous content
  popup.classList.remove('hidden');
  popup.classList.add('clickable-popup');

  // Grape summary container
  const grapeSummary = document.createElement('div');
  grapeSummary.classList.add('grape-summary');

  for (let i = 1; i <= 5; i++) {
    const grape = document.createElement('img');
    grape.src = 'grapes-7366627_1280.png';
    grape.classList.add('grape');
    if (i <= starsEarned) {
      grape.classList.add('show', 'bounce');
    } else {
      grape.classList.add('dimmed'); // for grapes not earned
    }
    grapeSummary.appendChild(grape);
  }

  // Randomised final reflection message
  const messages = [
    "🧠 Online harms aren’t always obvious — trust your instincts and think before you click.",
    "🛡️ You have the power to protect your space online — your choices matter.",
    "📱 Pause. Question. Stay sharp. The internet isn’t always what it seems.",
    "💬 What you share, who you trust, and how you react — it all shapes your digital safety."
  ];
  const finalMessage = messages[Math.floor(Math.random() * messages.length)];

  const scoreText = document.createElement('p');
  scoreText.innerText = `🍇 You collected ${starsEarned} out of 5 grapes!`;

  const finalNote = document.createElement('p');
  finalNote.innerText = finalMessage;
  finalNote.classList.add('final-note');

  const replayBtn = document.createElement('button');
  replayBtn.innerText = "Replay";
  replayBtn.classList.add('choice-btn');
  replayBtn.onclick = () => location.reload();

  // Assemble popup
  popup.appendChild(scoreText);
  popup.appendChild(grapeSummary);
  popup.appendChild(finalNote);
  popup.appendChild(replayBtn);
}
