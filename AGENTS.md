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

- Numerology formulas live only in src/lib/numerology.ts and are covered by src/test/numerology.test.ts; interpretation texts live in src/lib/texts.ts — keeps math verifiable separately from copy.
- Printable report uses window.print with a `.bw` class on <html> that swaps tokens to black-and-white — one layout serves both colour and B/W PDFs.
