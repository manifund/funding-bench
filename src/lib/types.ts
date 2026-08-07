// Types for the benchmark dataset (data/*.json) and eval outputs.

export type Cohort = "named" | "funded" | "random";

/** data/proposals.json — the model-visible side of the benchmark. */
export interface Proposal {
  slug: string;
  cohort: Cohort;
  title: string;
  blurb: string;
  /** Full proposal text, markdown. */
  description: string;
  creator_name: string;
  creator_username: string;
  /** ISO date the proposal was posted on Manifund. */
  proposal_date: string;
  /** Max ask in USD. */
  funding_goal: number;
  /** Min funding to proceed, USD. */
  min_funding: number;
  causes: string[];
  url: string;
}

export type Confidence = "high" | "medium" | "low";

export interface ExternalFundingEntry {
  funder: string;
  amount_usd: number;
  /** Calendar year the money was granted. */
  year: number;
  /** ISO date or year-month when known; may be empty. */
  date?: string;
  source_url: string;
  confidence: Confidence;
  note?: string;
}

/** data/ground-truth.json — never shown to models; keyed by project slug. */
export interface GroundTruth {
  /** Calendar year -> USD donated on Manifund. */
  manifund_raised_by_year: Record<string, number>;
  manifund_total_raised: number;
  /** Manifund project stage at fetch time (proposal/active/complete/not funded). */
  stage: string;
  external_funding: ExternalFundingEntry[];
  /** Which entity the numbers track (org vs project) + research caveats. */
  notes: string;
  /** What happened to the project/org after the proposal (from research). */
  research_summary?: string;
  fetched_at: string;
}

export type GroundTruthMap = Record<string, GroundTruth>;

/** data/funders.json — one rubric per funder persona used in evals. */
export interface FunderRubric {
  slug: string;
  name: string;
  /** 2-4 paragraphs, markdown. */
  thesis: string;
  grantmakers: { name: string; bio: string }[];
  typical_check_size: string;
  total_yearly_spend: string;
  grants_per_year: string;
  process_notes?: string;
  sources: string[];
  as_of: string;
}

/** The JSON block each model must emit at the end of its eval response. */
export interface EvalOutput {
  /** USD this funder should grant right now (0 = don't fund). */
  grant_rec_usd: number;
  /** Predicted total USD raised per calendar year, proposal year through 2028. */
  raise_by_year_usd: Record<string, number>;
}

/** One eval row in InstantDB (see src/instant.schema.ts). */
export interface EvalCell extends Partial<EvalOutput> {
  cellKey: string;
  promptVersion: string;
  model: string;
  funderSlug: string;
  projectSlug: string;
  grantRecUsd?: number;
  raiseByYearUsd?: Record<string, number>;
  reasoning?: string;
  error?: string;
  latencyMs?: number;
  costUsd?: number;
  createdAt: number;
}
