# Word list data: source and license

`data/en_ranks.txt` is **derived data**, not original work of this project.

## Provenance chain

1. **OpenSubtitles 2018** — the original subtitle collection (opensubtitles.org),
   compiled into parallel corpora by the [OPUS](http://opus.nlpl.eu/OpenSubtitles2018.php) project.
2. **[hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords)** —
   generated `en_50k.txt`, a top-50,000 frequency list from that corpus. The repo
   states: *MIT License for code, CC BY-SA 4.0 for content.*
3. **This project** — `tools/rebuild-data.ps1` lowercased the tokens, filtered
   them to plain English words (`^[a-z']+$`), renumbered ranks 1..N, and dropped
   raw occurrence counts. Result: 46,982 lines of `word rank` pairs (~700 KB).

## What this means for you

- The word list is **CC BY-SA 4.0** content. Anyone may share and adapt it,
  **including commercially**, provided you:
  1. give appropriate credit (this file does),
  2. link the license, and
  3. share adaptations of *the list itself* under the same license
     (ShareAlike applies to the data, not to the extension code around it).
- This project's **code** is MIT (see [LICENSE](LICENSE)) — that is not
  affected by the data license.
- Precedent: [rspeer/wordfreq](https://github.com/rspeer/wordfreq) (1.8k ★)
  distributes OpenSubtitles-derived and SUBTLEX-derived data under the same
  family of terms (Apache code / CC BY-SA data) and is widely reused.

## Attribution text (short form)

> Word frequency data derived from
> [FrequencyWords](https://github.com/hermitdave/FrequencyWords)
> (OpenSubtitles 2018 corpus), licensed
> [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).

This notice is also shown in the extension's store description, in the
extension popup footer, and in the Chrome Web Store "Data disclosures" as
"packaged, non-personal content".

## Keeping ranks reproducible

To regenerate `data/en_ranks.txt`:

```powershell
# 1. download the source list
Invoke-WebRequest `
  "https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/en/en_50k.txt" `
  -OutFile en_50k.txt

# 2. rebuild
powershell -File tools\rebuild-data.ps1 -Source .\en_50k.txt
```

Only `data/en_ranks.txt` is CC BY-SA. If you replace it with a different list
(e.g. one you generate from your own corpus), this file no longer applies.
