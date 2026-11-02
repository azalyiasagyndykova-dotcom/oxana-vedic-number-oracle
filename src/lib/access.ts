import { z } from "zod";

export const monthsSchema = z.union([z.literal(1), z.literal(3), z.literal(6), z.literal(12)]);
export const passwordSchema = z.string().min(10, "Пароль должен содержать не менее 10 символов").max(128);
export const loginSchema = z.object({ email: z.string().trim().email("Проверьте почту").max(254).transform(v => v.toLowerCase()), password: z.string().min(1).max(128) });
export const clientSchema = loginSchema.extend({ name: z.string().trim().min(1, "Введите имя").max(100), password: passwordSchema, months: monthsSchema });
export const ownerSetupSchema = loginSchema.extend({ password: passwordSchema, confirmPassword: z.string().max(128), activationCode: z.string().min(1).max(256) }).refine(data => data.password === data.confirmPassword, { message: "Пароли не совпадают", path: ["confirmPassword"] });

export async function validActivationCode(supplied: string, configured: string | undefined): Promise<boolean> {
  if (!configured) return false;
  const digest = (value: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  const [a, b] = await Promise.all([digest(supplied), digest(configured)]);
  const left = new Uint8Array(a); const right = new Uint8Array(b);
  let difference = 0;
  for (const [i, byte] of left.entries()) difference |= byte ^ (right[i] ?? 0);
  return difference === 0;
}

export function expiresAfterMonths(start: Date, months: 1 | 3 | 6 | 12): string {
  const result = new Date(start);
  const day = result.getUTCDate();
  result.setUTCDate(1);
  result.setUTCMonth(result.getUTCMonth() + months);
  const lastDay = new Date(Date.UTC(result.getUTCFullYear(), result.getUTCMonth() + 1, 0)).getUTCDate();
  result.setUTCDate(Math.min(day, lastDay));
  return result.toISOString();
}
export function accessAllowed(owner: boolean, access: { revoked: boolean; starts_at: string; expires_at: string } | null, now = Date.now()) {
  return owner || Boolean(access && !access.revoked && Date.parse(access.starts_at) <= now && Date.parse(access.expires_at) > now);
}
export function assertOwner(owner: boolean) { if (!owner) throw new Error("Действие доступно только владельцу"); }