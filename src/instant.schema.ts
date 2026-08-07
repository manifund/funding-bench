// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $files: i.entity({
      path: i.string().unique().indexed(),
      url: i.string(),
    }),
    $users: i.entity({
      email: i.string().unique().indexed().optional(),
      imageURL: i.string().optional(),
      type: i.string().optional(),
    }),
    runs: i.entity({
      createdAt: i.number().indexed(),
      promptVersion: i.string(),
      notes: i.string().optional(),
    }),
    evals: i.entity({
      // one row per (promptVersion, model, funderSlug, projectSlug)
      cellKey: i.string().unique().indexed(),
      promptVersion: i.string().indexed(),
      model: i.string().indexed(),
      funderSlug: i.string().indexed(),
      projectSlug: i.string().indexed(),
      grantRecUsd: i.number().optional(),
      // {"2023": 150000, ...} predicted total raised per calendar year
      raiseByYearUsd: i.json().optional(),
      reasoning: i.string().optional(),
      error: i.string().optional(),
      latencyMs: i.number().optional(),
      costUsd: i.number().optional(),
      createdAt: i.number().indexed(),
    }),
  },
  links: {
    $usersLinkedPrimaryUser: {
      forward: {
        on: "$users",
        has: "one",
        label: "linkedPrimaryUser",
        onDelete: "cascade",
      },
      reverse: {
        on: "$users",
        has: "many",
        label: "linkedGuestUsers",
      },
    },
    evalRun: {
      forward: { on: "evals", has: "one", label: "run" },
      reverse: { on: "runs", has: "many", label: "evals" },
    },
  },
  rooms: {},
});

// This helps TypeScript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
