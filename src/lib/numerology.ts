// Ведическая нумерология — расчёт Янтры (матрица из 16 позиций).

/** Сводит число к одной цифре сложением цифр (только для положительных чисел > 9). */
export function reduce(n: number): number {
  let r = Math.abs(n);
  while (r > 9) {
    r = String(r)
      .split("")
      .reduce((s, d) => s + Number(d), 0);
  }
  return n < 0 ? -r : r;
}

function digitSum(s: string): number {
  return s.replace(/\D/g, "").split("").reduce((a, d) => a + Number(d), 0);
}

/**
 * Прибавление/вычитание к базовому числу.
 * Результат больше 9 сводится к одной цифре; 0 и отрицательные значения сохраняются
 * (например, месяц 2 − 3 = −1).
 */
export function shift(base: number, delta: number): number {
  const r = base + delta;
  return r > 9 ? reduce(r) : r;
}

export type PositionKey =
  | "approach"
  | "character"
  | "method"
  | "karma"
  | "prana"
  | "relations"
  | "expense"
  | "communication"
  | "siddhi"
  | "happiness"
  | "tasks"
  | "love"
  | "income"
  | "care"
  | "opportunities"
  | "philosophy";

export interface YantraResult {
  date: { day: number; month: number; year: number };
  base: { day: number; month: number; year: number; lifePath: number };
  matrix: Record<PositionKey, number>;
  /** Порядок ячеек 4×4 слева направо, сверху вниз */
  grid: PositionKey[];
  integral: number;
  vector: number;
  expression: number;
}

export const GRID: PositionKey[] = [
  "approach", "character", "method", "karma",
  "prana", "relations", "expense", "communication",
  "siddhi", "happiness", "tasks", "love",
  "income", "care", "opportunities", "philosophy",
];

export function isValidDate(day: number, month: number, year: number): boolean {
  if (!Number.isInteger(day) || !Number.isInteger(month) || !Number.isInteger(year)) return false;
  if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1) return false;
  const d = new Date(Date.UTC(year, month - 1, day));
  return d.getUTCFullYear() === year && d.getUTCMonth() === month - 1 && d.getUTCDate() === day;
}

export function calculateYantra(day: number, month: number, year: number): YantraResult {
  if (!isValidDate(day, month, year)) throw new Error("Некорректная дата рождения");

  const d = reduce(day); // число ума (ЧУ)
  const m = reduce(month); // число подхода
  const y = reduce(digitSum(String(year))); // число метода
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  const k = reduce(digitSum(dd + mm + String(year))); // ЧЖП

  const matrix: Record<PositionKey, number> = {
    approach: m,
    character: d,
    method: y,
    karma: k,
    prana: shift(y, -2),
    relations: shift(k, 2),
    expense: shift(m, -2),
    communication: shift(d, 2),
    siddhi: shift(k, 1),
    happiness: shift(y, 1),
    tasks: shift(d, -1),
    love: shift(m, -1),
    income: shift(d, 1),
    care: shift(m, -3),
    opportunities: shift(k, 3),
    philosophy: shift(y, -1),
  };

  return {
    date: { day, month, year },
    base: { day: d, month: m, year: y, lifePath: k },
    matrix,
    grid: GRID,
    integral: reduce(m + d + y + k),
    vector: reduce(y * 2 - 1),
    expression: reduce(d + m),
  };
}

export interface BasicReport {
  date: { day: number; month: number; year: number };
  mind: number;
  path: number;
  dharma: number;
  cycle: number;
  cycleYear: number;
  finCode: string;
}

/** Пять ключевых параметров разбора (как в образце). Цикл жизни — по календарному году. */
export function calculateBasics(day: number, month: number, year: number, currentYear: number): BasicReport {
  const y = calculateYantra(day, month, year);
  const dd = String(day).padStart(2, "0");
  const mm = String(month).padStart(2, "0");
  return {
    date: y.date,
    mind: y.base.day,
    path: y.base.lifePath,
    dharma: reduce(y.base.day + y.base.month),
    cycle: reduce(digitSum(dd + mm + String(currentYear))),
    cycleYear: currentYear,
    finCode: `${y.base.day}${y.base.month}${y.base.year}${y.base.lifePath}`,
  };
}
