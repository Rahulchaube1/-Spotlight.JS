# 🌟 Spotlight.js

<p align="center">
  <b>The modern, zero-dependency JavaScript engine for delightful product tours, multi-element spotlights, sound feedback, confetti celebrations, and onboarding checklists.</b>
</p>

<p align="center">
  <a href="https://github.com/Rahulchaube1/-Spotlight.JS/blob/main/license"><img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square" alt="License: MIT" /></a>
  <a href="https://Spotlightjs.rahulchaube1.com"><img src="https://img.shields.io/badge/Docs-Spotlightjs.rahulchaube1.com-blue.svg?style=flat-square" alt="Website" /></a>
  <a href="https://github.com/Rahulchaube1/-Spotlight.JS"><img src="https://img.shields.io/badge/GitHub-Rahulchaube1%2F--Spotlight.JS-black.svg?style=flat-square" alt="GitHub" /></a>
  <a href="https://buymeacoffee.com/rahulchaube"><img src="https://img.shields.io/badge/Sponsor-Buy%20Me%20a%20Coffee-ffdd00.svg?style=flat-square" alt="Sponsor" /></a>
</p>

---

## 🚀 Key Features

- **Zero Dependencies**: Lightweight vanilla TypeScript with no third-party runtime weight.
- **Multi-Element Spotlighting**: Highlight compound elements simultaneously.
- **Web Audio Sound Effects**: Zero-dependency audio chime synthesizer.
- **Confetti Engine**: Native canvas particle physics celebration engine.
- **Live Visual Tour Builder**: In-browser point-and-click step authoring.
- **Funnel Telemetry**: Track views, dwell time, skip rate, and tour exits.
- **Keyboard Cheatsheet Modal**: Glassmorphic shortcut HUD (`?` key).
- **Themes**: Default, Dark, Cyberpunk Neon, and Frosted Glass presets.

---

## 📦 Installation

```bash
npm install spotlight.js
```

---

## ⚡ Usage

```typescript
import { spotlight } from "spotlight.js";
import "spotlight.js/dist/spotlight.css";

const tour = spotlight({
  animate: true,
  sound: true,
  confetti: true,
  steps: [
    { element: "#header", popover: { title: "Header", description: "Your main dashboard header." } }
  ]
});

tour.drive();
```

---

## 👨‍💻 Author & Sponsor

- **Author**: Rahul Chaube ([https://rahulchaube1.com](https://rahulchaube1.com))
- **LinkedIn**: [https://www.linkedin.com/in/rahulchaube1/](https://www.linkedin.com/in/rahulchaube1/)
- **GitHub**: [https://github.com/Rahulchaube1](https://github.com/Rahulchaube1)
- **Repo**: [https://github.com/Rahulchaube1/-Spotlight.JS](https://github.com/Rahulchaube1/-Spotlight.JS)
- **Sponsor**: [https://buymeacoffee.com/rahulchaube](https://buymeacoffee.com/rahulchaube)

---

## 📄 License

MIT &copy; 2026 Rahul Chaube. 100% Free and Open Source.
