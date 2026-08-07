// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

// Eval results are public to read; only the admin SDK (scripts/eval.ts) writes.
const rules = {
  runs: {
    allow: {
      view: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
  evals: {
    allow: {
      view: "true",
      create: "false",
      update: "false",
      delete: "false",
    },
  },
} satisfies InstantRules;

export default rules;
