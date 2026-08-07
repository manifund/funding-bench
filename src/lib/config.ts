// Current benchmark prompt version. Bump whenever prompts, proposal text, or
// rubrics change; eval cells are keyed by it and the results page shows only
// the current version.
// v1: initial run (contaminated: 5 proposal descriptions + LTFF rubric leaked outcomes)
// v2: cleaned descriptions (as-of-proposal-date), leak-free LTFF rubric, corrected ground truth
export const PROMPT_VERSION = "v2";

/** Release dates from OpenRouter's model listing (`created`), which match
 * the models' public release dates. Used for the score-over-time chart. */
export const MODEL_META: { id: string; label: string; released: string }[] = [
  { id: "anthropic/claude-3-haiku", label: "Claude 3 Haiku", released: "2024-03-12" },
  { id: "openai/gpt-4o", label: "GPT-4o", released: "2024-05-12" },
  { id: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5", released: "2025-09-29" },
  { id: "openai/gpt-5.6-terra", label: "GPT-5.6 Terra", released: "2026-07-09" },
  { id: "anthropic/claude-opus-5", label: "Claude Opus 5", released: "2026-07-24" },
];
