import type { MindText, PathText, DharmaText, YearText, KeysText, MoneyDigit } from "@/lib/report-types";
import { SOURCE_KEYS } from "./source";
import { SAMPLE_KEYS, SAMPLE_FLAT, SAMPLE_MONEY } from "./sample";
import { STYLED_MIND } from "./styled_mind";
import { STYLED_PATH } from "./styled_path";
import { STYLED_DHARMA } from "./styled_dharma";
import { STYLED_YEAR } from "./styled_year";

// Report copy: restyled texts (meaning based on sample.ts + source.ts).
export const MIND: Record<number, MindText> = STYLED_MIND;
export const PATH: Record<number, PathText> = STYLED_PATH;
export const DHARMA: Record<number, DharmaText> = STYLED_DHARMA;
export const YEAR: Record<number, YearText> = STYLED_YEAR;
export const KEYS: Record<number, KeysText> = { ...SOURCE_KEYS, 6: SAMPLE_KEYS };
export const FLAT = SAMPLE_FLAT;
export const MONEY: Partial<Record<number, MoneyDigit>> = { ...SAMPLE_MONEY };
export { REPORT_COMMON } from "./sample";
