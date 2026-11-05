import { describe, expect, it } from "vitest";
import { calculateYantra } from "@/lib/numerology";
import { YANTRA_COPY } from "@/lib/yantra-copy";
import { selectYantraSections } from "@/lib/yantra-report-types";

describe("Материалы подтверждённого образца Янтры", () => {
  it("для 19.09.1975 выбирает все 17 разделов из нового образца", () => {
    const sections = selectYantraSections(calculateYantra(19, 9, 1975), YANTRA_COPY, 5);
    expect(sections.map(s => s.value)).toEqual([9, 1, 4, 5, 2, 7, 7, 3, 6, 5, 0, 8, 2, 6, 8, 3, 5, 7, 1]);
    expect(sections.filter(s => s.key !== "vector").every(s => s.meaning?.source === "sample-2026-11-05")).toBe(true);
  });
  it("материал тройки выбирается для задачи 2, а не задачи 3", () => {
    const sections = selectYantraSections(calculateYantra(3, 9, 1975), YANTRA_COPY);
    expect(sections.find(s => s.key === "tasks")?.value).toBe(2);
    expect(sections.find(s => s.key === "tasks")?.meaning?.source).toBe("tasks-three-2026-11-05");
    expect(YANTRA_COPY.tasks?.[3]?.source).toBeUndefined();
  });
  it("не заменяет остальные числа и сохраняет прежнюю формулу вектора", () => {
    expect(YANTRA_COPY.character?.[6]?.pages).toEqual([24]);
    expect(YANTRA_COPY.character?.[6]?.source).toBeUndefined();
    expect(calculateYantra(19, 9, 1975).vector).toBe(7);
  });
});