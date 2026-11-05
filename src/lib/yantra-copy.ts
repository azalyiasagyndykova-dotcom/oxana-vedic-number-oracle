import type { YantraCatalog } from "./yantra-report-types";
import { YANTRA_CHARACTER } from "./yantra-character";
import { YANTRA_HAPPINESS, YANTRA_TASKS } from "./yantra-growth";
import { YANTRA_WORLD } from "./yantra-world";
import { YANTRA_TALENTS } from "./yantra-talents";
import start from "./yantra-start-copy.json";
import life from "./yantra-life-copy.json";
import sample from "./yantra-sample-copy.json";

// Sourced and restyled meanings from SANA. Код Янтры; page references use PDF pagination.
const book: YantraCatalog = {
  ...start, ...life, character: YANTRA_CHARACTER, karma: YANTRA_WORLD,
  happiness: YANTRA_HAPPINESS, tasks: YANTRA_TASKS, siddhi: YANTRA_TALENTS,
};

// Merge only the supplied metric/value pairs; other source-backed values remain intact.
export const YANTRA_COPY: YantraCatalog = { ...book };
for (const key of Object.keys(sample) as (keyof YantraCatalog)[]) {
  const additions = (sample as YantraCatalog)[key];
  YANTRA_COPY[key] = { ...book[key], ...additions };
}