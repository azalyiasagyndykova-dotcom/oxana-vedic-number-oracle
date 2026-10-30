import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { calculateBasics, isValidDate, type BasicReport } from "@/lib/numerology";
import { CONTACTS } from "@/lib/texts";
import { Report } from "@/components/Report";
import { downloadReport } from "@/lib/download";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ведическая нумерология — расчёт Янтры | Оксана Шиповская" },
      { name: "description", content: "Точный расчёт матрицы Янтра по дате рождения и личный разбор. Скачайте цветную или чёрно-белую версию для печати." },
      { property: "og:title", content: "Ведическая нумерология — личный разбор по дате рождения" },
      { property: "og:description", content: "Матрица Янтра, интеграл, вектор и подробный разбор 16 чисел вашей судьбы." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

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

function Index() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<BasicReport | null>(null);
  const [personName, setPersonName] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const m = date.trim().match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
    if (!m) return setError("Введите дату в формате ДД.ММ.ГГГГ, например 06.03.2002");
    const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (!isValidDate(d, mo, y)) return setError("Такой даты не существует. Проверьте день, месяц и год.");
    setError("");
    setPersonName(name.trim());
    setResult(calculateBasics(d, mo, y, new Date().getFullYear()));
    setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  const [busy, setBusy] = useState<"" | "color" | "bw">("");
  async function download(bw: boolean) {
    if (!result || busy) return;
    const ds = `${String(result.date.day).padStart(2, "0")}.${String(result.date.month).padStart(2, "0")}.${result.date.year}`;
    setBusy(bw ? "bw" : "color");
    try {
      await downloadReport(document.getElementById("report-doc")!, `${personName || "Разбор"} ${ds}${bw ? " (ч-б)" : ""}`, bw);
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

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="no-print bg-hero px-5 pb-20 pt-16 text-primary-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-accent">Ведическая нумерология</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">Янтра вашей судьбы</h1>
          <p className="mx-auto mt-5 max-w-xl text-base opacity-85">
            Введите дату рождения — и получите точный расчёт 16 чисел матрицы и личный разбор, который можно сохранить в цвете или в чёрно-белом варианте для печати.
          </p>
          <form onSubmit={onSubmit} className="mx-auto mt-10 grid max-w-xl gap-3 rounded-2xl bg-card p-5 text-left text-card-foreground shadow-soft md:grid-cols-[1fr_1fr_auto]">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Имя
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-3 text-base font-normal normal-case tracking-normal text-foreground outline-none focus:border-accent" />
            </label>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Дата рождения
              <input value={date} onChange={(e) => onDateInput(e.target.value)} placeholder="ДД.ММ.ГГГГ" inputMode="numeric"
                className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-3 text-base font-normal tracking-normal text-foreground outline-none focus:border-accent" />
            </label>
            <button type="submit" className="self-end rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90">
              Рассчитать
            </button>
            {error && <p className="text-sm text-destructive md:col-span-3">{error}</p>}
          </form>
        </div>
      </section>

      {result && (
        <section id="report" className="mx-auto max-w-3xl px-4 py-6">
          <div className="sticky top-0 z-20 -mx-4 mb-4 border-b border-border bg-secondary/95 px-4 py-3 backdrop-blur">
            <div className="grid grid-cols-2 gap-2">
              <button disabled={!!busy} onClick={() => download(false)} className="min-h-12 rounded-xl bg-primary px-3 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60 sm:text-base">{busy === "color" ? "Готовлю файл…" : "⬇ Скачать цветной"}</button>
              <button disabled={!!busy} onClick={() => download(true)} className="min-h-12 rounded-xl border-2 border-primary bg-card px-3 py-3 text-sm font-semibold text-primary disabled:opacity-60 sm:text-base">{busy === "bw" ? "Готовлю файл…" : "⬇ Скачать ч-б"}</button>
            </div>
            <p className="mt-1.5 text-center text-xs text-secondary-foreground">На телефоне и iPad откроется меню «Поделиться» - выберите «Заметки», «Файлы» или мессенджер.</p>
          </div>
          <div id="report-doc"><Report b={result} name={personName} /></div>
        </section>
      )}

      <footer className="no-print mx-auto max-w-4xl px-5 py-14">
        <h2 className="text-center text-3xl font-semibold text-primary">Личная консультация</h2>
        <p className="mb-6 mt-2 text-center text-sm text-muted-foreground">Оксана Шиповская — нумеролог. Напишите в удобный мессенджер.</p>
        <Contacts />
      </footer>
    </main>
  );
}
