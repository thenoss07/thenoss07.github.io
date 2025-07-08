const AUDIO = {
  click: 'assets/sfx/click-3.mp3',
  flip: 'assets/sfx/Standard Whip.mp3',
  success: 'assets/sfx/Success Sound Effect.mp3',
  fail: 'assets/sfx/Fail Sound Effect.mp3',
  bg: 'assets/audio/bg-music-loop.mp3'
};

bgMusic.loop   = true;
bgMusic.volume = 0.2;

const scenarios = [
  {
    title: "Free Game Skins",
    text: "A pop-up site says 'Login with IG to claim exclusive skins'.",
    avatar: "assets/avatar1.png",
    correct: "safe",
    choices: ["Close tab", "Login & claim"],
    feedback: {
      safe: "✅ This is a scam tactic. Never log in through unfamiliar links.",
      unsafe: "⚠️ Logging in can expose your account to theft."
    }
  },
  {
    title: "AI Friend on Discord",
    text: "Someone using an AI-generated profile starts chatting with you. They want to VC immediately.",
    avatar: "assets/avatar2.png",
    correct: "safe",
    choices: ["Ignore and report", "Join voice call"],
    feedback: {
      safe: "✅ Stay cautious. AI-generated personas can be used to trick you.",
      unsafe: "⚠️ Voice chats can be used to gather info or groom victims."
    }
  },
  {
    title: "Deepfake Video",
    text: "You see a video of your teacher saying something weird. Your friend DMs it to you.",
    avatar: "assets/avatar3.png",
    correct: "safe",
    choices: ["Verify before sharing", "Forward to your friends"],
    feedback: {
      safe: "✅ Deepfakes can be highly convincing. Don’t spread unverified content.",
      unsafe: "⚠️ Sharing it makes you part of the harm. Verify before reposting."
    }
  },
  {
    title: "Too Good to Be True",
    text: "Someone online offers you $50 for rating their game — just click a link.",
    avatar: "assets/avatar4.png",
    correct: "safe",
    choices: ["Block and report", "Click the link"],
    feedback: {
      safe: "✅ This is a phishing trap. Easy money promises are rarely safe.",
      unsafe: "⚠️ These links often install malware or steal info."
    }
  },
  {
    title: "AI 'Fan Edit'",
    text: "A viral edit shows a classmate in an inappropriate video. It looks AI-generated.",
    avatar: "assets/avatar5.png",
    correct: "safe",
    choices: ["Report the post", "Comment and share"],
    feedback: {
      safe: "✅ AI can be misused to defame others. Report it.",
      unsafe: "⚠️ Spreading this is image abuse, even if fake."
    }
  },
  {
    title: "Fake Contest DM",
    text: "You get a DM saying you've won a phone — just share your home address.",
    avatar: "assets/avatar6.png",
    correct: "safe",
    choices: ["Delete the message", "Send your address"],
    feedback: {
      safe: "✅ Real contests don’t randomly DM winners. Be skeptical.",
      unsafe: "⚠️ Sharing your address can lead to doxxing or worse."
    }
  },
  {
    title: "Emotional AI Stranger",
    text: "An AI chatbot pretending to be a teen opens up about feeling alone and wants to vent.",
    avatar: "assets/avatar7.png",
    correct: "safe",
    choices: ["Suggest talking to a helpline", "Comfort them privately"],
    feedback: {
      safe: "✅ AI can simulate emotions to earn your trust. Set boundaries.",
      unsafe: "⚠️ This may be manipulation to gain emotional control over you."
    }
  },
  {
    title: "Face Swap Scam",
    text: "A video shows your friend advertising a crypto scheme. Their face looks off.",
    avatar: "assets/avatar8.png",
    correct: "safe",
    choices: ["Call your friend to check", "Buy into the promo"],
    feedback: {
      safe: "✅ It’s likely a face-swap scam. Tell them directly before believing it.",
      unsafe: "⚠️ Deepfakes are used to trick even close friends."
    }
  },
  {
    title: "Online Secret Keeper",
    text: "A stranger says they know your secrets and asks you not to tell anyone.",
    avatar: "assets/avatar9.png",
    correct: "safe",
    choices: ["Tell a trusted adult", "Keep the secret"],
    feedback: {
      safe: "✅ Secrets used online are often a grooming tactic. Tell someone you trust.",
      unsafe: "⚠️ This could spiral into blackmail or manipulation."
    }
  },
  {
    title: "Fake Authority",
    text: "A message claims to be from your school’s IT dept asking for your password.",
    avatar: "assets/avatar10.png",
    correct: "safe",
    choices: ["Ignore and report", "Send your password"],
    feedback: {
      safe: "✅ Real institutions never ask for passwords via message.",
      unsafe: "⚠️ This is a phishing attack using impersonation."
    }
  }
];

