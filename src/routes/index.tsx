import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { calculateYantra, isValidDate, type YantraResult, type PositionKey } from "@/lib/numerology";
import { POSITIONS, NUMBERS, zeroText, negativeText, CONTACTS } from "@/lib/texts";

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

function meaning(key: PositionKey | "integral" | "vector" | "expression", n: number, title: string) {
  if (n === 0) return zeroText(title);
  if (n < 0) return negativeText(title, n);
  return NUMBERS[n].s[key as Exclude<PositionKey, "character">];
}

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
  const [result, setResult] = useState<YantraResult | null>(null);
  const [personName, setPersonName] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const m = date.trim().match(/^(\d{1,2})[.\/-](\d{1,2})[.\/-](\d{4})$/);
    if (!m) return setError("Введите дату в формате ДД.ММ.ГГГГ, например 06.03.2002");
    const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
    if (!isValidDate(d, mo, y)) return setError("Такой даты не существует. Проверьте день, месяц и год.");
    setError("");
    setPersonName(name.trim());
    setResult(calculateYantra(d, mo, y));
    setTimeout(() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function print(bw: boolean) {
    const root = document.documentElement;
    root.classList.toggle("bw", bw);
    const done = () => { root.classList.remove("bw"); window.removeEventListener("afterprint", done); };
    window.addEventListener("afterprint", done);
    setTimeout(() => window.print(), 50);
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

      {result && <Report r={result} name={personName} onPrint={print} />}

      <footer className="no-print mx-auto max-w-4xl px-5 py-14">
        <h2 className="text-center text-3xl font-semibold text-primary">Личная консультация</h2>
        <p className="mb-6 mt-2 text-center text-sm text-muted-foreground">Оксана Шиповская — нумеролог. Напишите в удобный мессенджер.</p>
        <Contacts />
      </footer>
    </main>
  );
}

function Report({ r, name, onPrint }: { r: YantraResult; name: string; onPrint: (bw: boolean) => void }) {
  const dateStr = `${String(r.date.day).padStart(2, "0")}.${String(r.date.month).padStart(2, "0")}.${r.date.year}`;
  const ch = NUMBERS[r.matrix.character];

  return (
    <section id="report" className="mx-auto max-w-4xl px-5 py-12">
      <div className="no-print mb-8 flex flex-col gap-3 rounded-2xl border border-border bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-secondary-foreground">Сохраните разбор в PDF: в окне печати выберите «Сохранить как PDF».</p>
        <div className="flex gap-2">
          <button onClick={() => onPrint(false)} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Цветной PDF</button>
          <button onClick={() => onPrint(true)} className="rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary">Чёрно-белый PDF</button>
        </div>
      </div>

      <header className="report-section rounded-2xl border-2 border-gold bg-card p-6 text-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Личный разбор · Янтра</p>
        <h2 className="mt-2 text-4xl font-semibold text-primary md:text-5xl">{name || "Ваша матрица"}</h2>
        <p className="mt-1 text-lg">{dateStr}</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[["Интеграл", r.integral], ["Вектор жизни", r.vector], ["Число экспрессии", r.expression]].map(([l, v]) => (
            <div key={l as string} className="rounded-xl border border-border p-3">
              <div className="text-xs text-muted-foreground">{l}</div>
              <div className="font-display text-4xl font-semibold text-primary">{v}</div>
            </div>
          ))}
        </div>
      </header>

      <div className="report-section mt-6 grid grid-cols-4 overflow-hidden rounded-2xl border-2 border-gold">
        {r.grid.map((k, i) => (
          <div key={k} className="flex min-h-24 flex-col justify-between border border-border bg-card p-2 sm:p-3">
            <div className="text-[10px] leading-tight text-muted-foreground sm:text-xs">{i + 1}. {POSITIONS[k].title}</div>
            <div className="text-right font-display text-3xl font-semibold text-primary sm:text-4xl">{r.matrix[k]}</div>
          </div>
        ))}
      </div>

      <article className="report-section mt-10">
        <h3 className="text-3xl font-semibold text-primary">Характер {r.matrix.character} · {ch.name}</h3>
        <p className="text-sm text-muted-foreground">Управитель — {ch.planet}. {POSITIONS.character.about}</p>
        <p className="mt-3 leading-relaxed">{ch.essence}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <div className="font-semibold text-primary">Сильные стороны</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{ch.plus.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
          <div className="rounded-xl border border-border p-4">
            <div className="font-semibold text-primary">Где теряется энергия</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{ch.minus.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        </div>
        <p className="mt-4 border-l-4 border-gold pl-4 italic">{ch.advice}</p>
      </article>

      {r.grid.filter((k) => k !== "character").map((k) => {
        const n = r.matrix[k];
        return (
          <article key={k} className="report-section mt-8 border-t border-border pt-6">
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-semibold text-gold">{n}</span>
              <h3 className="text-2xl font-semibold text-primary">{POSITIONS[k].title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{POSITIONS[k].about}</p>
            <p className="mt-2 leading-relaxed">{meaning(k, n, POSITIONS[k].title)}</p>
          </article>
        );
      })}

      {([["integral", "Интеграл", r.integral], ["vector", "Вектор жизни", r.vector], ["expression", "Число экспрессии", r.expression]] as const).map(([k, t, n]) => (
        <article key={k} className="report-section mt-8 border-t border-border pt-6">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold text-gold">{n}</span>
            <h3 className="text-2xl font-semibold text-primary">{t}</h3>
          </div>
          <p className="mt-2 leading-relaxed">{meaning(k, n, t)}</p>
        </article>
      ))}

      <div className="report-section mt-12 rounded-2xl border-2 border-gold p-6">
        <h3 className="text-center text-2xl font-semibold text-primary">Подробная консультация</h3>
        <p className="mb-4 mt-1 text-center text-sm text-muted-foreground">Оксана Шиповская, нумеролог</p>
        <Contacts compact />
      </div>
    </section>
  );
}
