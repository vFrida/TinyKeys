# TinyKeys · 小小打字家

[中文](#中文) · [English](#english)

---

## 中文

给小朋友的英语 / 拼音打字练习。看发亮的键、用对的手指，慢慢打准。

纯静态页面，零依赖、零构建，双击 `index.html` 即可打开。

### 功能

- **两条学习线**：英语（基准键 → 单词 → 短句）、拼音（单韵母 → 声母 → 翘舌平舌 → 日常用语），共 17 节课。
- **手指提示**：每节课点亮目标键，并标注应由哪只手、哪根手指按（小指 / 无名指 / 中指 / 食指 / 拇指）。
- **逐键引导**：当前字符高亮，打对即前进；打错不罚，提示重来。支持退格修正。
- **实时反馈**：正确 / 错误 / 通关音效（Web Audio 合成，无音频文件），可选关闭。
- **进度保存**：星星评级与完成状态存在 `localStorage`，下次打开自动续上。
- **环境适配**：检测 CapsLock 与输入法状态并提示；`Esc` 返回、`Enter` 开始 / 下一课；尊重 `prefers-reduced-motion`。

### 使用

```bash
# 直接打开
open index.html

# 或起一个本地静态服务
python3 -m http.server 8000
```

### 目录结构

```
index.html        页面骨架，挂载 #app
css/style.css     全部样式（含深色安全配色、键盘布局、动画降级）
js/lessons.js     课程数据：window.TYPING_LESSONS（en / py 两条 track）
js/app.js         渲染、键盘交互、音效、进度存储
```

### 新增课程

在 `js/lessons.js` 的 `LESSONS` 数组里追加一项即可，无需改动其他代码：

```js
{
  id: "en-new",
  track: "en",            // en 或 py
  title: "课程标题",
  blurb: "一句话说明",
  spotlight: ["f", "j"],  // 需要点亮的键
  intro: "开课前的提示语",
  steps: [
    S("fff jjj", "这一步的小提示"),
    S("fj fj", "再来一次")
  ]
}
```

只使用了字母、空格和 `; , . /` 这些键，避免小朋友在练习中被迫切换输入法。

### 说明

- 键盘上印的是大写字母，练习一律输出小写，不需要按 Shift。
- 拼音课输入的是字母串（如 `ma`），不要求打出声调符号。

---

## English

A typing tutor for kids, covering English letters and Chinese Pinyin. Watch the glowing key, use the right finger, and type it slowly and accurately.

Plain static pages — no dependencies, no build step. Just open `index.html`.

### Features

- **Two learning tracks**: English (home row → words → short sentences) and Pinyin (simple finals → initials → retroflex/alveolar pairs → everyday phrases), 17 lessons in total.
- **Finger guidance**: each lesson highlights the target keys and names the hand and finger to use (pinky / ring / middle / index / thumb).
- **Key-by-key coaching**: the current character is highlighted and advances as you type it correctly. Mistakes are not punished, just retried; Backspace fixes a slip.
- **Instant feedback**: synthesized sounds for correct / wrong / lesson-complete (Web Audio, no audio files), and can be muted.
- **Progress saved**: star ratings and completion live in `localStorage`, resuming automatically next time.
- **Environment aware**: detects CapsLock and IME state and warns; `Esc` goes back, `Enter` starts or moves to the next lesson; respects `prefers-reduced-motion`.

### Usage

```bash
# open directly
open index.html

# or serve it locally
python3 -m http.server 8000
```

### Layout

```
index.html        page shell, mounts #app
css/style.css     all styles (palette, keyboard layout, motion fallback)
js/lessons.js     lesson data: window.TYPING_LESSONS (tracks en / py)
js/app.js         rendering, keyboard handling, sound, progress storage
```

### Adding a lesson

Append an entry to `LESSONS` in `js/lessons.js` — nothing else needs to change:

```js
{
  id: "en-new",
  track: "en",            // en or py
  title: "Lesson title",
  blurb: "One-line summary",
  spotlight: ["f", "j"],  // keys to highlight
  intro: "Shown before the lesson starts",
  steps: [
    S("fff jjj", "A hint for this step"),
    S("fj fj", "Once more")
  ]
}
```

Only letters, space, and `; , . /` are used, so kids never have to switch input methods mid-practice.

### Notes

- The physical keyboard shows uppercase, but practice always outputs lowercase — no Shift needed.
- Pinyin lessons type letter strings (e.g. `ma`) without tone marks.
