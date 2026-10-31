import { describe, expect, it } from "vitest";
import { MIND, PATH, DHARMA, YEAR, KEYS, MONEY } from "@/lib/report-texts";
import { SAMPLE_MIND, SAMPLE_PATH, SAMPLE_DHARMA, SAMPLE_YEAR, SAMPLE_KEYS, SAMPLE_MONEY } from "@/lib/report-texts/sample";
import sources from "@/lib/report-texts/sources.json";

describe("Авторские источники разбора", () => {
  it("образец остаётся приоритетным для его чисел", () => {
    expect(MIND[6]).toBe(SAMPLE_MIND);
    expect(PATH[4]).toBe(SAMPLE_PATH);
    expect(DHARMA[9]).toBe(SAMPLE_DHARMA);
    expect(YEAR[1]).toBe(SAMPLE_YEAR);
    expect(KEYS[6]).toBe(SAMPLE_KEYS);
    expect(MONEY).toEqual(SAMPLE_MONEY);
  });
  it("остальные числа имеют собственные страницы источника", () => {
    for (let n = 1; n <= 9; n++) {
      expect(MIND[n]).toBeDefined();
      expect(PATH[n]).toBeDefined();
      expect(DHARMA[n]).toBeDefined();
      expect(YEAR[n]).toBeDefined();
    }
    expect(sources.mind["4"]).toEqual([65, 68, 70, 74, 76, 79]);
    expect(sources.path["8"]).toEqual([280, 284]);
    expect(sources.dharma["3"]).toEqual([311, 313]);
    expect(sources.year["4"]).toEqual([383, 386]);
  });
  it("отсутствующие авторские значения не заменяются придуманными", () => {
    expect(Object.keys(MONEY).sort()).toEqual(["3", "4", "6"]);
    expect(KEYS[1]?.planet).toBe("Солнце");
    expect(KEYS[1]?.strong).toBeUndefined();
    expect(KEYS[1]?.stone).toBeUndefined();
  });
});