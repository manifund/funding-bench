// Typed access to the committed dataset. Server-side only (fs).

import { readFileSync } from "fs";
import { join } from "path";
import type { FunderRubric, GroundTruthMap, Proposal } from "./types";

const DATA_DIR = join(process.cwd(), "data");

function readJson<T>(file: string): T {
  return JSON.parse(readFileSync(join(DATA_DIR, file), "utf8")) as T;
}

export function getProposals(): Proposal[] {
  return readJson<Proposal[]>("proposals.json");
}

export function getProposal(slug: string): Proposal | undefined {
  return getProposals().find((p) => p.slug === slug);
}

export function getGroundTruth(): GroundTruthMap {
  return readJson<GroundTruthMap>("ground-truth.json");
}

export function getFunders(): FunderRubric[] {
  return readJson<FunderRubric[]>("funders.json");
}

export function getFunder(slug: string): FunderRubric | undefined {
  return getFunders().find((f) => f.slug === slug);
}
