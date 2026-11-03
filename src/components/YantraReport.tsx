import type { YantraReportData } from "@/lib/yantra-report-types";
import { YANTRA_TITLES } from "@/lib/yantra-report-types";

const GRID_LABELS = ["Подход", "Характер", "Метод", "Ты и мир", "Энергия", "Близкие", "Расходы", "Общение", "Таланты", "Счастье", "Задачи", "Любовь", "Доход", "Забота", "Возможности", "Философия"];

export function YantraReport({ data, name }: { data: YantraReportData; name: string }) {
  const { y, sections } = data;
  const date = `${String(y.date.day).padStart(2, "0")}.${String(y.date.month).padStart(2, "0")}.${y.date.year}`;
  return <article className="report-body bg-background text-[15px] text-foreground">
    <header className="border-b-2 border-gold pb-5 pt-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Личный разбор по Янтре</p>
      <h1 className="mt-2 break-words text-4xl font-semibold text-primary">{name || "Твой Код Янтры"}</h1>
      <p className="mt-2 text-muted-foreground">{date}</p>
    </header>
    <div className="mt-5 grid grid-cols-4 border-l border-t border-border" aria-label="Матрица Янтры">
      {y.grid.map((key, index) => <div key={key} className="avoid-cell flex min-h-24 min-w-0 flex-col justify-between border-b border-r border-border p-2 sm:p-3">
        <span className="break-words text-[11px] leading-tight text-muted-foreground sm:text-xs">{index + 1}. {GRID_LABELS[index]}</span>
        <span className="font-display text-3xl font-semibold text-primary">{y.matrix[key]}</span>
      </div>)}
    </div>
    <div className="mt-3 grid grid-cols-3 gap-2">
      {[["Интеграл", y.integral], ["Вектор", y.vector], ["Экспрессия", y.expression]].map(([title, value]) => <div key={title} className="avoid-cell border-b border-gold py-2 text-center">
        <p className="text-xs text-muted-foreground">{title}</p><p className="font-display text-2xl font-semibold text-primary">{value}</p>
      </div>)}
    </div>
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Янтра — символический способ посмотреть на свои привычки и выборы, а не научная оценка личности или прогноз. Бери то, что помогает тебе в реальной жизни.</p>
    {sections.map(({ key, title, value, meaning }) => <section key={key} className="mt-6">
      <h2 className="border-b border-gold pb-1 text-2xl font-semibold text-primary">{title} · {value}</h2>
      {meaning ? <>
        <h3 className="mt-3 text-lg font-semibold text-primary">Твоя суперсила</h3>
        <p className="mt-1 leading-relaxed">{meaning.essence}</p>
        <h3 className="mt-3 text-lg font-semibold text-primary">Где твои деньги и энергия</h3>
        <p className="mt-1 leading-relaxed">{meaning.energy}</p>
        <h3 className="mt-3 text-lg font-semibold text-primary">Красные флаги</h3>
        <p className="mt-1 leading-relaxed">{meaning.flags}</p>
        <h3 className="mt-3 text-lg font-semibold text-primary">Бери и делай</h3>
        <ol className="mt-1 space-y-1">{meaning.actions.map((action, i) => <li key={action} className="flex gap-2 leading-relaxed"><span className="shrink-0 font-semibold text-gold">{i + 1}.</span><span>{action}</span></li>)}</ol>
      </> : <p className="mt-2 leading-relaxed text-muted-foreground">В новой книге нет отдельной трактовки для этого значения в разделе «{YANTRA_TITLES[key]}». Число рассчитано; описание не заменяем догадками.</p>}
    </section>)}
  </article>;
}