<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Numerology formulas live only in src/lib/numerology.ts and are covered by src/test/numerology.test.ts; report interpretations use source.ts with inclusive PDF-page provenance in sources.json and sample.ts overrides through index.ts; legacy generated interpretations must not be used as fallbacks — keeps math separate from copy and prevents unsupported extrapolation; omit unavailable success keys and explicitly mark missing financial digit interpretations.
- PDF download renders #report-doc with html2canvas-pro + jsPDF (src/lib/download.ts), cutting pages only between text lines; a `.bw` class on <html> swaps tokens to black-and-white; touch devices get the share sheet — real file, named after client, no print dialog.
