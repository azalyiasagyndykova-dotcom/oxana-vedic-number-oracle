import type { YantraCatalog, YantraMeaning } from "./yantra-report-types";
import { YANTRA_CHARACTER } from "./yantra-character";
import { YANTRA_HAPPINESS, YANTRA_TASKS } from "./yantra-growth";
import { YANTRA_WORLD } from "./yantra-world";
import { YANTRA_TALENTS } from "./yantra-talents";
import start from "./yantra-start-copy.json";
import life from "./yantra-life-copy.json";
import sample from "./yantra-sample-copy.json";
import { YANTRA_PROBLEM } from "./yantra-problem-copy";
import deepApproach from "./yantra-deep/approach.json";

// Sourced and restyled meanings; page references use PDF pagination.
const book: YantraCatalog = {
  ...start, ...life, character: YANTRA_CHARACTER, karma: YANTRA_WORLD,
  happiness: YANTRA_HAPPINESS, tasks: YANTRA_TASKS, siddhi: YANTRA_TALENTS,
};

// Expanded plain-language rewrites add blocks over the same source-backed values.
const deep = { ...deepApproach } as Partial<Record<keyof YantraCatalog, Record<string, { blocks: NonNullable<YantraMeaning["blocks"]> }>>>;
for (const key of Object.keys(deep) as (keyof YantraCatalog)[]) {
  const base = { ...book[key] };
  for (const [value, entry] of Object.entries(deep[key] ?? {})) {
    const n = Number(value);
    if (base[n]) base[n] = { ...base[n], blocks: entry.blocks };
  }
  book[key] = base;
}

// Merge only the supplied metric/value pairs; other source-backed values remain intact.
export const YANTRA_COPY: YantraCatalog = { ...book, ...YANTRA_PROBLEM };
for (const key of Object.keys(sample) as (keyof YantraCatalog)[]) {
  const additions = (sample as YantraCatalog)[key];
  YANTRA_COPY[key] = { ...book[key], ...additions };
}
