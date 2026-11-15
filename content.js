// Word Rank Hover — shows the frequency rank of the English word under the cursor.
// Data: data/en_ranks.txt ("word rank" per line, 1 = most frequent; OpenSubtitles 2018 top-50k).
(() => {
  'use strict';

  const DEFAULTS = { enabled: true, mode: 'always', ignoreTop: 0 };
  const DWELL_MS = 150;

  // Traffic-light bands: green = learn it (everyday), yellow = optional, red = rare.
  const GREEN_MAX = 5000;
  const YELLOW_MAX = 10000;

  let settings = { ...DEFAULTS };
  let rankMap = null;
  let loadStarted = false;

  let tooltip = null;
  let shownWord = null;
  let timer = 0;

  // ---------- settings ----------

  chrome.storage.sync.get(DEFAULTS).then((stored) => {
    settings = { ...DEFAULTS, ...stored };
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    for (const key of Object.keys(DEFAULTS)) {
      if (changes[key]) settings[key] = changes[key].newValue;
    }
    if (!settings.enabled) hide();
  });

  // ---------- data ----------

  function ensureData() {
    if (loadStarted) return;
    loadStarted = true;
    fetch(chrome.runtime.getURL('data/en_ranks.txt'))
      .then((r) => r.text())
      .then((text) => {
        const map = new Map();
        for (const line of text.split('\n')) {
          const sp = line.lastIndexOf(' ');
          if (sp > 0) map.set(line.slice(0, sp), Number(line.slice(sp + 1)));
        }
        rankMap = map;
      })
      .catch((err) => {
        loadStarted = false; // allow a retry on the next hover
        console.warn('[WordRank] could not load word list:', err);
      });
  }

  // The OpenSubtitles tokenizer stored contractions without the apostrophe
  // ("don't" -> "don"), so fall back: exact, apostrophe-free, then prefix.
  function lookup(word) {
    if (!rankMap) return undefined;
    let r = rankMap.get(word);
    if (r !== undefined) return r;
    const noApos = word.replace(/'/g, '');
    if (noApos) {
      r = rankMap.get(noApos);
      if (r !== undefined) return r;
    }
    const cut = word.indexOf("'");
    return cut > 0 ? rankMap.get(word.slice(0, cut)) : undefined;
  }

  // ---------- hover tracking ----------

  let lastEvent = null;
  let raf = 0;

  window.addEventListener('mousemove', (e) => {
    lastEvent = e;
    if (!raf) raf = requestAnimationFrame(onFrame);
  }, { passive: true, capture: true });

  window.addEventListener('scroll', hide, { passive: true });
  window.addEventListener('blur', hide);
  window.addEventListener('mouseout', (e) => {
    if (!e.relatedTarget) hide(); // cursor left the page or entered an iframe
  });

  function onFrame() {
    raf = 0;
    const e = lastEvent;
    if (!e) return;
    if (!settings.enabled) return hide();
    if (settings.mode === 'alt' && !e.altKey) return hide();

    ensureData();
    const word = wordAt(e.clientX, e.clientY);
    if (!word) return hide();
    const rank = lookup(word);
    if (rank !== undefined && rank <= settings.ignoreTop) return hide();

    if (word === shownWord && tooltip && tooltip.style.display !== 'none') {
      place(e.clientX, e.clientY); // still on the same word: just follow the cursor
      return;
    }

    clearTimeout(timer);
    hide();
    const x = e.clientX;
    const y = e.clientY;
    timer = setTimeout(() => show(word, x, y), DWELL_MS);
  }

  // ---------- tooltip ----------

  function show(word, x, y) {
    ensureTooltip();
    const rank = lookup(word);
    tooltip.textContent = rank === undefined
      ? (rankMap ? '>50k' : '…')
      : rank.toLocaleString('en-US');

    let band = '';
    if (rank !== undefined) {
      band = rank <= GREEN_MAX ? 'wrh-green' : rank <= YELLOW_MAX ? 'wrh-yellow' : 'wrh-red';
    } else if (rankMap) {
      band = 'wrh-red'; // outside the top 50k — rarest of all
    }
    tooltip.className = `wrh-tooltip${band ? ' ' + band : ''}`;

    tooltip.style.display = 'block';
    shownWord = word;
    place(x, y);
  }

  function hide() {
    clearTimeout(timer);
    shownWord = null;
    if (tooltip) tooltip.style.display = 'none';
  }

  function ensureTooltip() {
    if (tooltip && tooltip.isConnected) return;
    tooltip = document.createElement('div');
    tooltip.className = 'wrh-tooltip';
    (document.body || document.documentElement).appendChild(tooltip);
  }

  function place(x, y) {
    const rect = tooltip.getBoundingClientRect();
    let tx = x + 14;
    let ty = y + 18;
    if (tx + rect.width > window.innerWidth - 8) tx = x - rect.width - 14;
    if (ty + rect.height > window.innerHeight - 8) ty = y - rect.height - 14;
    tooltip.style.left = `${Math.max(8, tx)}px`;
    tooltip.style.top = `${Math.max(8, ty)}px`;
  }

  // ---------- word under the cursor ----------

  function wordAt(x, y) {
    let node = null;
    let offset = -1;
    if (typeof document.caretRangeFromPoint === 'function') {
      const range = document.caretRangeFromPoint(x, y);
      if (range) { node = range.startContainer; offset = range.startOffset; }
    } else if (typeof document.caretPositionFromPoint === 'function') {
      const pos = document.caretPositionFromPoint(x, y);
      if (pos) { node = pos.offsetNode; offset = pos.offset; }
    }
    if (!node || node.nodeType !== Node.TEXT_NODE) return null;
    const text = node.nodeValue;
    if (!text) return null;

    const isWordChar = (ch) =>
      (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === "'" || ch === '’';

    let start = offset;
    let end = offset;
    while (start > 0 && isWordChar(text[start - 1])) start--;
    while (end < text.length && isWordChar(text[end])) end++;
    if (start === end && offset > 0 && isWordChar(text[offset - 1])) {
      // The caret can land just after the word's last letter.
      start = offset - 1;
      end = offset;
      while (start > 0 && isWordChar(text[start - 1])) start--;
      while (end < text.length && isWordChar(text[end])) end++;
    }
    if (start >= end) return null;

    // The cursor must be within the word's own rectangle (not past the line's end).
    try {
      const r = document.createRange();
      r.setStart(node, start);
      r.setEnd(node, end);
      const rect = r.getBoundingClientRect();
      if (x < rect.left - 1 || x > rect.right + 1 || y < rect.top - 1 || y > rect.bottom + 1) return null;
    } catch {
      return null;
    }

    let word = text.slice(start, end).replace(/’/g, "'").toLowerCase();
    word = word.replace(/^'+|'+$/g, '');
    return /^[a-z]+(?:'[a-z]+)?$/.test(word) ? word : null;
  }
})();
