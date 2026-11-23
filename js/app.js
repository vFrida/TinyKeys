(function () {
  const LESSONS = window.TYPING_LESSONS || [];
  const STORAGE_KEY = "xiaoxiao-typing-v1";
  const TRACKS = {
    en: { name: "英语", lead: "从食指的家走到完整短句", door: "Aa", mark: "认识字母键" },
    py: { name: "拼音", lead: "声母韵母，再打出家里的话", door: "妈", mark: "ma · mā" }
  };

  const KEYMETA = {
    q: ["左手小指", "pinky"], a: ["左手小指", "pinky"], z: ["左手小指", "pinky"],
    w: ["左手无名指", "ring"], s: ["左手无名指", "ring"], x: ["左手无名指", "ring"],
    e: ["左手中指", "middle"], d: ["左手中指", "middle"], c: ["左手中指", "middle"],
    r: ["左手食指", "index"], f: ["左手食指", "index"], v: ["左手食指", "index"],
    t: ["左手食指", "index"], g: ["左手食指", "index"], b: ["左手食指", "index"],
    y: ["右手食指", "index"], h: ["右手食指", "index"], n: ["右手食指", "index"],
    u: ["右手食指", "index"], j: ["右手食指", "index"], m: ["右手食指", "index"],
    i: ["右手中指", "middle"], k: ["右手中指", "middle"], ",": ["右手中指", "middle"],
    o: ["右手无名指", "ring"], l: ["右手无名指", "ring"], ".": ["右手无名指", "ring"],
    p: ["右手小指", "pinky"], ";": ["右手小指", "pinky"], "/": ["右手小指", "pinky"],
    " ": ["大拇指", "thumb"]
  };

  const ROWS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"]
  ];

  const app = document.getElementById("app");
  let progress = load();
  let stepTimer = 0;
  let moodTimer = 0;
  let wrongTimer = 0;

  const state = {
    view: "home",
    track: "en",
    lessonId: null,
    phase: "intro",
    step: 0,
    pos: 0,
    wrong: 0,
    startedAt: 0,
    justWrong: false,
    caps: false,
    ime: false,
    result: null
  };

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return { sound: true, lessons: {} };
      const data = JSON.parse(raw);
      data.lessons = data.lessons && typeof data.lessons === "object" ? data.lessons : {};
      data.sound = typeof data.sound === "boolean" ? data.sound : true;
      return data;
    } catch (err) {
      return { sound: true, lessons: {} };
    }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch (err) {}
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[ch]));
  }

  function starsOf(id) {
    const rec = progress.lessons[id];
    return rec ? rec.stars : 0;
  }

  function lessonsIn(track) {
    return LESSONS.filter((lesson) => lesson.track === track);
  }

  function lessonById(id) {
    return LESSONS.find((lesson) => lesson.id === id);
  }

  function current() {
    return lessonById(state.lessonId);
  }

  function ordered() {
    return lessonsIn("en").concat(lessonsIn("py"));
  }

  function continueTarget() {
    const all = ordered();
    return all.find((lesson) => starsOf(lesson.id) === 0)
      || all.find((lesson) => starsOf(lesson.id) < 3)
      || null;
  }

  function trackRecommend(track) {
    const list = lessonsIn(track);
    return list.find((lesson) => starsOf(lesson.id) === 0)
      || list.find((lesson) => starsOf(lesson.id) < 3)
      || null;
  }

  function nextLesson(id) {
    const lesson = lessonById(id);
    const list = lessonsIn(lesson.track);
    const index = list.findIndex((item) => item.id === id);
    return list[index + 1] || null;
  }

  function starsHtml(n) {
    return [1, 2, 3].map((i) => `<span class="star${i <= n ? " on" : ""}">★</span>`).join("");
  }

  function mascot() {
    return `<div class="bob"><svg class="mascot mood-idle" viewBox="0 0 120 120" aria-hidden="true">
      <path fill="#ffc83d" stroke="#1f1a14" stroke-width="4" d="M60 8l14 30 33 3-25 21 8 32-30-17-30 17 8-32L13 41l33-3z"/>
      <g class="face-idle" fill="#1f1a14">
        <circle cx="46" cy="64" r="4"/><circle cx="74" cy="64" r="4"/>
        <path d="M46 76q14 12 28 0" fill="none" stroke="#1f1a14" stroke-width="3" stroke-linecap="round"/>
      </g>
      <g class="face-oops" fill="#1f1a14">
        <circle cx="46" cy="64" r="5"/><circle cx="74" cy="64" r="5"/>
        <circle cx="60" cy="80" r="5" fill="none" stroke="#1f1a14" stroke-width="3"/>
      </g>
    </svg></div>`;
  }

  function setMood(mood) {
    document.querySelectorAll(".mascot").forEach((el) => {
      el.classList.remove("mood-idle", "mood-happy", "mood-oops");
      void el.offsetWidth;
      el.classList.add("mood-" + mood);
    });
  }

  let audioCtx = null;
  function tone(freq, dur, type, volume) {
    if (!progress.sound) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + dur);
  }

  function playOk() {
    tone(520, 0.09, "sine", 0.06);
    setTimeout(() => tone(700, 0.1, "sine", 0.05), 70);
  }

  function playBad() { tone(180, 0.14, "triangle", 0.04); }

  function playWin() {
    [523, 659, 784, 1046].forEach((freq, index) => {
      setTimeout(() => tone(freq, 0.16, "sine", 0.06), index * 120);
    });
  }

  function clearTimers() {
    clearTimeout(stepTimer);
    clearTimeout(moodTimer);
    clearTimeout(wrongTimer);
  }

  function shellTop(logoAct) {
    const logo = logoAct
      ? `<button class="logo" data-act="home">★ 小小打字家</button>`
      : `<div class="logo plain">★ 小小打字家</div>`;
    return `<header class="top">${logo}<div class="top-actions">
      <button class="text-btn" id="sound-btn" data-act="sound"></button>
    </div></header>`;
  }

  function render() {
    clearTimers();
    document.body.dataset.view = state.view;
    document.body.dataset.track = state.track;
    if (state.view === "home") renderHome();
    else if (state.view === "track") renderTrack();
    else renderPlay();
    updateBanners();
  }

  function renderHome() {
    document.title = "小小打字家";
    const total = ordered().reduce((sum, lesson) => sum + starsOf(lesson.id), 0);
    const max = ordered().length * 3;
    const target = continueTarget();
    const any = ordered().some((lesson) => starsOf(lesson.id) > 0);
    let continueHtml = "";
    if (target) {
      const label = any ? `继续练习 · ${target.title}` : "从第一课开始";
      continueHtml = `<button class="btn primary continue" data-act="lesson" data-id="${target.id}">${esc(label)}</button>`;
    } else if (any) {
      continueHtml = `<button class="btn primary continue" data-act="track" data-track="en">全部三星，去复习英语</button>`;
    }

    app.innerHTML = `${shellTop(false)}
      <section class="hero">
        <div>${mascot()}</div>
        <div>
          <p class="eyebrow">给小朋友的打字练习</p>
          <h1>小小打字家</h1>
          <p class="lead">先找对键，再慢慢打。英语从手指回家开始，拼音从声母韵母打到日常的话。</p>
          <span class="star-count">已收集 ${total} / ${max} 颗星</span>
          ${continueHtml}
        </div>
      </section>
      <section class="doors">
        ${door("en")}
        ${door("py")}
      </section>
      <section class="howto">
        <article><span>1</span><p>看大圆里的下一个字母</p></article>
        <article><span>2</span><p>在键盘上找发亮的键</p></article>
        <article><span>3</span><p>用说好的那根手指按下去</p></article>
      </section>
      <p class="fine">用电脑键盘最合适，也可以点屏幕上的键。打字前把输入法换成英文。
        <button class="linkish" data-act="clear">清除星星记录</button>
      </p>`;
  }

  function door(track) {
    const meta = TRACKS[track];
    const list = lessonsIn(track);
    const got = list.reduce((sum, lesson) => sum + starsOf(lesson.id), 0);
    const mastered = list.filter((lesson) => starsOf(lesson.id) === 3).length;
    return `<button class="door ${track}" data-act="track" data-track="${track}">
      <span class="kicker">${esc(meta.mark)}</span>
      <h2>${esc(meta.name)}</h2>
      <p>${esc(meta.lead)}</p>
      <div class="mark">${esc(meta.door)}</div>
      <p>${mastered} / ${list.length} 课满星 · 星星 ${got} / ${list.length * 3}</p>
      <span class="go">进入 →</span>
    </button>`;
  }

  function renderTrack() {
    const meta = TRACKS[state.track];
    document.title = `${meta.name} · 小小打字家`;
    const list = lessonsIn(state.track);
    const recommend = trackRecommend(state.track);
    app.innerHTML = `${shellTop(true)}
      <div class="track-head">
        <button class="text-btn" data-act="home">返回</button>
        <h2>${esc(meta.name)}</h2>
        <p>${esc(meta.lead)}。每一课都会亮起下一个键，并告诉你用哪根手指。</p>
      </div>
      <ol class="path">
        ${list.map((lesson, index) => {
          const here = recommend && recommend.id === lesson.id;
          return `<li><button class="${here ? "here" : ""}" data-act="lesson" data-id="${lesson.id}">
            ${here ? '<span class="ribbon">现在学</span>' : ""}
            <em>${String(index + 1).padStart(2, "0")}</em>
            <strong>${esc(lesson.title)}</strong>
            <small>${esc(lesson.blurb)}</small>
            <span class="stars">${starsHtml(starsOf(lesson.id))}</span>
          </button></li>`;
        }).join("")}
      </ol>`;
  }

  function renderPlay() {
    const lesson = current();
    const meta = TRACKS[lesson.track];
    document.title = `${lesson.title} · 小小打字家`;
    const spot = lesson.spotlight.map((ch) => `<span class="mini-key">${esc(labelFor(ch))}</span>`).join("");
    app.innerHTML = `${shellTop(true)}
      <section class="play">
        <div class="play-top">
          <button class="text-btn" data-act="back">返回</button>
          <div>${mascot()}</div>
          <div>
            <p class="kicker">${esc(meta.name)}</p>
            <h2>${esc(lesson.title)}</h2>
          </div>
          <p id="progress"></p>
        </div>
        <div id="intro" class="intro-card">
          <p id="intro-text"></p>
          <div id="spot-wrap"><div class="spot" id="spot">${spot}</div></div>
          <button class="btn primary" data-act="start">开始打字</button>
          <p class="slow">不用赶时间，打准比打快重要。</p>
        </div>
        <div id="practice" class="panel" hidden>
          <div class="stage">
            <div id="ball" class="ball" aria-hidden="true"><b></b><small></small></div>
            <div>
              <p id="gloss" class="gloss"></p>
              <p id="readline" class="read"></p>
              <div id="prompt" class="prompt"></div>
              <p id="coach" class="coach" aria-live="polite"></p>
            </div>
          </div>
          <div id="dots" class="dots"></div>
        </div>
        <p id="caps" class="banner" hidden>大写锁定开着。按一下 Caps Lock 关掉，再继续。</p>
        <p id="ime" class="banner" hidden>现在像是中文输入法。请换成英文，比如 ABC 或 English，再打字母。</p>
        <div class="keyboard" id="board">${keyboardHtml()}</div>
        <ul class="legend">
          <li><i class="swatch finger-pinky"></i>小指</li>
          <li><i class="swatch finger-ring"></i>无名指</li>
          <li><i class="swatch finger-middle"></i>中指</li>
          <li><i class="swatch finger-index"></i>食指</li>
          <li><i class="swatch finger-thumb"></i>拇指</li>
        </ul>
        <p class="ime-tip">F 和 J 上的小横线，对应真实键盘的凸起。打字前确认输入法是英文。</p>
        <div id="overlay" class="overlay" hidden>
          <div class="result">
            <div id="confetti" class="confetti"></div>
            ${mascot()}
            <h3 id="result-title"></h3>
            <div id="result-stars" class="big-stars"></div>
            <p id="result-stats"></p>
            <p id="result-note"></p>
            <div class="result-actions">
              <button class="btn" id="retry-btn" data-act="retry">再练一次</button>
              <button class="btn" id="next-btn" data-act="next">下一课</button>
              <button class="btn" data-act="back">返回课程</button>
            </div>
          </div>
        </div>
      </section>`;
    document.getElementById("intro-text").textContent = lesson.intro;
    if (!lesson.spotlight.length) document.getElementById("spot-wrap").hidden = true;
    updatePlay();
  }

  function keyboardHtml() {
    const rows = ROWS.map((row, index) => {
      const keys = row.map(keyButton).join("");
      return `<div class="row r${index + 1}">${keys}</div>`;
    }).join("");
    return `${rows}<div class="row">${keyButton(" ")}</div>`;
  }

  function keyButton(ch) {
    const meta = KEYMETA[ch] || ["", "index"];
    const bump = ch === "f" || ch === "j" ? '<i class="bump"></i>' : "";
    const wide = ch === " " ? " spacebar" : "";
    return `<button type="button" tabindex="-1" class="key finger-${meta[1]}${wide}" data-act="key" data-key="${esc(ch)}" aria-label="${esc(labelFor(ch) + "，" + meta[0])}">
      <span class="keycap">${esc(labelFor(ch))}</span>
      <i class="fingerbar finger-${meta[1]}"></i>
      ${bump}
    </button>`;
  }

  function labelFor(ch) {
    if (ch === " ") return "空格";
    if (ch === ";") return ";";
    return ch.toUpperCase();
  }

  function updatePlay() {
    const lesson = current();
    if (!lesson || !document.getElementById("progress")) return;
    const step = lesson.steps[state.step];
    document.getElementById("intro").hidden = state.phase !== "intro";
    document.getElementById("practice").hidden = state.phase === "intro";
    document.getElementById("overlay").hidden = state.phase !== "done";

    const progressText = state.phase === "intro"
      ? "先看一看"
      : state.phase === "done"
        ? "完成"
        : `第 ${state.step + 1} / ${lesson.steps.length} 行`;
    document.getElementById("progress").textContent = progressText;

    if (state.phase !== "intro") fillPractice(lesson, step);
    paintKeys(lesson, step);
    if (state.phase === "done") fillResult(lesson);
    updateBanners();
  }

  function fillPractice(lesson, step) {
    const gloss = document.getElementById("gloss");
    const read = document.getElementById("readline");
    const prompt = document.getElementById("prompt");
    const showing = state.phase === "between" ? step.keys.length : state.pos;
    gloss.textContent = step.mean || "";
    gloss.classList.toggle("big", Array.from(step.mean || "").length > 0 && Array.from(step.mean).length <= 4);
    read.textContent = step.read ? "读作 " + step.read : "";
    prompt.innerHTML = Array.from(step.keys).map((ch, index) => {
      let cls = "glyph";
      if (ch === " ") cls += " space";
      if (index < showing) cls += " done";
      else if (index === showing && state.phase === "typing") cls += " now";
      if (index === showing && state.justWrong) cls += " bad";
      const text = ch === " " ? "空格" : ch;
      return `<span class="${cls}">${esc(text)}</span>`;
    }).join("");
    prompt.setAttribute("aria-label", "请打：" + step.keys);

    const ball = document.getElementById("ball");
    const big = ball.querySelector("b");
    const small = ball.querySelector("small");
    ball.classList.toggle("bad", state.justWrong && state.phase === "typing");
    if (state.phase === "between") {
      big.textContent = "★";
      small.textContent = "";
    } else if (state.phase === "done") {
      big.textContent = "★";
      small.textContent = "";
    } else {
      const ch = step.keys[state.pos];
      big.textContent = labelFor(ch);
      const hint = ch === "v" && `${step.read || ""}${step.mean || ""}`.includes("ü") ? "ü" : "";
      small.textContent = hint;
    }
    document.getElementById("coach").textContent = coachText(step);
    const doneCount = state.phase === "between" ? state.step + 1 : state.step;
    document.getElementById("dots").innerHTML = lesson.steps.map((_, index) => {
      const cls = index < doneCount ? "done" : index === state.step && state.phase === "typing" ? "now" : "";
      return `<i class="${cls}"></i>`;
    }).join("");
  }

  function coachText(step) {
    if (state.phase === "between") return "好，下一行马上就来";
    if (state.phase === "done") return "这一课打完啦";
    const ch = step.keys[state.pos];
    const meta = KEYMETA[ch];
    const finger = meta ? meta[0] : "手指";
    let line;
    if (ch === " ") line = "用大拇指按空格，把字分开";
    else if (ch === "v" && `${step.read || ""}${step.mean || ""}`.includes("ü")) line = "左手食指按 V，拼音里的 ü 就是它";
    else if (ch === ";") line = `${finger}，按分号`;
    else line = `${finger}，按 ${ch.toUpperCase()}`;
    return state.justWrong ? `没关系，再看一次。${line}` : line;
  }

  function paintKeys(lesson, step) {
    document.querySelectorAll(".key").forEach((key) => {
      key.classList.remove("next", "learn", "is-down", "is-bad");
    });
    if (state.phase === "intro") {
      lesson.spotlight.forEach((ch) => {
        const key = findKey(ch);
        if (key) key.classList.add("learn");
      });
      return;
    }
    if (state.phase === "typing") {
      const key = findKey(step.keys[state.pos]);
      if (key) key.classList.add("next");
    }
  }

  function findKey(ch) {
    return Array.from(document.querySelectorAll(".key")).find((el) => el.dataset.key === ch);
  }

  function pulseKey(ch, className) {
    const key = findKey(ch);
    if (!key) return;
    key.classList.add(className);
    setTimeout(() => key.classList.remove(className), 160);
  }

  function fillResult(lesson) {
    const result = state.result;
    if (!result) return;
    const titles = { 3: "三颗星收好啦", 2: "打得很认真", 1: "这一课完成啦" };
    const notes = {
      3: "手指记得很牢。想再玩，就从课程里挑一课。",
      2: "已经很稳了。再打一遍，就有机会拿到第三颗星。",
      1: "打完就是进步。再来一次时，眼睛跟着发亮的键走。"
    };
    document.getElementById("result-title").textContent = titles[result.stars];
    document.getElementById("result-stars").innerHTML = starsHtml(result.stars);
    const wrongText = result.wrong === 0 ? "没有按错" : `按错 ${result.wrong} 次`;
    document.getElementById("result-stats").textContent = `准确率 ${result.acc}% · ${wrongText} · 用时 ${formatDuration(result.ms)}`;
    document.getElementById("result-note").textContent = notes[result.stars];
    document.getElementById("retry-btn").classList.toggle("primary", result.stars < 3);
    const upcoming = nextLesson(lesson.id);
    const nextBtn = document.getElementById("next-btn");
    nextBtn.textContent = upcoming ? "下一课" : "课程学完啦";
    nextBtn.classList.toggle("primary", result.stars === 3);
  }

  function formatDuration(ms) {
    const seconds = Math.max(1, Math.round(ms / 1000));
    if (seconds < 60) return `${seconds} 秒`;
    return `${Math.floor(seconds / 60)} 分 ${seconds % 60} 秒`;
  }

  function updateBanners() {
    const caps = document.getElementById("caps");
    const ime = document.getElementById("ime");
    if (caps) caps.hidden = !state.caps;
    if (ime) ime.hidden = !state.ime;
    const soundBtn = document.getElementById("sound-btn");
    if (soundBtn) {
      soundBtn.textContent = progress.sound ? "有声音" : "静音";
      soundBtn.setAttribute("aria-pressed", progress.sound ? "true" : "false");
    }
  }

  function startLesson() {
    clearTimers();
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    state.phase = "typing";
    state.step = 0;
    state.pos = 0;
    state.wrong = 0;
    state.justWrong = false;
    state.result = null;
    state.startedAt = Date.now();
    const confetti = document.getElementById("confetti");
    if (confetti) confetti.innerHTML = "";
    updatePlay();
    setMood("idle");
  }

  function finishLesson() {
    const lesson = current();
    const needed = lesson.steps.reduce((sum, step) => sum + step.keys.length, 0);
    const acc = needed / (needed + state.wrong);
    const stars = acc >= 0.97 ? 3 : acc >= 0.85 ? 2 : 1;
    const percent = Math.round(acc * 100);
    const prev = progress.lessons[lesson.id] || { stars: 0, accuracy: 0, plays: 0 };
    prev.plays += 1;
    prev.stars = Math.max(prev.stars, stars);
    prev.accuracy = Math.max(prev.accuracy, percent);
    progress.lessons[lesson.id] = prev;
    save();
    state.phase = "done";
    state.result = { stars: stars, acc: percent, wrong: state.wrong, ms: Date.now() - state.startedAt };
    const colors = ["#ffc83d", "#ff8a3d", "#7ed0c4", "#5aa6e6", "#f08a7a", "#c8efb8"];
    const confetti = document.getElementById("confetti");
    if (confetti) {
      confetti.innerHTML = Array.from({ length: 16 }, (_, index) => {
        const x = 6 + (index * 6) % 90;
        return `<i style="--x:${x}%;--d:${index * 0.03}s;--c:${colors[index % colors.length]}"></i>`;
      }).join("");
    }
    updatePlay();
    setMood("happy");
    playWin();
  }

  function onChar(ch) {
    if (state.view !== "play" || state.phase !== "typing") return;
    const lesson = current();
    const step = lesson.steps[state.step];
    const want = step.keys[state.pos];
    if (ch !== want) {
      state.wrong += 1;
      state.justWrong = true;
      updatePlay();
      pulseKey(ch, "is-bad");
      playBad();
      setMood("oops");
      clearTimeout(wrongTimer);
      clearTimeout(moodTimer);
      wrongTimer = setTimeout(() => {
        state.justWrong = false;
        const now = document.querySelector(".glyph.now");
        const ball = document.getElementById("ball");
        if (now) now.classList.remove("bad");
        if (ball) ball.classList.remove("bad");
        const coach = document.getElementById("coach");
        if (coach) coach.textContent = coachText(step);
      }, 420);
      moodTimer = setTimeout(() => setMood("idle"), 420);
      return;
    }

    state.justWrong = false;
    state.pos += 1;
    state.ime = false;
    clearTimeout(wrongTimer);
    if (state.pos >= step.keys.length) {
      if (state.step >= lesson.steps.length - 1) {
        finishLesson();
        return;
      }
      playOk();
      state.phase = "between";
      updatePlay();
      pulseKey(ch, "is-down");
      setMood("happy");
      stepTimer = setTimeout(() => {
        state.step += 1;
        state.pos = 0;
        state.phase = "typing";
        updatePlay();
        setMood("idle");
      }, 560);
      return;
    }
    updatePlay();
    pulseKey(ch, "is-down");
    playOk();
    setMood("happy");
    clearTimeout(moodTimer);
    moodTimer = setTimeout(() => setMood("idle"), 420);
  }

  function backspace() {
    if (state.view !== "play" || state.phase !== "typing" || state.pos <= 0) return;
    state.pos -= 1;
    state.justWrong = false;
    updatePlay();
  }

  function onClick(event) {
    const el = event.target.closest("[data-act]");
    if (!el || !app.contains(el)) return;
    const act = el.dataset.act;
    if (act === "key") {
      onChar(el.dataset.key);
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      return;
    }
    if (act === "home") {
      state.view = "home";
      render();
      return;
    }
    if (act === "track") {
      state.view = "track";
      state.track = el.dataset.track;
      render();
      return;
    }
    if (act === "lesson") {
      openLesson(el.dataset.id);
      return;
    }
    if (act === "back") {
      const lesson = current();
      state.view = "track";
      state.track = lesson ? lesson.track : state.track;
      render();
      return;
    }
    if (act === "start" || act === "retry") {
      startLesson();
      return;
    }
    if (act === "next") {
      const upcoming = nextLesson(state.lessonId);
      if (!upcoming) {
        state.view = "track";
        render();
      } else {
        openLesson(upcoming.id);
      }
      return;
    }
    if (act === "sound") {
      progress.sound = !progress.sound;
      save();
      updateBanners();
      if (progress.sound) playOk();
      return;
    }
    if (act === "clear") {
      if (window.confirm("要清除全部星星和练习记录吗？")) {
        progress = { sound: progress.sound, lessons: {} };
        save();
        render();
      }
    }
  }

  function openLesson(id) {
    const lesson = lessonById(id);
    if (!lesson) return;
    state.view = "play";
    state.lessonId = id;
    state.track = lesson.track;
    state.phase = "intro";
    state.step = 0;
    state.pos = 0;
    state.wrong = 0;
    state.justWrong = false;
    state.result = null;
    state.ime = false;
    render();
  }

  function onKeyDown(event) {
    if (event.key === "CapsLock" || event.getModifierState) syncCaps(event);
    if (state.view !== "play") return;
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.repeat) return;
    const active = document.activeElement;
    const onVisibleButton = active && active.tagName === "BUTTON" && !active.closest("[hidden]");
    if (onVisibleButton && (event.key === "Enter" || event.key === " ")) return;

    if (state.phase === "intro" && event.key === "Enter") {
      event.preventDefault();
      startLesson();
      return;
    }
    if (state.phase === "done" && event.key === "Enter") {
      event.preventDefault();
      const upcoming = nextLesson(state.lessonId);
      if (upcoming) openLesson(upcoming.id);
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      const lesson = current();
      state.view = "track";
      state.track = lesson.track;
      render();
      return;
    }
    if (event.key === "Backspace") {
      event.preventDefault();
      backspace();
      return;
    }
    if (event.isComposing || event.key === "Process" || event.keyCode === 229) {
      state.ime = true;
      updateBanners();
      return;
    }
    if (event.key.length !== 1) return;
    event.preventDefault();
    if (!/^[a-zA-Z ;,./]$/.test(event.key)) {
      state.ime = true;
      updateBanners();
      return;
    }
    state.ime = false;
    onChar(event.key.toLowerCase());
  }

  function syncCaps(event) {
    if (!event.getModifierState) return;
    const next = event.getModifierState("CapsLock");
    if (next === state.caps) return;
    state.caps = next;
    updateBanners();
  }

  function onComposition() {
    if (state.view !== "play") return;
    state.ime = true;
    updateBanners();
  }

  app.addEventListener("mousedown", (event) => {
    if (event.target.closest(".key")) event.preventDefault();
  });
  app.addEventListener("click", onClick);
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", syncCaps);
  window.addEventListener("compositionstart", onComposition);
  render();
})();
