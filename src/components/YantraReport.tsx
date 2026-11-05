import type { YantraReportData } from "@/lib/yantra-report-types";
import { YANTRA_TITLES } from "@/lib/yantra-report-types";

const GRID_LABELS = ["Подход", "Характер", "Метод", "Карма", "Прана", "Отношения", "Расходы", "Коммуникация", "Сиддхи", "Счастье", "Задачи", "Любовь", "Самореализация", "Забота", "Возможности", "Философия"];

const SECTION_LABELS: Record<YantraReportData["sections"][number]["key"], readonly [string, string, string]> = {
  approach: ["Как ты входишь в новое", "Что помогает начать", "Что гасит твой запал"],
  character: ["Твоя суть и суперсила", "Как быть собой", "Когда сила мешает тебе"],
  method: ["Как ты действуешь", "Твой рабочий ритм", "Что тормозит результат"],
  karma: ["Как ты встречаешь мир", "На что опереться", "Где начинается лишняя борьба"],
  prana: ["От чего ты оживаешь", "Как возвращать силы", "Что тебя опустошает"],
  relations: ["Как ты ведёшь себя с близкими", "Что укрепляет связь", "Что отдаляет вас"],
  expense: ["Куда уходят твои ресурсы", "Как тратить в свою пользу", "Где ты отдаёшь лишнее"],
  communication: ["Как звучит твой голос", "Что помогает понять друг друга", "Где теряется контакт"],
  siddhi: ["Твоя природная сила", "Как раскрыть талант", "Что оставляет его в тени"],
  happiness: ["Что даёт тебе вкус к жизни", "Как впустить больше радости", "Что делает жизнь пресной"],
  tasks: ["В чём тебе пора вырасти", "Что стоит попробовать иначе", "Что держит в старом сценарии"],
  love: ["Как ты проживаешь близость", "Что делает любовь живой", "Что мешает быть рядом"],
  income: ["Как ты проявляешь себя в деле", "Что поддерживает твой доход", "Где твой труд обесценивается"],
  care: ["Как ты выражаешь заботу", "Как дать тепло и сохранить себя", "Когда помощь становится тяжёлой"],
  opportunities: ["Где тебе становится просторнее", "Как открываться новому", "Что сужает твой выбор"],
  philosophy: ["На чём держится твой взгляд на жизнь", "Как укрепить внутреннюю опору", "Когда убеждения становятся клеткой"],
  integral: ["Главная нить твоего разбора", "Как собрать себя в целое", "Что сбивает с твоего пути"],
};

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="mt-3">
    <h3 className="text-xs font-semibold uppercase tracking-widest text-gold">{label}</h3>
    <div className="mt-1 leading-relaxed">{children}</div>
  </div>;
}

export function YantraReport({ data, name }: { data: YantraReportData; name: string }) {
  const { y, sections } = data;
  const date = `${String(y.date.day).padStart(2, "0")}.${String(y.date.month).padStart(2, "0")}.${y.date.year}`;
  return <article data-report="yantra" className="report-body bg-background text-[15px] text-foreground">
    <section className="avoid-cell rounded-2xl border-2 border-gold bg-card p-5">
      <p className="text-center text-xs uppercase tracking-[0.35em] text-muted-foreground">Код Янтры</p>
      <h1 className="mt-1 break-words text-center text-4xl font-semibold text-primary">{name || "Твой разбор"}</h1>
      <p className="mt-1 text-center text-muted-foreground">{date}</p>
    </section>
    <div className="mt-4 grid grid-cols-4 gap-2" aria-label="Матрица Янтры">
      {y.grid.map((key, index) => <div key={key} className="avoid-cell flex min-h-20 min-w-0 flex-col justify-between rounded-lg border border-border bg-card px-2 py-2">
        <span className="block break-words text-[11px] leading-tight text-muted-foreground">{index + 1}. {GRID_LABELS[index]}</span>
        <span className="mt-1 block font-display text-3xl font-semibold leading-none text-primary">{y.matrix[key]}</span>
      </div>)}
    </div>
    <div className="mt-2 grid grid-cols-2 gap-2">
      {[["Вектор жизни", y.vector], ["Интеграл", y.integral]].map(([title, value]) => <div key={title} className="avoid-cell rounded-lg border border-gold bg-secondary px-2 py-2 text-center">
        <p className="text-xs text-muted-foreground">{title}</p><p className="font-display text-2xl font-semibold leading-tight text-primary">{value}</p>
      </div>)}
    </div>
    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">Янтра — символический способ посмотреть на свои привычки и выборы, а не научная оценка личности или прогноз. Бери то, что помогает тебе в реальной жизни.</p>
    {sections.map(({ key, title, value, meaning }) => <section key={key} className="mt-6">
      <h2 className="border-b-2 border-gold pb-1 text-center text-2xl font-semibold text-primary">{title} · {value}{key === "integral" ? ` (ЧЖП ${y.base.lifePath})` : ""}</h2>
      {meaning?.blocks ? <div className="mt-3 space-y-4">
        {meaning.blocks.map((block, index) => <div key={block.title} className={index === 0 ? "rounded-lg border border-border bg-secondary px-4 py-3" : "px-1"}>
          <h3 className="font-sans text-base font-semibold text-primary">{block.title}</h3>
          {block.paragraphs?.map(paragraph => <p key={paragraph} className="mt-2 leading-relaxed">{paragraph}</p>)}
          {block.items && <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed marker:text-gold">{block.items.map(item => <li key={item}>{item}</li>)}</ul>}
        </div>)}
      </div> : meaning ? <>
        <div className="mt-3 rounded-xl bg-secondary px-4 py-3">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{SECTION_LABELS[key][0]}</h3>
          <p className="mt-1 leading-relaxed">{meaning.essence}</p>
        </div>
        <div className="px-1">
          <Block label={SECTION_LABELS[key][1]}><p>{meaning.energy}</p></Block>
          <Block label={SECTION_LABELS[key][2]}><p className="border-l-4 border-gold pl-3">{meaning.flags}</p></Block>
          <Block label="Бери и делай">
            <ol className="list-none space-y-1">{meaning.actions.map((action, i) => <li key={action} className="flex gap-2"><span className="shrink-0 font-semibold text-gold">{i + 1}.</span><span>{action}</span></li>)}</ol>
          </Block>
        </div>
      </> : <p className="mt-3 rounded-xl bg-secondary px-4 py-3 leading-relaxed text-muted-foreground">Для этого значения в разделе «{YANTRA_TITLES[key]}» пока нет проверенной трактовки в материалах разбора. Число рассчитано; описание не заменяем догадками.</p>}
    </section>)}
  </article>;
}