const bgColors = [
  "#fef9c3", "#d1fae5", "#e0f2fe", "#fce7f3", "#ede9fe",
  "#f3f4f6", "#ffe4e6", "#f0fdf4", "#e7f5ff", "#fff7ed"
];

let current = 0;

function startGame() {
  current = 0;
  showScenario();
  document.getElementById("start").classList.add("hidden");
  document.getElementById("play").classList.remove("hidden");
  document.getElementById("end").classList.add("hidden");
  document.getElementById("game").style.backgroundColor = bgColors[0];
  bgMusic.play().catch(()=>{});   // will succeed after first user click

}

function showScenario() {
  const sc = scenarios[current];

  // Update scenario text and avatar
  document.getElementById("scenario-title").innerText = sc.title;
  document.getElementById("scenario-text").innerText = sc.text;
  document.getElementById("avatar").src = sc.avatar;

  // Update front text of each card
  document.getElementById("safe-front").innerText = sc.choices[0];
  document.getElementById("risk-front").innerText = sc.choices[1];

  // Reset flip classes to unflip cards for next scenario
  const safeWrapper = document.getElementById("safe-wrapper");
  const riskWrapper = document.getElementById("risk-wrapper");
  safeWrapper.classList.remove("flip");
  riskWrapper.classList.remove("flip");

  // Make sure click handlers are intact (re-assign to be safe)
  safeWrapper.onclick = () => select("safe");
  riskWrapper.onclick = () => select("unsafe");

  // Swap the order randomly by re-appending existing elements
  const container = document.getElementById("choices-container");
  if (Math.random() < 0.5) {
    container.appendChild(safeWrapper);
    container.appendChild(riskWrapper);
  } else {
    container.appendChild(riskWrapper);
    container.appendChild(safeWrapper);
  }

  // Set background color
  document.body.style.backgroundColor = bgColors[current] || "#f2f2f2";

  // Update progress bar
  updateProgress(current + 1, scenarios.length);
}



function select(choice) {
  const sc       = scenarios[current];
  const fb       = document.getElementById("fb-text");
  const safeWrap = document.getElementById("safe-wrapper");
  const riskWrap = document.getElementById("risk-wrapper");

  // Flip only selected card + flip SFX
  if (choice === "safe") {
    safeWrap.classList.add("flip");
  } else {
    riskWrap.classList.add("flip");
  }

  playSound(AUDIO.flip); // Play flip sound

  // Feedback
  fb.innerText  = sc.feedback[choice];
  fb.style.color = choice === sc.correct ? "#00d26a" : "#e74c3c";

  // Disable further clicks
  safeWrap.onclick = null;
  riskWrap.onclick = null;

  // Play correct/incorrect sound
  if (choice === sc.correct) {
    playSound(AUDIO.success);
  } else {
    playSound(AUDIO.fail);
  }

  // Show feedback after delay
  setTimeout(() => {
    document.getElementById("play").classList.add("hidden");
    const feedbackSection = document.getElementById("feedback");
    feedbackSection.classList.remove("hidden");
    feedbackSection.classList.add("show");
  }, 700);
}





function next() {
  const playSection = document.getElementById("play");
  playSection.classList.add("fade-out"); // start fade out

  setTimeout(() => {
    current++;
    if (current < scenarios.length) {
      showScenario();
      document.getElementById("feedback").classList.add("hidden");
      playSection.classList.remove("fade-out");
      document.getElementById("play").classList.remove("hidden");
    } else {
      document.getElementById("feedback").classList.add("hidden");
      document.getElementById("end").classList.remove("hidden");
      document.getElementById("result").innerText = "You’ve completed all 10 scenarios!";
      document.body.style.backgroundColor = "#ffffff";
    }
  }, 500); // match transition duration
}


function restart() {
  location.reload();
}

function updateProgress(current, total) {
  const percent = Math.floor((current / total) * 100);
  const barFill = document.getElementById("bar-fill");
  barFill.style.width = percent + "%";
  barFill.classList.add("pulse");

  setTimeout(() => {
    barFill.classList.remove("pulse");
  }, 1200);
}
function playSound(src) {
  const sfx = new Audio(src);
  sfx.volume = 0.6; // adjust volume globally here
  sfx.play().catch((e) => {
    console.warn("Audio play failed:", e);
  });
}

//test from home computer