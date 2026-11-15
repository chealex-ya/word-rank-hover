# Store listing — English (copy-paste fields)

## Name (max 45 chars)

Word Rank Hover — word frequency

## Summary (max 132 chars)

Point at any English word to instantly see how common it is — a traffic-light rank chip: everyday, optional, or rare.

## Description

**See how common any English word is — just by pointing at it.**

Word Rank Hover shows a small traffic-light chip next to any English word on any page:

- 🟢 **Green — rank 1–5,000**: everyday words you need on a daily basis. Go and learn these.
- 🟡 **Yellow — rank 5,001–10,000**: useful, but not obligatory. Pick them up if your life needs them.
- 🔴 **Red — 10,000+**: rarely in use. Don't waste your energy — let them wait.

**Why learners like it**

Reading English, you constantly meet unfamiliar words. The rank chip tells you in
a split second whether a word deserves your attention or is a literary curiosity
you may safely skip. It turns any article into a prioritized vocabulary list.

**How it works**

- Hover any word for a fraction of a second — the chip appears next to the cursor.
- The rank comes from a top-50,000 list of spoken English (OpenSubtitles 2018 corpus).
- Fully offline: the word list ships inside the extension. No network calls, no accounts, no tracking.
- Toggle it anytime with Alt+Shift+W, or show chips only while holding Alt.
- Optionally hide tooltips on the N most common words (e.g. skip "the", "and", "is").

**Privacy**

The extension collects nothing, sends nothing, and asks for no permissions
beyond saving your own preferences. All lookups happen locally in your browser.

**Credits**

Word frequency data derived from FrequencyWords (OpenSubtitles 2018 corpus),
licensed CC BY-SA 4.0. Extension code is open source (MIT):
https://github.com/chealex-ya/word-rank-hover

## Category

Education (alternative: Productivity)

## Single purpose description (Chrome Web Store)

Shows the frequency rank of English words as you hover over them while browsing.

## Permission justifications

- `storage` — saves your on/off toggle and display preferences locally.
- Content scripts on pages — needed to detect the word under your cursor and show the chip. Nothing is read or sent anywhere.
- `web_accessible_resources` (`data/en_ranks.txt`) — lets the page-context script load the packaged, public word list. It contains no personal data.

## Graphics

- Icon 128×128: `icons/icon128.png`
- Screenshots 1280×800: `docs/screenshots/` (start with screenshot-1.png)
- Small promo tile 440×280 (optional): generate later
