import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";
import { accessAllowed, assertOwner, clientSchema, expiresAfterMonths, loginSchema, monthsSchema, passwordSchema } from "./access";

export const getAccess = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: owner, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "owner" });
  if (error) throw new Error("Не удалось проверить доступ");
  const { data: access, error: accessError } = await context.supabase.from("client_access").select("starts_at, expires_at, revoked").eq("user_id", context.userId).maybeSingle();
  if (accessError) throw new Error("Не удалось проверить срок доступа");
  return { owner: Boolean(owner), allowed: accessAllowed(Boolean(owner), access), access };
});

export const listClients = createServerFn({ method: "GET" }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
  const { data: owner, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "owner" });
  if (error) throw new Error("Не удалось проверить права");
  assertOwner(Boolean(owner));
  const { data, error: readError } = await context.supabase.from("client_access").select("*, profiles(display_name)").order("expires_at").limit(1000);
  if (readError) throw new Error("Не удалось загрузить клиентов");
  return data ?? [];
});

export const addClient = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(input => clientSchema.parse(input)).handler(async ({ data, context }) => {
  const { data: owner, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "owner" });
  if (error) throw new Error("Не удалось проверить права");
  assertOwner(Boolean(owner));
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true, app_metadata: { owner_provisioned: true }, user_metadata: { display_name: data.name } });
  if (createError || !created.user) throw new Error("Не удалось добавить клиента. Проверьте почту и надёжность пароля; возможно, аккаунт уже существует.");
  const { error: accessError } = await context.supabase.from("client_access").insert({ user_id: created.user.id, email: data.email, expires_at: expiresAfterMonths(new Date(), data.months) });
  if (accessError) { await supabaseAdmin.auth.admin.deleteUser(created.user.id); throw new Error("Не удалось сохранить доступ"); }
  return { ok: true };
});

export const editClient = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(input => z.object({ id: z.string().uuid(), action: z.enum(["revoke", "renew", "delete"]), months: monthsSchema }).parse(input)).handler(async ({ data, context }) => {
  const { data: owner, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "owner" });
  if (error) throw new Error("Не удалось проверить права");
  assertOwner(Boolean(owner));
  const { data: client } = await context.supabase.from("client_access").select("user_id,expires_at,revoked").eq("user_id", data.id).maybeSingle();
  if (!client || client.user_id === context.userId) throw new Error("Клиент не найден");
  if (data.action === "delete") {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(client.user_id);
    if (deleteError) throw new Error("Не удалось удалить клиента");
  } else {
    const start = data.action === "renew" && !client.revoked && Date.parse(client.expires_at) > Date.now() ? new Date(client.expires_at) : new Date();
    const { error: updateError } = await context.supabase.from("client_access").update(data.action === "revoke" ? { revoked: true } : { revoked: false, expires_at: expiresAfterMonths(start, data.months) }).eq("user_id", client.user_id);
    if (updateError) throw new Error("Не удалось изменить доступ");
  }
  return { ok: true };
});

export const changeOwnerPassword = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator(input => z.object({ current: z.string().min(1).max(128), password: passwordSchema }).parse(input)).handler(async ({ context, data }) => {
  const { data: owner, error } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "owner" });
  if (error) throw new Error("Не удалось проверить права");
  assertOwner(Boolean(owner));
  const { error: updateError } = await context.supabase.auth.updateUser({ password: data.password, current_password: data.current });
  if (updateError) throw new Error("Пароль не изменён. Проверьте текущий пароль и надёжность нового.");
  return { ok: true };
});

// Initial owner can only be created from securely configured credentials, never first-visitor registration.
export const prepareOwner = createServerFn({ method: "POST" }).inputValidator(input => loginSchema.parse(input)).handler(async ({ data }) => {
  const email = process.env['OWNER_EMAIL'];
  const password = process.env['OWNER_PASSWORD'];
  if (!email || !password) return { ok: false };
  const { createHash, timingSafeEqual } = await import("node:crypto");
  const equal = (a: string, b: string) => timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
  if (!equal(data.email, email.trim().toLowerCase()) || !equal(data.password, password)) return { ok: false };
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count, error } = await supabaseAdmin.from("user_roles").select("id", { count: "exact", head: true });
  if (error || count !== 0) return { ok: false };
  const { data: created, error: createError } = await supabaseAdmin.auth.admin.createUser({ email: data.email, password: data.password, email_confirm: true, app_metadata: { owner_provisioned: true }, user_metadata: { display_name: "Владелец" } });
  if (createError || !created.user) return { ok: false };
  const { error: roleError } = await supabaseAdmin.from("user_roles").insert({ user_id: created.user.id, role: "owner" });
  if (roleError) { await supabaseAdmin.auth.admin.deleteUser(created.user.id); return { ok: false }; }
  return { ok: true };
});