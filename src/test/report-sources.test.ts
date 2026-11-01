import { describe, expect, it } from "vitest";
import { MIND, PATH, DHARMA, YEAR, KEYS, MONEY } from "@/lib/report-texts";
import { SAMPLE_KEYS, SAMPLE_MONEY } from "@/lib/report-texts/sample";
import sources from "@/lib/report-texts/sources.json";

describe("Авторские источники разбора", () => {
  it("разделы в новом стиле, без исторических личностей", () => {
    for (const set of [MIND, PATH, YEAR]) {
      for (let n = 1; n <= 9; n++) {
        const titles = set[n]!.sections.map((s) => s.title);
        expect(titles.slice(0, 4)).toEqual(["Кто ты: твоя суперсила", "Где твои деньги и энергия", "Красные флаги: куда утекают силы", "Инструкция: бери и делай"]);
      }
    }
    expect(JSON.stringify(PATH[4])).not.toContain("Ли Куан");
    expect(KEYS[6]).toBe(SAMPLE_KEYS);
    for (const [k, v] of Object.entries(SAMPLE_MONEY)) expect(MONEY[Number(k)]).toBe(v);
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
    for (let n = 1; n <= 9; n++) expect(MONEY[n]?.text.length).toBeGreaterThan(100);
    expect(DHARMA[3]?.full.join(" ")).toMatch(/Юпитер|дет/);
    expect(KEYS[1]?.planet).toBe("Солнце");
    expect(KEYS[1]?.strong).toBeUndefined();
    expect(KEYS[1]?.stone).toBeUndefined();
  });
});