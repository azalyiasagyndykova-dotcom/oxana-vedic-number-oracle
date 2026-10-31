import type { MindText, PathText, DharmaText, YearText, KeysText, MoneyDigit } from "@/lib/report-types";
import { SOURCE_MIND, SOURCE_PATH, SOURCE_DHARMA, SOURCE_YEAR, SOURCE_KEYS } from "./source";
import { SAMPLE_MIND, SAMPLE_PATH, SAMPLE_DHARMA, SAMPLE_YEAR, SAMPLE_KEYS, SAMPLE_FLAT, SAMPLE_MONEY } from "./sample";

export const MIND: Record<number, MindText> = { ...SOURCE_MIND, 6: SAMPLE_MIND };
export const PATH: Record<number, PathText> = { ...SOURCE_PATH, 4: SAMPLE_PATH };
export const DHARMA: Record<number, DharmaText> = { ...SOURCE_DHARMA, 9: SAMPLE_DHARMA };
export const YEAR: Record<number, YearText> = { ...SOURCE_YEAR, 1: SAMPLE_YEAR };
export const KEYS: Record<number, KeysText> = { ...SOURCE_KEYS, 6: SAMPLE_KEYS };
export const FLAT = SAMPLE_FLAT;
export const MONEY: Partial<Record<number, MoneyDigit>> = { ...SAMPLE_MONEY };
export { REPORT_COMMON } from "./sample";
