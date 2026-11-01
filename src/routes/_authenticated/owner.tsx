import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { getAccess, listClients, addClient, editClient, changeOwnerPassword } from "@/lib/access.functions";
import { clientSchema, monthsSchema, passwordSchema } from "@/lib/access";
import { pageHead } from "@/lib/page-head";
import { AccountBar } from "@/components/AccountBar";
import { Button } from "@/components/ui/button";
import { UserPlus, Ban, Trash2, RefreshCw, KeyRound } from "lucide-react";

export const Route = createFileRoute("/_authenticated/owner")({ head: () => pageHead("Кабинет владельца", "Управление клиентами и сроками доступа к Жизненному Коду."), component: Owner });
const inputClass = "mt-1 w-full rounded-md border border-input bg-card px-3 py-2 text-foreground";
function Term({ value, onChange }: { value: 1 | 3 | 6 | 12; onChange: (v: 1 | 3 | 6 | 12) => void }) {
  return <select aria-label="Срок доступа" value={value} onChange={e => onChange(monthsSchema.parse(Number(e.target.value)))} className="rounded-md border border-input bg-card px-3 py-2">{[1,3,6,12].map(n => <option key={n} value={n}>{n === 1 ? "1 месяц" : n === 3 ? "3 месяца" : n === 6 ? "6 месяцев" : "1 год"}</option>)}</select>;
}
function Owner() {
  const fetchAccess = useServerFn(getAccess); const fetchClients = useServerFn(listClients); const add = useServerFn(addClient); const edit = useServerFn(editClient); const changePassword = useServerFn(changeOwnerPassword);
  const cache = useQueryClient();
  const access = useQuery({ queryKey: ["access"], queryFn: () => fetchAccess() });
  const clients = useQuery({ queryKey: ["clients"], queryFn: () => fetchClients(), enabled: access.data?.owner === true });
  const [months, setMonths] = useState<1|3|6|12>(1); const [renewMonths, setRenewMonths] = useState<1|3|6|12>(1);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState(""); const [passwordOpen, setPasswordOpen] = useState(false); const [search, setSearch] = useState("");
  async function refresh() { await cache.invalidateQueries({ queryKey: ["clients"] }); await cache.invalidateQueries({ queryKey: ["access"] }); }
  async function addSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const parsed = clientSchema.safeParse({ ...Object.fromEntries(new FormData(form)), months });
    if (!parsed.success) { setMessage(parsed.error.issues[0]?.message ?? "Проверьте данные"); return; }
    setBusy(true); setMessage("");
    try { await add({ data: parsed.data }); form.reset(); await refresh(); setMessage("Клиент добавлен. Передайте ему почту и пароль лично."); }
    catch(e) { setMessage(e instanceof Error ? e.message : "Не удалось добавить клиента"); } finally { setBusy(false); }
  }
  async function action(id: string, action: "revoke"|"renew"|"delete") {
    if ((action === "delete" || action === "revoke") && !confirm(action === "delete" ? "Удалить аккаунт клиента без возможности восстановления?" : "Закрыть доступ клиента?")) return;
    setBusy(true); setMessage("");
    try { await edit({ data: { id, action, months: renewMonths } }); await refresh(); setMessage(action === "renew" ? "Доступ продлён" : action === "revoke" ? "Доступ закрыт" : "Клиент удалён"); }
    catch(e) { setMessage(e instanceof Error ? e.message : "Не удалось изменить доступ"); } finally { setBusy(false); }
  }
  async function passwordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = e.currentTarget; const data = new FormData(form);
    const password = String(data.get("password") ?? ""); const current = String(data.get("current") ?? "");
    if (password !== data.get("repeat")) { setMessage("Новые пароли не совпадают"); return; }
    const valid = passwordSchema.safeParse(password); if (!valid.success) { setMessage(valid.error.issues[0]?.message ?? "Проверьте пароль"); return; }
    setBusy(true);
    try { await changePassword({ data: { current, password } }); form.reset(); setPasswordOpen(false); setMessage("Ваш пароль изменён"); }
    catch(e) { setMessage(e instanceof Error ? e.message : "Не удалось изменить пароль"); } finally { setBusy(false); }
  }
  if (access.isPending) return <p className="p-6 text-center">Проверяю права…</p>;
  if (!access.data?.owner) return <main className="min-h-screen bg-background"><AccountBar owner={false} /><p className="p-12 text-center">Кабинет доступен только владельцу.</p></main>;
  const rows = clients.data ?? [];
  const filtered = rows.filter(row => `${row.email} ${row.profiles?.display_name ?? ""}`.toLowerCase().includes(search.toLowerCase()));
  return <main className="min-h-screen bg-background text-foreground"><AccountBar owner />
    <div className="mx-auto max-w-5xl px-5 py-8"><div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-4xl font-semibold text-primary">Кабинет владельца</h1><Button variant="outline" onClick={() => setPasswordOpen(!passwordOpen)}><KeyRound />Мой пароль</Button></div>
      {message && <p role="status" className="my-4 border-l-2 border-gold pl-3 text-sm">{message}</p>}
      {passwordOpen && <form onSubmit={passwordSubmit} className="mt-6 max-w-sm space-y-3"><h2 className="text-xl text-primary">Изменить свой пароль</h2><label className="block text-sm">Текущий пароль<input name="current" type="password" autoComplete="current-password" required maxLength={128} className={inputClass} /></label><label className="block text-sm">Новый пароль<input name="password" type="password" autoComplete="new-password" minLength={10} maxLength={128} required className={inputClass} /></label><label className="block text-sm">Повторите новый пароль<input name="repeat" type="password" autoComplete="new-password" required maxLength={128} className={inputClass} /></label><Button disabled={busy}>Сохранить пароль</Button></form>}
      <section className="mt-8 border-y border-border py-6"><h2 className="mb-4 text-2xl font-semibold text-primary">Новый клиент</h2><form onSubmit={addSubmit} className="grid items-end gap-3 sm:grid-cols-2 lg:grid-cols-5"><label className="text-sm">Имя<input name="name" required maxLength={100} className={inputClass} /></label><label className="text-sm">Почта<input name="email" type="email" required maxLength={254} className={inputClass} /></label><label className="text-sm">Пароль клиента<input name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={128} className={inputClass} /></label><label className="flex flex-col gap-1 text-sm">Доступ<Term value={months} onChange={setMonths} /></label><Button disabled={busy} type="submit" className="h-10"><UserPlus />Добавить</Button></form></section>
      <section className="py-6"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-2xl font-semibold text-primary">Клиенты · {rows.length}</h2><p className="mt-1 text-sm text-muted-foreground">Активных: {rows.filter(r => !r.revoked && Date.parse(r.expires_at) > Date.now()).length}</p></div><div className="flex flex-wrap gap-2"><input aria-label="Найти клиента" placeholder="Имя или почта" value={search} onChange={e => setSearch(e.target.value)} className="min-w-0 rounded-md border border-input bg-card px-3 py-2" /><Term value={renewMonths} onChange={setRenewMonths} /></div></div>
      {clients.isPending ? <p className="mt-6">Загружаю клиентов…</p> : clients.isError ? <p role="alert" className="mt-6 text-destructive">Не удалось загрузить клиентов</p> : filtered.length === 0 ? <p className="py-8 text-muted-foreground">{search ? "Клиенты не найдены" : "Клиентов пока нет"}</p> : <div className="mt-4 divide-y divide-border">{filtered.map(row => {
        const remaining = Math.max(0, Math.ceil((Date.parse(row.expires_at) - Date.now()) / 86400000));
        const status = row.revoked ? "Закрыт" : remaining === 0 ? "Истёк" : `Осталось дней: ${remaining}`;
        return <article key={row.user_id} className="flex flex-wrap items-center justify-between gap-4 py-4"><div className="min-w-0"><h3 className="font-semibold text-primary">{row.profiles?.display_name || "Клиент"}</h3><p className="break-all text-sm">{row.email}</p><p className="mt-1 text-xs text-muted-foreground">{status} · до {new Date(row.expires_at).toLocaleDateString("ru-RU")}</p></div><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={busy} onClick={() => action(row.user_id,"renew")}><RefreshCw />Продлить</Button><Button variant="outline" disabled={busy || row.revoked} onClick={() => action(row.user_id,"revoke")}><Ban />Закрыть</Button><Button variant="ghost" size="icon" title="Удалить клиента" aria-label={`Удалить ${row.profiles?.display_name || row.email}`} disabled={busy} onClick={() => action(row.user_id,"delete")}><Trash2 /></Button></div></article>;
      })}</div>}</section>
    </div></main>;
}