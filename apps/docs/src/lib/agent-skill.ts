import { createHash } from "node:crypto";
import { getAgentGuides, SITE_URL } from "./agent-markdown";

export const SKILL_NAME = "spotlight-js";
export const SKILL_PATH = `/.well-known/agent-skills/${SKILL_NAME}/SKILL.md`;
export const SKILL_DESCRIPTION =
  "Add product tours, element spotlights, feature hints and onboarding checklists to a web app with Spotlight.js.";

export async function getSkillMarkdown() {
  const guides = await getAgentGuides();
  const pages = guides
    .filter(({ guide }) => !guide.data.hidden && guide.id !== "changelog")
    .map(({ guide }) => {
      const { title, description } = guide.data;
      return `- [${title}](${SITE_URL}/docs/${guide.id}.md)${description ? `: ${description}` : ""}`;
    });

  return `---
name: ${SKILL_NAME}
description: ${SKILL_DESCRIPTION} Use when the user wants an onboarding tour, a guided walkthrough, a spotlight on an element, pulsing hint beacons or a getting-started checklist.
---

# Spotlight.js

Spotlight.js is a lightweight, zero-dependency JavaScript library. It works with any framework.

## Install

\`\`\`bash
npm install spotlight.js
\`\`\`

Each feature is its own entry with its own stylesheet:

- Tours and highlights: \`import { spotlight } from "spotlight.js"\` and \`import "spotlight.js/dist/spotlight.css"\`
- Hints: \`import { hints } from "spotlight.js/hints"\` and \`import "spotlight.js/dist/hints.css"\`
- Checklists: \`import { checklist } from "spotlight.js/checklist"\` with \`import "spotlight.js/dist/spotlight.css"\` and \`import "spotlight.js/dist/checklist.css"\`

## Tour

\`\`\`js
import { spotlight } from "spotlight.js";
import "spotlight.js/dist/spotlight.css";

const tour = spotlight({
  showProgress: true,
  steps: [
    { element: "#new-project", popover: { title: "New project", description: "Start here." } },
    { element: "#settings", popover: { title: "Settings", description: "Configure your workspace." } },
  ],
});

tour.drive();
\`\`\`

## Highlight one element

\`\`\`js
const tour = spotlight();
tour.highlight({ element: "#search", popover: { title: "Search", description: "Find anything." } });
\`\`\`

## Workflow

1. Read the page for the feature you need from the list below before writing code. Every page is Markdown.
2. Use the exact option names from the [configuration](${SITE_URL}/docs/configuration.md) and [API](${SITE_URL}/docs/api.md) pages.
3. Import the stylesheet for each entry you use.

## Docs

${pages.join("\n")}

The whole documentation in one file: ${SITE_URL}/llms-full.txt
`;
}

export function sha256(text: string) {
  return `sha256:${createHash("sha256").update(text).digest("hex")}`;
}
