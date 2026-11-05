import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Download } from "lucide-react";
import { getAccess } from "@/lib/access.functions";
import { generateYantraReport } from "@/lib/yantra.functions";
import type { YantraReportData } from "@/lib/yantra-report-types";
import { downloadReport } from "@/lib/download";
import { AccountBar } from "./AccountBar";
import { YantraReport } from "./YantraReport";
import { Button } from "@/components/ui/button";

export function YantraCalculator() {
  const fetchAccess = useServerFn(getAccess);
  const createReport = useServerFn(generateYantraReport);
  const access = useQuery({ queryKey: ["access"], queryFn: () => fetchAccess() });
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [problem, setProblem] = useState("");
  const [personName, setPersonName] = useState("");
  const [data, setData] = useState<YantraReportData | null>(null);
  const [error, setError] = useState("");
  const [calculating, setCalculating] = useState(false);
  const [busy, setBusy] = useState<"color" | "bw" | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const match = date.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!match) { setError("Введите дату в формате ДД.ММ.ГГГГ"); return; }
    setError(""); setCalculating(true);
    try {
      const next = await createReport({ data: { day: Number(match[1]), month: Number(match[2]), year: Number(match[3]), ...(problem === "" ? {} : { problem: Number(problem) }) } });
      setData(next); setPersonName(name.trim());
      setTimeout(() => document.getElementById("yantra-report")?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось составить разбор"); }
    finally { setCalculating(false); }
  }

  async function download(bw: boolean) {
    if (!data || busy) return;
    setBusy(bw ? "bw" : "color"); setError("");
    try {
      const current = await fetchAccess();
      const element = document.getElementById("report-doc");
      if (!current.allowed || !element) throw new Error("Доступ закрыт");
      const { day, month, year } = data.y.date;
      await downloadReport(element, `${personName || "Разбор"} ${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year} Янтра${bw ? " (ч-б)" : ""}`, bw);
    } catch (e) { setError(e instanceof Error ? e.message : "Не удалось сохранить файл"); }
    finally { setBusy(null); }
  }

  if (access.isPending) return <p className="p-6 text-center text-muted-foreground">Проверяю доступ…</p>;
  return <main className="min-h-screen bg-background text-foreground">
    <AccountBar owner={access.data?.owner ?? false} expires={access.data?.access?.expires_at} />
    {!access.data?.allowed ? <div className="mx-auto max-w-xl px-5 py-20 text-center"><h1 className="text-3xl text-primary">Доступ закрыт</h1><p className="mt-3">{access.isError ? "Не удалось проверить доступ. Обновите страницу." : "Обратитесь к владельцу для продления доступа."}</p></div> : <>
      <section className="mx-auto max-w-3xl px-4 pb-7 pt-8 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Личный разбор</p>
        <h1 className="mt-2 text-5xl font-semibold text-primary">Код Янтры</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-sm font-semibold">Имя клиента<input value={name} onChange={e => setName(e.target.value)} maxLength={100} placeholder="Имя" className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-3 font-normal outline-none focus:border-accent" /></label>
          <label className="text-sm font-semibold">Дата рождения<input value={date} onChange={e => { const digits = e.target.value.replace(/\D/g, "").slice(0, 8); setDate([digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join(".")); }} inputMode="numeric" placeholder="ДД.ММ.ГГГГ" className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-3 font-normal outline-none focus:border-accent" /></label>
          <Button type="submit" disabled={calculating} className="min-h-12 self-end px-5">{calculating ? "Составляю…" : "Создать разбор"}</Button>
          <label className="text-sm font-semibold sm:col-span-2">Число проблем (если известно)<input type="number" min={0} max={9} step={1} value={problem} onChange={e => setProblem(e.target.value)} placeholder="Не указано" className="mt-2 w-full rounded-lg border border-input bg-card px-3 py-3 font-normal outline-none focus:border-accent" /></label>
        </form>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </section>
      {data && <section id="yantra-report" className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
        <div className="sticky top-0 z-20 mb-4 grid grid-cols-2 gap-2 border-y border-border bg-background/95 py-3 backdrop-blur">
          <Button onClick={() => download(false)} disabled={busy !== null} className="min-h-12 px-2 text-sm"><Download className="size-4 shrink-0" />{busy === "color" ? "Готовлю…" : "Скачать цветной"}</Button>
          <Button onClick={() => download(true)} variant="outline" disabled={busy !== null} className="min-h-12 px-2 text-sm"><Download className="size-4 shrink-0" />{busy === "bw" ? "Готовлю…" : "Скачать ч-б"}</Button>
        </div>
        <div id="report-doc"><YantraReport data={data} name={personName} /></div>
      </section>}
    </>}
  </main>;
}