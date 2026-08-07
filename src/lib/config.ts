// Current benchmark prompt version. Bump whenever prompts, proposal text, or
// rubrics change; eval cells are keyed by it and the results page shows only
// the current version.
// v1: initial run (contaminated: 5 proposal descriptions + LTFF rubric leaked outcomes)
// v2: cleaned descriptions (as-of-proposal-date), leak-free LTFF rubric, corrected ground truth
export const PROMPT_VERSION = "v2";
