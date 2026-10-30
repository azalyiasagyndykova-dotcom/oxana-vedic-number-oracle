// Сохранение разбора в PDF прямо в файл (без окна печати).
// На телефонах и iPad открывается меню «Поделиться» (Заметки, Файлы, мессенджеры), на компьютере — обычная загрузка.
export async function downloadReport(el: HTMLElement, fileName: string, bw: boolean) {
  const html2pdf = (await import("html2pdf.js")).default;
  const root = document.documentElement;
  if (bw) root.classList.add("bw");
  root.classList.add("pdf-mode");
  try {
    const blob: Blob = await html2pdf()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .set({
        margin: [10, 10, 10, 10],
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, windowWidth: 760, backgroundColor: getComputedStyle(document.body).backgroundColor },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"], before: ".page-break", avoid: ".avoid" },
      } as any)
      .from(el)
      .outputPdf("blob");
    const file = new File([blob], `${fileName}.pdf`, { type: "application/pdf" });
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: fileName }); return; }
      catch (e) { if ((e as Error).name === "AbortError") return; }
    }
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url; a.download = file.name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  } finally {
    root.classList.remove("bw", "pdf-mode");
  }
}
