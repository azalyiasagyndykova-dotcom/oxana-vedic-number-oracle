import { describe, it, expect } from "vitest";
import { calculateYantra, isValidDate } from "@/lib/numerology";

describe("Янтра", () => {
  it("06.03.2002 совпадает с ручным расчётом", () => {
    const r = calculateYantra(6, 3, 2002);
    expect(r.grid.map((k) => r.matrix[k])).toEqual([3, 6, 4, 4, 2, 6, 1, 8, 5, 5, 5, 2, 7, 0, 7, 3]);
    expect(r.integral).toBe(8);
    expect(r.vector).toBe(7);
    expect(r.expression).toBe(9);
  });

  it("19.09.1975 совпадает с образцом разбора", () => {
    const r = calculateYantra(19, 9, 1975);
    expect(r.grid.map((k) => r.matrix[k])).toEqual([9, 1, 4, 5, 2, 7, 7, 3, 6, 5, 0, 8, 2, 6, 8, 3]);
    expect(r.integral).toBe(1);
  });

  it("февраль даёт заботу −1, октябрь — −2", () => {
    expect(calculateYantra(1, 2, 1990).matrix.care).toBe(-1);
    expect(calculateYantra(1, 10, 1990).matrix.care).toBe(-2);
  });

  it("сумма любой строки и столбца сводится к интегралу", () => {
    const r = calculateYantra(28, 12, 1987);
    const v = r.grid.map((k) => r.matrix[k]) as number[];
    const red = (n: number) => { let x = ((n % 9) + 9) % 9; return x === 0 ? 9 : x; };
    for (let i = 0; i < 4; i++) {
      expect(red(v[i * 4]! + v[i * 4 + 1]! + v[i * 4 + 2]! + v[i * 4 + 3]!)).toBe(r.integral);
      expect(red(v[i]! + v[i + 4]! + v[i + 8]! + v[i + 12]!)).toBe(r.integral);
    }
  });

  it("отклоняет несуществующие даты", () => {
    expect(isValidDate(30, 2, 2000)).toBe(false);
    expect(isValidDate(29, 2, 2000)).toBe(true);
  });
});

import { calculateBasics } from "@/lib/numerology";
describe("Пять параметров", () => {
  it("06.03.2002 в 2026 году совпадает с образцом", () => {
    const b = calculateBasics(6, 3, 2002, 2026);
    expect([b.mind, b.path, b.dharma, b.cycle, b.finCode]).toEqual([6, 4, 9, 1, "6344"]);
  });
});
