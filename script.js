const AUDIO = {
  click: 'assets/sfx/click-3.mp3',
  flip: 'assets/sfx/Standard Whip.mp3',
  success: 'assets/sfx/Success Sound Effect.mp3',
  fail: 'assets/sfx/Fail Sound Effect.mp3',
  bg: 'assets/audio/bg-music-loop.mp3'
};

// ✅ Declare bgMusic globally and configure
const bgMusic = new Audio(AUDIO.bg);
bgMusic.loop = true;
bgMusic.volume = 0.2;

const bgColors = [
  "#fef9c3", "#d1fae5", "#e0f2fe", "#fce7f3", "#ede9fe",
  "#f3f4f6", "#ffe4e6", "#f0fdf4", "#e7f5ff", "#fff7ed"
];

let current = 0;

const scenarios = [/* your scenarios (unchanged) */];

function startGame() {
  current = 0;
  showScenario();
  document.getElementById("start").classList.add("hidden");
  document.getElementById("play").classList.remove("hidden");
  document.getElementById("end").classList.add("hidden");
  document.getElementById("game").style.backgroundColor = bgColors[0];
  bgMusic.play().catch(() => {}); // safe autoplay fallback
}

function showScenario() {
  const sc = scenarios[current];

  // Update scenario text and avatar
  document.getElementById("scenario-title").innerText = sc.title;
  document.getElementById("scenario-text").innerText = sc.text;
  document.getElementById("avatar").src = sc.avatar;

  // Update choices
  document.getElementById("safe-front").innerText = sc.choices[0];
  document.getElementById("risk-front").innerText = sc.choices[1];

  const safeWrapper = document.getElementById("safe-wrapper");
  const riskWrapper = document.getElementById("risk-wrapper");

  safeWrapper.classList.remove("flip");
  riskWrapper.classList.remove("flip");

  safeWrapper.onclick = () => select("safe");
  riskWrapper.onclick = () => select("unsafe");

  const container = document.getElementById("choices-container");
  if (Math.random() < 0.5) {
    container.appendChild(safeWrapper);
    container.appendChild(riskWrapper);
  } else {
    container.appendChild(riskWrapper);
    container.appendChild(safeWrapper);
  }

  document.body.style.backgroundColor = bgColors[current] || "#f2f2f2";
  updateProgress(current + 1, scenarios.length);
}

function select(choice) {
  const sc = scenarios[current];
  const fb = document.getElementById("fb-text");
  const safeWrap = document.getElementById("safe-wrapper");
  const riskWrap = document.getElementById("risk-wrapper");

  if (choice === "safe") {
    safeWrap.classList.add("flip");
  } else {
    riskWrap.classList.add("flip");
  }

  playSound(AUDIO.flip);

  fb.innerText = sc.feedback[choice];
  fb.style.color = choice === sc.correct ? "#00d26a" : "#e74c3c";

  safeWrap.onclick = null;
  riskWrap.onclick = null;

  if (choice === sc.correct) {
    playSound(AUDIO.success);
  } else {
    playSound(AUDIO.fail);
  }

  setTimeout(() => {
    document.getElementById("play").classList.add("hidden");
    const feedbackSection = document.getElementById("feedback");
    feedbackSection.classList.remove("hidden");
    feedbackSection.classList.add("show");
  }, 700);
}

function next() {
  const playSection = document.getElementById("play");
  playSection.classList.add("fade-out");

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
  }, 500);
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
  sfx.volume = 0.6;
  sfx.play().catch((e) => {
    console.warn("Audio play failed:", e);
  });
}
