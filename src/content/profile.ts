import { contacts } from "./contacts";

const hero: readonly { text: string; emphasis?: boolean }[] = [
  { text: "I turn real problems into " },
  { text: "working software.", emphasis: true },
];

export const profile = {
  name: "Stanislav Romanovich",
  roles: "AI-assisted Developer · Product Builder",
  valueProposition:
    "Python automation, AI-assisted product development and React/TypeScript — applied to real workflows, not abstract demos.",
  hero,
  message: hero.map((part) => part.text).join(""),
  concept: "From tables to transformers.",
  evolution:
    "One portfolio data model, interpreted as five independent websites with the structure and interaction patterns of their eras.",
  github: contacts[0].url,
  introduction:
    "My path connects early web experiments, medicine and radiology, and a return to technology. Today, I build software with AI, grounded in real problems.",
};
