import type { APIRoute } from "astro";
import { getAgentGuides, SITE_URL } from "../lib/agent-markdown";

const SUMMARY = `# Spotlight.js

> Lightweight, dependency-free JavaScript library for product tours, element highlights, feature hints and onboarding checklists. Works with any framework.

Install with \`npm install spotlight.js\`. Each feature is its own entry with its own stylesheet:

- Tours and highlights: \`import { spotlight } from "spotlight.js"\` and \`import "spotlight.js/dist/spotlight.css"\`
- Hints: \`import { hints } from "spotlight.js/hints"\` and \`import "spotlight.js/dist/hints.css"\`
- Checklists: \`import { checklist } from "spotlight.js/checklist"\` with \`import "spotlight.js/dist/spotlight.css"\` and \`import "spotlight.js/dist/checklist.css"\`

Every page below is Markdown. Drop the \`.md\` suffix for the HTML version.`;

const OPTIONAL_IDS = new Set(["changelog"]);

export const GET: APIRoute = async () => {
  const guides = await getAgentGuides();
  const groups = new Map<string, string[]>();
  const optional = [`- [Full documentation in one file](${SITE_URL}/llms-full.txt)`];

  guides.forEach(({ guide }) => {
    const { title, description, groupTitle, hidden } = guide.data;
    const line = `- [${title}](${SITE_URL}/docs/${guide.id}.md)${description ? `: ${description}` : ""}`;

    if (hidden || OPTIONAL_IDS.has(guide.id)) {
      optional.push(line);
      return;
    }

    groups.set(groupTitle, [...(groups.get(groupTitle) ?? []), line]);
  });

  const sections = [...groups].map(([groupTitle, lines]) => `## ${groupTitle}\n\n${lines.join("\n")}`);
  const body = [SUMMARY, ...sections, `## Optional\n\n${optional.join("\n")}`].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
