import type { ReactNode } from "react";
import type { BasicReport } from "@/lib/numerology";
import type { Section } from "@/lib/report-types";
import { MIND, PATH, DHARMA, YEAR, KEYS, FLAT, MONEY } from "@/lib/report-texts";

function Paras({ text }: { text: string | string[] }) {
  const list = Array.isArray(text) ? text : text.split(/\n\n+/);
  return <>{list.map((p, i) => <p key={i} className="mt-1.5 leading-snug">{p}</p>)}</>;
}

function Block({ s }: { s: Section }) {
  return (
    <div className="avoid mt-3">
      <h4 className="font-semibold text-primary">{s.title}</h4>
      {s.text && <Paras text={s.text} />}
      {s.items && (
        <ul className="mt-1 space-y-0.5">
          {s.items.map((it, i) => (
            <li key={i} className="flex gap-2 leading-snug">
              <span className="shrink-0 text-gold">{s.check ? "✔" : "•"}</span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Part({ title, short, children, first }: { title: string; short: ReactNode; children: ReactNode; first?: boolean }) {
  return (
    <section className={`${first ? "" : "page-break "}pt-2`}>
      <h2 className="avoid border-b-2 border-gold pb-1 text-center text-3xl font-semibold text-primary">{title}</h2>
      <div className="avoid mt-3 rounded-xl bg-secondary px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Краткое описание</div>
        {short}
      </div>
      <div className="mt-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Полный разбор</div>
      {children}
    </section>
  );
}

export function Report({ b, name }: { b: BasicReport; name: string }) {
  const dateStr = `${String(b.date.day).padStart(2, "0")}.${String(b.date.month).padStart(2, "0")}.${b.date.year}`;
  const m = MIND[b.mind]!, p = PATH[b.path]!, d = DHARMA[b.dharma]!, y = YEAR[b.cycle]!, k = KEYS[b.mind]!;
  const rows: [string, string | number][] = [
    ["Дата рождения", dateStr], ["Число Ума", b.mind], ["Число Жизненного Пути", b.path],
    ["Дхарма", b.dharma], [`Цикл Жизни (${b.cycleYear})`, b.cycle], ["Финансовый Код", b.finCode],
  ];

  return (
    <div className="report-body bg-background text-[15px] text-foreground">
      <section className="avoid rounded-2xl border-2 border-gold bg-card p-5">
        <p className="text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">Личный разбор</p>
        <h1 className="mt-1 text-center text-4xl font-semibold text-primary">{name || "Ваш разбор"}</h1>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {rows.map(([l, v]) => (
            <div key={l} className="rounded-lg border border-border px-3 py-2">
              <div className="text-xs text-muted-foreground">{l}</div>
              <div className="font-display text-2xl font-semibold text-primary">{v}</div>
            </div>
          ))}
        </div>
      </section>

      <Part first title={`Число Ума - ${b.mind}`} short={<>
        <p className="mt-1 font-semibold">Число ума {b.mind} (рождённые {m.born})</p>
        <Block s={{ title: "Основные черты", items: m.short, check: true }} />
        <Block s={{ title: "Кармическая задача", text: m.karmicShort }} />
      </>}>
        <h3 className="mt-2 text-xl font-semibold text-primary">ЧИСЛО УМА {b.mind} - {m.headline}</h3>
        <Paras text={m.full} />
        <p className="avoid mt-2 border-l-4 border-gold pl-3 italic">{m.keyTheme}</p>
        {m.sections.map((s) => <Block key={s.title} s={s} />)}
      </Part>

      <Part title={`Число Жизненного Пути - ${b.path}`} short={<>
        <p className="mt-1 leading-snug">Число Жизненного Пути отражает основные черты личности, жизненные цели и задачи. Это путь, которым стоит идти, чтобы обрести гармонию и реализовать потенциал. К 32 годам и 7 месяцам ЧЖП раскрывается полностью.</p>
        <p className="mt-2 font-semibold">{p.short}</p>
      </>}>
        <Paras text={p.full} />
        {p.sections.map((s) => <Block key={s.title} s={s} />)}
      </Part>

      <Part title={`Дхарма - ${b.dharma}`} short={<>
        <p className="mt-1 leading-snug">Дхарма - внутренний долг души, её предназначение: этапы, поступки и события, которые ведут к духовному росту и улучшают качество жизни.</p>
        <p className="mt-2 font-semibold">{d.short}</p>
      </>}>
        <Paras text={d.full} />
        {d.sections.map((s) => <Block key={s.title} s={s} />)}
      </Part>

      <Part title={`Цикл Жизни - ${b.cycle}`} short={<>
        <p className="mt-1 font-semibold">{y.short}</p>
        <p className="mt-1 leading-snug"><span className="font-semibold">Совет года:</span> {y.advice}</p>
      </>}>
        <h3 className="mt-2 text-xl font-semibold text-primary">ЛИЧНЫЙ ЦИКЛ {b.cycle}: {y.headline}</h3>
        {y.sections.map((s) => <Block key={s.title} s={s} />)}
      </Part>

      <Part title={`Ключи Успеха - ${b.mind}`} short={
        <p className="mt-1 leading-snug">Дни недели, цвета, камни и числа, которые усиливают вашу энергию, привлекают удачу и гармонию.</p>
      }>
        <div className="avoid mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
          {([["Рождённые", m.born], ["Управитель", k.planet], ["Благоприятный день", k.day], ["Цвет удачи", k.color],
            ["Камень", k.stone], ["Металл", k.metal], ["Сильный период", k.strong], ["Слабый период", k.weak],
            ["Благоприятные цифры", k.good], ["Нейтральные цифры", k.neutral]] as const).map(([l, v]) => (
            <p key={l} className={`leading-snug ${l === "Управитель" ? "sm:col-span-2" : ""}`}><span className="font-semibold text-primary">{l}:</span> {v}</p>
          ))}
        </div>
        <Block s={{ title: "Влияние номера дома или квартиры", text: "Сложите цифры номера, пока не получится одна цифра (например, 245 → 2+4+5 = 11 → 1+1 = 2). Число раскрывает характер пространства и его влияние на вас." }} />
        <div className="mt-1 space-y-1">
          {Object.entries(FLAT).map(([n, t]) => <p key={n} className="avoid leading-snug"><span className="font-display text-lg font-semibold text-gold">{n}</span> - {t}</p>)}
        </div>
      </Part>

      <Part title={`Финансовый код - ${b.finCode}`} short={<>
        <p className="mt-1 leading-snug">Финансовый код - комбинация чисел, которая помогает привлечь денежную удачу. Его можно использовать как пин-код телефона или карты, записать и хранить в кошельке.</p>
        <p className="mt-1 leading-snug">Главное правило: код работает в тандеме с вашими действиями. Развитие и готовность прилагать усилия усиливают его влияние.</p>
      </>}>
        {[...new Set(b.finCode.split(""))].map((c) => {
          const md = MONEY[Number(c)]!;
          return <Block key={c} s={{ title: `${c} - ${md.title}`, text: md.text }} />;
        })}
      </Part>
    </div>
  );
}
