const $ = (id) => document.getElementById(id);
const DEFAULTS = { enabled: true, mode: 'always', ignoreTop: 0 };

chrome.storage.sync.get(DEFAULTS).then((s) => {
  $('enabled').checked = s.enabled;
  $('mode').value = s.mode;
  $('ignoreTop').value = s.ignoreTop;
});

$('enabled').addEventListener('change', (e) => {
  chrome.storage.sync.set({ enabled: e.target.checked });
});

$('mode').addEventListener('change', (e) => {
  chrome.storage.sync.set({ mode: e.target.value });
});

$('ignoreTop').addEventListener('change', (e) => {
  const n = Math.max(0, Math.min(50000, Number(e.target.value) || 0));
  e.target.value = n;
  chrome.storage.sync.set({ ignoreTop: n });
});
