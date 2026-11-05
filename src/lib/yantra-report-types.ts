import type { PositionKey, YantraResult } from "./numerology";

export interface YantraMeaning {
  essence: string;
  energy: string;
  flags: string;
  actions: string[];
  pages: number[];
  source?: "sample-2026-11-05" | "tasks-three-2026-11-05";
  blocks?: { title: string; paragraphs?: string[]; items?: string[] }[];
}

export type YantraCatalog = Partial<Record<PositionKey | "integral", Record<number, YantraMeaning>>>;
export interface YantraSection {
  key: PositionKey | "integral";
  title: string;
  value: number;
  meaning: YantraMeaning | null;
}
export interface YantraReportData {
  y: YantraResult;
  sections: YantraSection[];
}

export const YANTRA_TITLES: Record<PositionKey | "integral", string> = {
  approach: "Твой старт: подход к делу",
  character: "Твоя суть: характер",
  method: "Твой способ достигать целей",
  karma: "Ты и мир",
  prana: "Твой источник энергии",
  relations: "Ты и близкие",
  expense: "Куда уходят деньги и силы",
  communication: "Твой голос: общение и партнёрство",
  siddhi: "Твои таланты",
  happiness: "Что делает тебя счастливее",
  tasks: "Твоя точка роста",
  love: "Любовь и близость",
  income: "Самореализация и доход",
  care: "Как ты заботишься",
  opportunities: "Где открываются возможности",
  philosophy: "Твоя внутренняя опора",
  integral: "Интеграл: твой главный ориентир",
};

export function selectYantraSections(y: YantraResult, catalog: YantraCatalog): YantraSection[] {
  const positions: (PositionKey | "integral")[] = [...y.grid, "integral"];
  return positions.map(key => {
    const value = key === "integral" ? y.integral : y.matrix[key];
    return { key, title: YANTRA_TITLES[key], value, meaning: catalog[key]?.[value] ?? null };
  });
}