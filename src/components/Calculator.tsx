import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAccess } from "@/lib/access.functions";
import { generateReport } from "@/lib/report.functions";
import { AccountBar } from "./AccountBar";
import { Button } from "@/components/ui/button";
import { CONTACTS } from "@/lib/texts";
import { Report } from "@/components/Report";
import { downloadReport } from "@/lib/download";

function Contacts({ compact = false }: { compact?: boolean }) {
  const items = [
    { label: "Instagram", value: "@oxanashipovskaya1", href: CONTACTS.instagram },
    { label: "Telegram", value: "@oxanashipovskaya1", href: CONTACTS.telegram },
    { label: "WhatsApp", value: "+7 707 212 05 46", href: CONTACTS.whatsapp },
    { label: "TikTok", value: "@oxananumeroloq", href: CONTACTS.tiktok },
  ];
  return (
    <div className={`grid gap-3 ${compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
      {items.map((i) => (
        <a key={i.label} href={i.href} target="_blank" rel="noreferrer"
          className="rounded-xl border border-border bg-card px-4 py-3 transition hover:border-accent">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{i.label}</div>
          <div className="mt-1 break-all text-sm font-semibold text-primary">{i.value}</div>
        </a>
      ))}
    </div>
  );
}

export function Calculator() {
  const fetchAccess = useServerFn(getAccess);
  const createReport = useServerFn(generateReport);
  const state = useQuery({ queryKey: ["access"], queryFn: () => fetchAccess(), refetchInterval: 15000 });
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [report, setReport] = useState<Awaited<ReturnType<typeof generateReport>> | null>(null);
  const result = report?.b;
  const [calculating, setCalculating] = useState(false);
  const [personName, setPersonName] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const m = date.trim().match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
    if (!m) return setError("Введите дату в формате ДД.ММ.ГГГГ, например 06.03.2002");
    const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
    setError("");
    setCalculating(true);
    try {
      const next = await createReport({ data: { day: d, month: mo, year: y } });
      setPersonName(name.trim()); setReport(next);
      setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось рассчитать разбор"); }
    finally { setCalculating(false); }
  }

  const [busy, setBusy] = useState<"" | "color" | "bw">("");
  async function download(bw: boolean) {
    if (!result || busy) return;
    const ds = `${String(result.date.day).padStart(2, "0")}.${String(result.date.month).padStart(2, "0")}.${result.date.year}`;
    setBusy(bw ? "bw" : "color");
    try {
      const current = await fetchAccess();
      const element = document.getElementById("report-doc");
      if (!current.allowed || !element) throw new Error("Доступ закрыт");
      await downloadReport(element, `${personName || "Разбор"} ${ds}${bw ? " (ч-б)" : ""}`, bw);
    } catch (e) {
      console.error(e);
      alert("Не удалось сохранить файл. Попробуйте ещё раз.");
    } finally { setBusy(""); }
  }

  function onDateInput(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    let out = digits.slice(0, 2);
    if (digits.length > 2) out += "." + digits.slice(2, 4);
    if (digits.length > 4) out += "." + digits.slice(4);
    setDate(out);
  }

  if (state.isPending) return <p className="p-6 text-center text-muted-foreground">Проверяю доступ…</p>;
  if (!state.data?.allowed) return <main className="min-h-screen bg-background"><AccountBar owner={false} /><div className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="text-3xl text-primary">{state.isError ? "Не удалось проверить доступ" : "Доступ закрыт"}</h1><p className="mt-4">{state.isError ? "Попробуйте обновить страницу." : "Срок закончился или владелец закрыл доступ. Напишите владельцу для продления."}</p></div></main>;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <AccountBar owner={state.data.owner} expires={state.data.access?.expires_at} />
      <section className="no-print bg-hero px-5 pb-10 pt-10 text-primary-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Ведическая нумерология</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">Жизненный Код</h1>
          <p className="mx-auto mt-5 max-w-xl text-base opacity-85">
            Введите имя и дату рождения - и получите подробный личный разбор: Число Ума, Число Жизненного Пути, Дхарму, Цикл Жизни и Финансовый код. Сохраните его в цвете или в чёрно-белом варианте для печати.
          </p>
          <form onSubmit={onSubmit} className="mx-auto mt-6 grid max-w-xl gap-3 rounded-2xl bg-card p-5 text-left text-card-foreground shadow-soft md:grid-cols-[1fr_1fr_auto]">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Имя
              <input value={name} maxLength={100} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-3 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:border-accent" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Дата рождения
              <input value={date} onChange={(e) => onDateInput(e.target.value)} placeholder="ДД.ММ.ГГГГ" inputMode="numeric"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-3 text-base font-normal tracking-normal text-foreground outline-none focus:border-accent" />
            </label>
            <Button type="submit" disabled={calculating} className="h-12 self-end px-6 font-semibold">{calculating ? "Рассчитываю…" : "Рассчитать"}</Button>
            {error && <p className="text-sm text-destructive md:col-span-3">{error}</p>}
          </form>
        </div>
      </section>

      {result && (
        <section id="report" className="mx-auto max-w-3xl px-4 py-6">
          <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border bg-secondary/95 px-4 py-3 backdrop-blur">
            <div className="grid grid-cols-2 gap-2">
              <Button disabled={!!busy} onClick={() => download(false)} className="min-h-12 px-3 py-3 text-sm font-semibold sm:text-base">{busy === "color" ? "Готовлю файл…" : "⬇ Скачать цветной"}</Button>
              <Button variant="outline" disabled={!!busy} onClick={() => download(true)} className="min-h-12 border-2 border-primary px-3 py-3 text-sm font-semibold text-primary sm:text-base">{busy === "bw" ? "Готовлю файл…" : "⬇ Скачать ч-б"}</Button>
            </div>
            <p className="mt-1.5 text-center text-xs text-secondary-foreground">На телефоне и iPad откроется меню «Поделиться» - выберите «Заметки», «Файлы» или мессенджер.</p>
          </div>
          <div id="report-doc">{report && <Report b={result} name={personName} copy={report.copy} />}</div>
        </section>
      )}

      <footer className="no-print mx-auto max-w-4xl px-5 py-10">
        <h2 className="text-center text-3xl font-semibold text-primary">Личная консультация</h2>
        <p className="mb-6 mt-2 text-center text-sm text-muted-foreground">Оксана Шиповская — нумеролог. Напишите в удобный мессенджер.</p>
        <Contacts />
      </footer>
    </main>
  );
}
