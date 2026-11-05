import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const generateYantraReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(input => z.object({ day: z.number().int().min(1).max(31), month: z.number().int().min(1).max(12), year: z.number().int().min(1900).max(2100), problem: z.number().int().min(0).max(9).optional() }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: allowed, error } = await context.supabase.rpc("has_active_access");
    if (error || !allowed) throw new Error("Доступ закрыт или срок закончился. Обратитесь к владельцу.");
    const { calculateYantra } = await import("./numerology");
    const y = calculateYantra(data.day, data.month, data.year);
    const { YANTRA_COPY } = await import("./yantra-copy");
    const { selectYantraSections } = await import("./yantra-report-types");
    return { y, problem: data.problem ?? null, sections: selectYantraSections(y, YANTRA_COPY, data.problem) };
  });