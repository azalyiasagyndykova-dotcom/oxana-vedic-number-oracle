import { describe, expect, it, vi } from "vitest";
import { calculateYantra } from "@/lib/numerology";
import { selectYantraSections, type YantraMeaning } from "@/lib/yantra-report-types";

const meaning: YantraMeaning = { essence: "a", energy: "b", flags: "c", actions: ["d"], pages: [1] };

describe("Выбор трактовок Янтры", () => {
  it("выдаёт 16 позиций и интеграл для 06.03.2002", () => {
    const sections = selectYantraSections(calculateYantra(6, 3, 2002), {});
    expect(sections.map(s => s.value)).toEqual([3, 6, 4, 4, 2, 6, 1, 8, 5, 5, 5, 2, 7, 0, 7, 3, 8]);
  });
  it("сохраняет заботу −1 для февраля без подмены положительным числом", () => {
    const sections = selectYantraSections(calculateYantra(1, 2, 1990), { care: { [-1]: meaning, 1: { ...meaning, pages: [2] } } });
    expect(sections.find(s => s.key === "care")?.meaning?.pages).toEqual([1]);
  });
  it("сохраняет заботу −2 для октября", () => {
    expect(selectYantraSections(calculateYantra(1, 10, 1990), {}).find(s => s.key === "care")?.value).toBe(-2);
  });
  it("выдаёт только рассчитанное значение, а не весь каталог", () => {
    const sections = selectYantraSections(calculateYantra(6, 3, 2002), { care: { 0: meaning, 1: { ...meaning, pages: [288] } } });
    expect(sections.find(s => s.key === "care")?.meaning).toBe(meaning);
    expect(JSON.stringify(sections)).not.toContain("288");
    expect(sections.find(s => s.key === "method")?.meaning).toBeNull();
  });
});

const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/integrations/supabase/auth-middleware", () => ({ requireSupabaseAuth: {} }));
vi.mock("@tanstack/react-start", () => ({ createServerFn: () => {
  const builder = { middleware: () => builder, inputValidator: () => builder, handler: (handler: (args: unknown) => unknown) => handler };
  return builder;
} }));
import { generateYantraReport } from "@/lib/yantra.functions";

describe("Защита нового разбора", () => {
  it("отказывает при закрытом доступе до чтения материалов", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    const handler = generateYantraReport as unknown as (args: unknown) => Promise<unknown>;
    await expect(handler({ data: { day: 6, month: 3, year: 2002 }, context: { supabase: { rpc } } })).rejects.toThrow("Доступ закрыт");
    expect(rpc).toHaveBeenCalledWith("has_active_access");
  });
});