import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const generateReport = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(input => z.object({ day: z.number().int().min(1).max(31), month: z.number().int().min(1).max(12), year: z.number().int().min(1).max(9999) }).parse(input)).handler(async ({ data, context }) => {
  const { data: allowed, error } = await context.supabase.rpc("has_active_access");
  if (error || !allowed) throw new Error("Доступ закрыт или срок закончился. Обратитесь к владельцу.");
  const { calculateBasics, isValidDate } = await import("./numerology");
  if (!isValidDate(data.day, data.month, data.year)) throw new Error("Проверьте дату рождения");
  const b = calculateBasics(data.day, data.month, data.year, new Date().getUTCFullYear());
  const { MIND, PATH, DHARMA, YEAR, KEYS, FLAT, MONEY, REPORT_COMMON } = await import("./report-texts");
  return { b, copy: { mind: MIND[b.mind], path: PATH[b.path], dharma: DHARMA[b.dharma], year: YEAR[b.cycle], keys: KEYS[b.mind], flat: FLAT, money: MONEY, common: REPORT_COMMON } };
});