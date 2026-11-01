// Сохранение разбора в PDF прямо в файл (без окна печати).
// На телефонах и iPad открывается меню «Поделиться» (Заметки, Файлы, мессенджеры), на компьютере — обычная загрузка.
const WIDTH = 720; // ширина листа при рендере, px

/** Безопасные места разреза: границы, не проходящие через строки текста и карточки. */
function layout(el: HTMLElement) {
  const top = el.getBoundingClientRect().top;
  const atoms = [...el.querySelectorAll<HTMLElement>("p, li, h1, h2, h3, h4, .avoid-cell")].map((n) => {
    const r = n.getBoundingClientRect();
    // заголовок держим вместе с началом следующего текста
    const keep = /^H[1-4]$/.test(n.tagName) ? 90 : 0;
    return [r.top - top, r.bottom - top + keep] as const;
  });
  // разделы идут подряд без принудительных разрывов — без пустых полустраниц
  const forced: number[] = [];
  return { atoms, forced };
}

function cuts(total: number, pageH: number, atoms: readonly (readonly [number, number])[], forced: number[]) {
  const res: number[] = [];
  let start = 0;
  while (total - start > pageH) {
    let y = start + pageH;
    const f = forced.find((v) => v > start + 40 && v <= y);
    if (f !== undefined) y = f - 4;
    else {
      for (let guard = 0; guard < 200; guard++) {
        const hit = atoms.find(([a, b]) => a < y && b > y);
        if (!hit) break;
        y = hit[0] - 2;
      }
      if (y <= start + pageH * 0.4) y = start + pageH;
    }
    res.push(y);
    start = y;
  }
  return res;
}

export async function downloadReport(el: HTMLElement, fileName: string, bw: boolean) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
  const root = document.documentElement;
  if (bw) root.classList.add("bw");
  root.classList.add("pdf-mode");
  try {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const { atoms, forced } = layout(el);
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.fillStyle = getComputedStyle(document.body).backgroundColor;
    probe.fillRect(0, 0, 1, 1);
    const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
    const bg = `rgb(${r}, ${g}, ${b})`;
    const scale = 2;
    const canvas = await html2canvas(el, { scale, backgroundColor: bg, windowWidth: document.documentElement.clientWidth });
    const pdf = new jsPDF({ unit: "mm", format: "a4" });
    const margin = 10, pw = 210 - margin * 2, ph = 297 - margin * 2;
    const pxPerMm = WIDTH / pw;
    const pageH = ph * pxPerMm;
    const total = canvas.height / scale;
    const breaks = [0, ...cuts(total, pageH, atoms, forced), total];
    for (let i = 0; i < breaks.length - 1; i++) {
      const y0 = breaks[i]!, h = breaks[i + 1]! - y0;
      const part = document.createElement("canvas");
      part.width = canvas.width; part.height = Math.ceil(h * scale);
      const ctx = part.getContext("2d")!;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, part.width, part.height);
      ctx.drawImage(canvas, 0, -Math.floor(y0 * scale));
      if (i > 0) pdf.addPage();
      pdf.setFillColor(r!, g!, b!); pdf.rect(0, 0, 210, 297, "F");
      pdf.addImage(part.toDataURL("image/jpeg", 0.92), "JPEG", margin, margin, pw, h / pxPerMm);
    }
    const file = new File([pdf.output("blob")], `${fileName}.pdf`, { type: "application/pdf" });
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
