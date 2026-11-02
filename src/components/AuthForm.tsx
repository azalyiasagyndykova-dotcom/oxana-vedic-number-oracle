import { useState, type FormEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { activateOwner, getAccess, prepareOwner } from "@/lib/access.functions";
import { loginSchema, ownerSetupSchema } from "@/lib/access";
import { Button } from "@/components/ui/button";
import { LockKeyhole } from "lucide-react";

export function AuthForm({ firstOwner = false }: { firstOwner?: boolean }) {
  const [setup, setSetup] = useState(firstOwner);
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const navigate = useNavigate(); const access = useServerFn(getAccess); const prepare = useServerFn(prepareOwner); const activate = useServerFn(activateOwner);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = loginSchema.safeParse(values);
    const ownerValues = setup ? ownerSetupSchema.safeParse(values) : null;
    if (!parsed.success) { setError("Введите корректную почту и пароль"); return; }
    if (ownerValues && !ownerValues.success) { setError(ownerValues.error.issues[0]?.message ?? "Проверьте данные"); return; }
    setBusy(true);
    try {
      if (ownerValues?.success) await activate({ data: ownerValues.data });
      let result = await supabase.auth.signInWithPassword(parsed.data);
      if (result.error && !setup) {
        const setup = await prepare({ data: parsed.data });
        if (setup.ok) result = await supabase.auth.signInWithPassword(parsed.data);
      }
      if (result.error) { setError("Не удалось войти. Проверьте почту и пароль или обратитесь к владельцу."); return; }
      const state = await access();
      await navigate({ to: state.owner ? "/owner" : "/calculator" });
    } catch (cause) { setError(setup && cause instanceof Error ? cause.message : "Не удалось войти. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  }
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground"><div className="w-full max-w-sm">
    <div className="mb-6 text-center"><LockKeyhole className="mx-auto mb-4 text-gold" size={28} /><p className="text-xs uppercase text-muted-foreground">Ведическая нумерология</p><h1 className="mt-2 text-4xl font-semibold text-primary">Жизненный Код</h1><h2 className="mt-3 text-lg">{setup ? "Первый вход владельца" : "Вход в личный кабинет"}</h2></div>
    {firstOwner && <div className="mb-5 grid grid-cols-2 gap-2"><Button variant={setup ? "default" : "outline"} disabled={busy} onClick={() => { setSetup(true); setError(""); }}>Владелец</Button><Button variant={setup ? "outline" : "default"} disabled={busy} onClick={() => { setSetup(false); setError(""); }}>Обычный вход</Button></div>}
    <form onSubmit={submit} className="space-y-4"><label className="block text-sm">{setup ? "Почта владельца" : "Почта"}<input name="email" type="email" autoComplete="username" maxLength={254} required className="mt-1 w-full rounded-md border border-input bg-card px-3 py-3" /></label><label className="block text-sm">{setup ? "Придумайте пароль" : "Пароль"}<input name="password" type="password" autoComplete={setup ? "new-password" : "current-password"} minLength={setup ? 10 : 1} maxLength={128} required className="mt-1 w-full rounded-md border border-input bg-card px-3 py-3" /></label>
    {setup && <><label className="block text-sm">Повторите пароль<input name="confirmPassword" type="password" autoComplete="new-password" maxLength={128} required className="mt-1 w-full rounded-md border border-input bg-card px-3 py-3" /></label></>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}<Button type="submit" disabled={busy} className="h-12 w-full">{busy ? "Вхожу…" : setup ? "Создать кабинет владельца" : "Войти"}</Button></form>
  </div></main>;
}