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

export type YantraCatalog = Partial<Record<PositionKey | "problem" | "vector" | "integral", Record<number, YantraMeaning>>>;
export interface YantraSection {
  key: PositionKey | "problem" | "vector" | "integral";
  title: string;
  value: number;
  meaning: YantraMeaning | null;
}
export interface YantraReportData {
  y: YantraResult;
  sections: YantraSection[];
  problem?: number | null;
}

export const YANTRA_TITLES: Record<PositionKey | "problem" | "vector" | "integral", string> = {
  approach: "Подход к делу",
  character: "Характер",
  method: "Метод",
  karma: "Карма (ЧЖП)",
  prana: "Прана",
  relations: "Отношения с близкими",
  expense: "Расходы",
  communication: "Коммуникация",
  siddhi: "Сиддхи",
  happiness: "Счастье",
  tasks: "Задачи",
  love: "Любовь",
  income: "Самореализация",
  care: "Забота",
  opportunities: "Возможности",
  philosophy: "Философия",
  integral: "Интеграл",
  problem: "Число проблем",
  vector: "Вектор жизни",
};

export function selectYantraSections(y: YantraResult, catalog: YantraCatalog, problem?: number): YantraSection[] {
  const positions: YantraSection["key"][] = [...y.grid, ...(problem === undefined ? [] : ["problem" as const]), "vector", "integral"];
  return positions.map(key => {
    const value = key === "integral" ? y.integral : key === "vector" ? y.vector : key === "problem" ? problem ?? 0 : y.matrix[key];
    return { key, title: YANTRA_TITLES[key], value, meaning: catalog[key]?.[value] ?? null };
  });
}