import { describe, expect, it } from "vitest";
import { MIND, PATH, DHARMA, YEAR, KEYS, MONEY } from "@/lib/report-texts";
import { SAMPLE_KEYS, SAMPLE_MONEY } from "@/lib/report-texts/sample";
import sources from "@/lib/report-texts/sources.json";

describe("Авторские источники разбора", () => {
  it("разделы в новом стиле, без исторических личностей", () => {
    for (const set of [MIND, PATH, DHARMA, YEAR]) {
      for (let n = 1; n <= 9; n++) {
        const titles = set[n]!.sections.map((s) => s.title);
        expect(titles.slice(0, 4)).toEqual(["Кто ты: твоя суперсила", "Где твои деньги и энергия", "Красные флаги: куда утекают силы", "Инструкция: бери и делай"]);
      }
    }
    expect(JSON.stringify(PATH[4])).not.toContain("Ли Куан");
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