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

- Numerology formulas live only in src/lib/numerology.ts and are covered by src/test/numerology.test.ts; mind/path/dharma/year copy shown in the report comes from styled_*.ts (restyled from sample.ts + source.ts, which stay as the meaning reference with provenance in sources.json), wired through index.ts — keeps math separate from copy; keys, flat and money stay source-only: omit unavailable success keys and financial digits absent from the sample come from money_extra.ts; dharma copy uses the book (source.ts) + sample, not the restyled file.
- PDF download renders #report-doc with html2canvas-pro + jsPDF (src/lib/download.ts), cutting pages only between text lines; a `.bw` class on <html> swaps tokens to black-and-white; touch devices get the share sheet — real file, named after client, no print dialog.
- Private report copy is loaded only inside generateReport's authenticated handler after a database entitlement check; Report receives a selected copy DTO, never imports the full text catalog. This prevents shipping paid report content to signed-out visitors.
- Account roles live in user_roles with a single-owner unique index; clients are provisioned through owner-checked server functions. Expiry is checked at request time, without scheduled polling jobs.
- Owner password changes use the Auth user endpoint with the middleware-verified bearer and current password after the role check; sessionless server clients cannot call auth.updateUser.
- First owner activation uses only the visitor's chosen email/password while no owner exists; no configured credential fallback or activation code is permitted, and the single-owner unique index closes setup permanently afterwards.
- New success reference PDFs override only supplied keys fields in success-materials.ts, preserving planet and any other source-backed fields; fasting dates are separate from lucky numbers.
