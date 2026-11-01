import type { MindText, PathText, DharmaText, YearText, KeysText, MoneyDigit } from "@/lib/report-types";
import { SOURCE_KEYS, SOURCE_DHARMA } from "./source";
import { SAMPLE_KEYS, SAMPLE_FLAT, SAMPLE_MONEY, SAMPLE_DHARMA } from "./sample";
import { EXTRA_MONEY } from "./money_extra";
import { STYLED_MIND } from "./styled_mind";
import { STYLED_PATH } from "./styled_path";
import { STYLED_YEAR } from "./styled_year";
import { SUCCESS_MATERIALS } from "./success-materials";

// Report copy: restyled texts (meaning based on sample.ts + source.ts).
export const MIND: Record<number, MindText> = STYLED_MIND;
export const PATH: Record<number, PathText> = STYLED_PATH;
export const DHARMA: Record<number, DharmaText> = { ...SOURCE_DHARMA, 9: SAMPLE_DHARMA };
export const YEAR: Record<number, YearText> = STYLED_YEAR;
export const KEYS: Record<number, KeysText> = Object.fromEntries(
  Object.entries({ ...SOURCE_KEYS, 6: SAMPLE_KEYS }).map(([n, value]) => [n, { ...value, ...SUCCESS_MATERIALS[Number(n)] }]),
);
export const FLAT = SAMPLE_FLAT;
export const MONEY: Partial<Record<number, MoneyDigit>> = { ...EXTRA_MONEY, ...SAMPLE_MONEY };
export { REPORT_COMMON } from "./sample";
