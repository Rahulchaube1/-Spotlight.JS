# Spotlight.js

<p align="center">
  <img src="Spotlightjs.png" alt="Spotlight.js Logo" width="240" style="border-radius: 20px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);" />
</p>

<p align="center">
  <b>The modern, zero-dependency JavaScript engine for interactive product tours, multi-element spotlights, tour persistence, sound feedback, confetti celebrations, and onboarding checklists.</b>
</p>

<p align="center">
  <a href="https://github.com/Rahulchaube1/-Spotlight.JS/stargazers"><img src="https://img.shields.io/github/stars/Rahulchaube1/-Spotlight.JS?style=social" alt="GitHub stars" /></a>
  <a href="https://github.com/Rahulchaube1/-Spotlight.JS/network/members"><img src="https://img.shields.io/github/forks/Rahulchaube1/-Spotlight.JS?style=social" alt="GitHub forks" /></a>
  <a href="https://spotlightjs.rahulchaube1.com"><img src="https://img.shields.io/badge/Documentation-spotlightjs.rahulchaube1.com-0284c7?style=flat-square" alt="Documentation" /></a>
  <a href="https://github.com/Rahulchaube1/-Spotlight.JS/blob/main/license"><img src="https://img.shields.io/badge/License-MIT-emerald?style=flat-square" alt="License: MIT" /></a>
  <a href="https://buymeacoffee.com/rahulchaube"><img src="https://img.shields.io/badge/Sponsor-Buy%20Me%20a%20Coffee-f59e0b?style=flat-square" alt="Sponsor" /></a>
</p>

---

## Why Spotlight.js?

Most onboarding and tour libraries today suffer from critical drawbacks:
- Massive bundle sizes with bloated external dependencies
- Broken navigation across single-page applications (SPAs)
- No built-in way to resume tours across page refreshes or route changes
- Complex, inflexible configuration APIs
- Rigid, uninspired UI popovers that clash with modern design systems

**Spotlight.js solves all of this in a single, ultra-lightweight package under 5kB.** It delivers silky-smooth SVG cutouts, native multi-element spotlighting, automatic local storage tour persistence, zero-dependency Web Audio synthesizers, and onboarding checklists that blend seamlessly with Tailwind CSS and CSS variables.

---

## Highlights

- **Zero Dependencies**: Pure vanilla TypeScript with zero external runtime overhead.
- **Tour Persistence & Auto-Resume**: Automatically save tour progress to `localStorage` or `sessionStorage` so users can refresh or navigate without losing their place.
- **Interactive Action Gating**: Advance steps only when the user triggers an event (click, input, submit) via `advanceOn`.
- **Multi-Element Spotlighting**: Spotlight multiple DOM elements simultaneously under a single, unified cutout mask.
- **Synthesized Audio Feedback**: Subtle, zero-dependency Web Audio chimes, clicks, and completion fanfare.
- **Confetti Celebrations**: Built-in canvas particle physics engine to celebrate completed tours.
- **Visual Tour Builder**: Point-and-click tour authoring mode that generates clean TypeScript code in the browser.
- **Onboarding Checklists**: Launch interactive checklist widgets that sync with tour progress.
- **Pulsing Feature Hints**: Non-intrusive beacon markers that open contextual popovers on demand.
- **Universal Framework Support**: Plug-and-play with Vanilla JS, React, Next.js, Vue, Nuxt, Svelte, Angular, Solid, and Astro.

---

## Installation

Install using your preferred package manager:

```bash
# npm
npm install spotlight.js

# pnpm
pnpm add spotlight.js

# yarn
yarn add spotlight.js

# bun
bun add spotlight.js
```

Or load directly via CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/spotlight.js@latest/dist/spotlight.css" />
<script src="https://cdn.jsdelivr.net/npm/spotlight.js@latest/dist/spotlight.js.iife.js"></script>
```

---

## Quick Start

### Basic Product Tour

```typescript
import { spotlight } from "spotlight.js";
import "spotlight.js/dist/spotlight.css";

const tour = spotlight({
  showProgress: true,
  animate: true,
  steps: [
    {
      element: "#welcome-card",
      popover: {
        title: "Welcome to our Dashboard",
        description: "Let's take a quick 30-second tour of your workspace.",
        side: "bottom",
        align: "start"
      }
    },
    {
      element: "#search-bar",
      popover: {
        title: "Universal Command Center",
        description: "Press Cmd+K anywhere to search projects, files, and members.",
        side: "bottom"
      }
    },
    {
      element: "#create-project-btn",
      popover: {
        title: "Create Your First Project",
        description: "Click here to initialize a new repository or workspace.",
        side: "left"
      }
    }
  ]
});

