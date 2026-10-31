import { MIND_A } from "./mind_1_5";
import { MIND_B } from "./mind_6_9";
import { PATH as ORIGINAL_PATH } from "./path";
import { DHARMA as ORIGINAL_DHARMA } from "./dharma";
import { YEAR as ORIGINAL_YEAR, KEYS as ORIGINAL_KEYS, MONEY as ORIGINAL_MONEY } from "./misc";
import { SAMPLE_MIND, SAMPLE_PATH, SAMPLE_DHARMA, SAMPLE_YEAR, SAMPLE_KEYS, SAMPLE_FLAT, SAMPLE_MONEY } from "./sample";

export const MIND = { ...MIND_A, ...MIND_B, 6: SAMPLE_MIND };
export const PATH = { ...ORIGINAL_PATH, 4: SAMPLE_PATH };
export const DHARMA = { ...ORIGINAL_DHARMA, 9: SAMPLE_DHARMA };
export const YEAR = { ...ORIGINAL_YEAR, 1: SAMPLE_YEAR };
export const KEYS = { ...ORIGINAL_KEYS, 6: SAMPLE_KEYS };
export const FLAT = SAMPLE_FLAT;
export const MONEY = { ...ORIGINAL_MONEY, ...SAMPLE_MONEY };
export { REPORT_COMMON } from "./sample";
