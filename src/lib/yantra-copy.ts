import type { YantraCatalog } from "./yantra-report-types";
import { YANTRA_CHARACTER } from "./yantra-character";
import { YANTRA_HAPPINESS, YANTRA_TASKS } from "./yantra-growth";
import { YANTRA_WORLD } from "./yantra-world";
import { YANTRA_TALENTS } from "./yantra-talents";
import start from "./yantra-start-copy.json";
import life from "./yantra-life-copy.json";

// Sourced and restyled meanings from SANA. Код Янтры; page references use PDF pagination.
export const YANTRA_COPY: YantraCatalog = {
  ...start, ...life, character: YANTRA_CHARACTER, karma: YANTRA_WORLD,
  happiness: YANTRA_HAPPINESS, tasks: YANTRA_TASKS, siddhi: YANTRA_TALENTS,
};