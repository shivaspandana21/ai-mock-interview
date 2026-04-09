# 🚀 Live Project Links
- **Frontend (UI):** [https://shivaspandana21.github.io/Ai-Mock-Interview/](https://shivaspandana21.github.io/Ai-Mock-Interview/)
- **Backend (API):** [https://ai-mock-interview-1bty.onrender.com/api/test](https://ai-mock-interview-1bty.onrender.com/api/test)

# 🎯 InterviewIQ — AI Interview Platform

A fully-featured, modern AI-powered interview preparation platform built with
**pure HTML, CSS, and JavaScript** — no frameworks, no build tools, no server required.

---

## 📁 Project Structure

```
interviewiq/
├── index.html              ← Main entry point (open this in browser)
│
├── css/
│   ├── variables.css       ← Design tokens (colors, spacing, radii)
│   ├── base.css            ← Reset, typography, layout grid
│   ├── auth.css            ← Login / Signup screen
│   ├── sidebar.css         ← Left navigation sidebar
│   ├── components.css      ← Reusable UI: cards, buttons, badges, forms
│   ├── pages.css           ← Page-specific styles (stream, company, video…)
│   ├── interview.css       ← Active interview overlay
│   └── animations.css      ← Keyframes & transitions
│
└── js/
    ├── db.js               ← LocalStorage database layer
    ├── auth.js             ← JWT auth (login, signup, logout)
    ├── data.js             ← Question bank, streams, companies, AI feedback
    ├── ui.js               ← Toast, modal, navigation helpers
    ├── dashboard.js        ← Dashboard stats, charts, milestones
    ├── resume.js           ← Resume upload, scoring, question generation
    ├── interview.js        ← Interview engine, voice input, question bank
    ├── video.js            ← Video recording, speech & communication analysis
    ├── reports.js          ← Smart feedback report, recordings page
    ├── analytics.js        ← Comparison, predictor, improvement graph, radar
    └── app.js              ← Entry point & initialization
```

---

## 🚀 How to Run

### Option 1 — Live Server (Recommended for VS Code)
1. Install the **Live Server** extension in VS Code (by Ritwick Dey)
2. Right-click `index.html` → **"Open with Live Server"**
3. App opens at `http://127.0.0.1:5500`

### Option 2 — Direct Browser
1. Double-click `index.html` in File Explorer
2. It opens directly — no setup needed

### Option 3 — VS Code Terminal
```bash
# If you have Python installed:
python -m http.server 5500
# Then open http://localhost:5500
```

---

## 🔐 Demo Login
```
Email:    demo@interviewiq.ai
Password: demo1234
```
Or create your own account via **Sign Up**.

---

## ✨ Features

| Feature | Description |
|---|---|
| JWT Auth | Simulated JWT login/signup with localStorage |
| Resume Analysis | Upload resume → AI score (0–100) + question generation |
| Stream Mock Interview | 9 streams, 10+ questions each |
| Company Mock Interview | Google, Amazon, Microsoft, Meta, Apple, TCS, Infosys, Wipro, Deloitte |
| 60+ Question Bank | Filter by stream, difficulty, type |
| AI Answer Evaluation | Simulated AI scoring with typed feedback animation |
| Voice Input | Web Speech API for hands-free answering |
| Video Interview | Camera recording with MediaRecorder API |
| Communication Analysis | Eye contact, pace, expression, posture feedback |
| Speech Confidence | Confidence, clarity, pace, vocabulary bars |
| Vocabulary Feedback | Common filler word suggestions |
| Smart Feedback Report | Strengths, weak areas, improvement suggestions |
| Company Score Comparison | Table + SVG bar chart |
| Selection Predictor | AI probability donut chart |
| Improvement Graph | SVG line chart of score progression |
| Weak Area Radar Chart | SVG radar/spider chart |
| Record & Replay | Save and replay video recordings |
| Auto Question Generator | Topic-based, configurable count & difficulty |
| Milestones | Achievement badges for interview count |

---

## 🗄️ Database

All data is stored in **localStorage** under the `iiq_` prefix:

| Key | Contents |
|---|---|
| `iiq_users` | Array of registered users |
| `iiq_token` | Current JWT token |
| `iiq_currentUser` | Logged-in user object |
| `iiq_interviews` | Array of completed interview records |
| `iiq_recordings` | Array of video recording blobs |

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#6c63ff` (purple) |
| Secondary | `#4fd1c5` (teal) |
| Warning | `#f6ad55` (orange) |
| Danger | `#fc8181` (red) |
| Success | `#68d391` (green) |
| Background | `#07080f` |
| Card | `#161929` |
| Font (Display) | Syne |
| Font (Body) | DM Sans |

---

## 📝 Notes

- Video recording requires **Chrome/Edge** (MediaRecorder API)
- Voice input requires **Chrome** (Web Speech API)
- No internet connection needed after fonts load (Google Fonts CDN)
- To persist data between sessions, data is automatically saved to localStorage
