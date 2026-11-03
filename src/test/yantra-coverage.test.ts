import { describe, expect, it } from "vitest";
import { calculateYantra } from "@/lib/numerology";
import { selectYantraSections } from "@/lib/yantra-report-types";
import { YANTRA_COPY } from "@/lib/yantra-copy";

describe("Полнота трактовок нового разбора", () => {
  it("все 17 рассчитанных значений обеспечены материалом для каждой допустимой комбинации", () => {
    for (let day = 1; day <= 9; day++) for (let month = 1; month <= 12; month++) for (let year = 2000; year <= 2008; year++) {
      const sections = selectYantraSections(calculateYantra(day, month, year), YANTRA_COPY);
      expect(sections).toHaveLength(17);
      for (const section of sections) {
        expect(section.meaning, `${section.key}:${section.value}`).not.toBeNull();
        expect(section.meaning?.pages.every(page => page >= 1 && page <= 288)).toBe(true);
      }
    }
  });
  it("формула интеграла эквивалентна удвоенному ЧЖП из новой книги", () => {
    for (let day = 1; day <= 9; day++) for (let month = 1; month <= 12; month++) {
      const y = calculateYantra(day, month, 2002);
      const twice = y.base.lifePath * 2;
      expect(y.integral).toBe(twice > 9 ? twice - 9 : twice);
    }
  });
});