// Start the tour
tour.drive();
```

---

## Tour Persistence & Auto-Resume

Never let a page reload or router transition disrupt a user's onboarding:

```typescript
const tour = spotlight({
  storageKey: "onboarding_v1",
  persist: "localStorage",
  autoResume: true,
  steps: [
    { element: "#step-1", popover: { title: "Step 1", description: "First step." } },
    { element: "#step-2", popover: { title: "Step 2", description: "Second step." } },
    { element: "#step-3", popover: { title: "Step 3", description: "Final step." } }
  ]
});

// Resumes automatically from the last uncompleted step!
tour.drive();

// Helper methods:
console.log(tour.isCompleted()); // true if user finished the tour
tour.reset();                   // clears stored progress
tour.resume();                  // manually resumes from stored position
```

---

## Interactive Action Gating (`advanceOn`)

Require the user to click a specific button or trigger an event before advancing:

```typescript
const tour = spotlight({
  steps: [
    {
      element: "#signup-input",
      advanceOn: "input", // advances as soon as the user types
      popover: {
        title: "Enter your username",
        description: "Type your desired username to continue."
      }
    },
    {
      element: "#submit-btn",
      advanceOn: { event: "click", selector: "#submit-btn" },
      popover: {
        title: "Submit Registration",
        description: "Click this button to save and finish."
      }
    }
  ]
});

tour.drive();
```

---

## Multi-Element Spotlighting

Highlight several elements together under a unified overlay mask:

```typescript
const tour = spotlight();

tour.highlight({
  elements: ["#sidebar-navigation", "#main-content-panel"],
  popover: {
    title: "Dual Layout View",
    description: "Notice how your navigation panel correlates directly with your main content.",
    side: "top"
  }
});
```

---

## Sound Feedback & Celebration Confetti

Engage users with built-in zero-dependency Web Audio sound effects and confetti celebrations:

```typescript
const tour = spotlight({
  sound: true,    // Synthesizes pleasant harmonic chimes and clicks
  confetti: true, // Launches celebratory physics-based confetti on completion
  steps: [
    { element: "#feature-a", popover: { title: "Feature One" } },
    { element: "#feature-b", popover: { title: "Feature Two" } }
  ]
});

tour.drive();
```

---

## Framework Integration Examples

### React / Next.js

```tsx
import { useEffect } from "react";
import { spotlight } from "spotlight.js";
import "spotlight.js/dist/spotlight.css";

export function ProductTour() {
  useEffect(() => {
    const tour = spotlight({
      storageKey: "nextjs_dashboard_tour",
      autoResume: true,
      steps: [
        { element: "#dashboard-stats", popover: { title: "Key Metrics", description: "Real-time analytics." } },
        { element: "#settings-menu", popover: { title: "Preferences", description: "Manage your profile." } }
      ]
    });

    tour.drive();
  }, []);

  return null;
}
```

### Vue 3 / Nuxt

```vue
<script setup>
import { onMounted } from "vue";
import { spotlight } from "spotlight.js";
import "spotlight.js/dist/spotlight.css";

onMounted(() => {
  const tour = spotlight({
    steps: [
      { element: "#vue-hero", popover: { title: "Vue Dashboard", description: "Welcome to the application." } }
    ]
  });
  tour.drive();
});
</script>
```

---

## Interactive Visual Tour Builder

Spotlight.js includes a point-and-click visual tour builder for developers and product designers:

```typescript
const tour = spotlight();

// Launch interactive recording mode
tour.startTourBuilder();
```

Click any element on your page, configure title and description in the live floating HUD, and export clean, production-ready TypeScript code with one click.

---

## Author & Community

Crafted and maintained with care by **Rahul Chaube**:

- **Portfolio**: [rahulchaube1.com](https://rahulchaube1.com)
- **GitHub**: [@Rahulchaube1](https://github.com/Rahulchaube1)
- **LinkedIn**: [linkedin.com/in/rahulchaube1](https://www.linkedin.com/in/rahulchaube1/)
- **Sponsor / Buy Me a Coffee**: [buymeacoffee.com/rahulchaube](https://buymeacoffee.com/rahulchaube)
- **Documentation**: [spotlightjs.rahulchaube1.com](https://spotlightjs.rahulchaube1.com)

---

## Contributing

We welcome issues, feature requests, and pull requests! Please feel free to open an issue on the [GitHub repository](https://github.com/Rahulchaube1/-Spotlight.JS).

---

## License

MIT Licensed &copy; 2026 [Rahul Chaube](https://rahulchaube1.com). Free and open-source for personal and commercial projects.
