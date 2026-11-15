# Publishing guide

One package (`tools/package.ps1` → `dist/word-rank-hover-v*.zip`) works for all
stores. The extension targets Chromium (Chrome, Edge, Brave) via Manifest V3.

> **Payments from Russia:** both store registrations charge a small one-time fee
> ($5 Chrome, ~$19 Microsoft) by card, and cards issued in Russia are rejected.
> You will need a foreign card (or a colleague/friend abroad) for signup.
> GitHub publishing is free — you can publish the repo and a downloadable zip
> there first, and submit to the stores afterwards.

## 1. GitHub (free, do this first)

```powershell
cd C:\Dev\word-rank-hover
powershell -File tools\package.ps1        # sanity-check the zip builds
```

1. Create a **public** repository `word-rank-hover` under your account.
2. Push the local repo (already committed locally):
   ```powershell
   git remote add origin https://github.com/chealex-ya/word-rank-hover.git
   git push -u origin master
   ```
3. Add topics: `chrome-extension`, `english`, `vocabulary`, `frequency`, `edtech`.
4. Create a Release (`v1.2.0`) and attach `dist/word-rank-hover-v1.2.0.zip` so
   anyone can install it unpacked before store approval.

## 2. Chrome Web Store (Chrome + Brave + Opera)

Dashboard: <https://chrome.google.com/webstore/devconsole> (one-time $5 fee)

1. **New item** → upload `dist/word-rank-hover-v<version>.zip`.
2. **Store listing** tab: paste fields from [store/listing-en.md](store/listing-en.md)
   (add `store/listing-ru.md` as a second language: Listing → add language → русский).
   Upload `icons/icon128.png` and screenshots from `docs/screenshots/`
   (1280×800, at least 1, up to 5).
3. **Privacy** tab:
   - Single purpose: text in listing-en.md.
   - Data disclosures: check **nothing** — the extension sells no data, uses no
     analytics, no remote code.
   - Justifications for permissions: text in listing-en.md.
4. **Distribution**: all regions, no ads, not featured anywhere special.
5. Submit for review. First review typically takes **1–7 days**; updates a bit less.
   Every new upload must have a higher `version` in `manifest.json`.

## 3. Microsoft store (Edge)

Edge extensions are published through Microsoft Partner Center:
<https://partner.microsoft.com/dashboard/microsoftedge> (account registration
may require a one-time fee and identity verification).

1. **Create extension** → upload the same zip.
2. Paste the same listing fields (English; Russian optional second language).
3. Review usually takes **up to a week**. Version must increase on updates.

## 4. After each release

1. Bump `version` in `manifest.json`, update the changelog in README.
2. `powershell -File tools\package.ps1`
3. Commit, push, upload the new zip to each store, add a GitHub Release.

## Screenshot regeneration

`store/demo.html` is a staged page using the extension's real chip styles and
real ranks. Headless capture (or just open it and press Win+Shift+S):

```powershell
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" `
  --headless=new --disable-gpu --window-size=1280,800 `
  --screenshot="C:\Dev\word-rank-hover\docs\screenshots\screenshot-1.png" `
  "file:///C:/Dev/word-rank-hover/store/demo.html"
```
