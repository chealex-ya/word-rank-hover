// Word Rank Hover — background service worker (badge + toggle command)

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== 'toggle-wordrank') return;
  const { enabled } = await chrome.storage.sync.get({ enabled: true });
  await chrome.storage.sync.set({ enabled: !enabled });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && changes.enabled) refreshBadge();
});

chrome.runtime.onInstalled.addListener(refreshBadge);
chrome.runtime.onStartup.addListener(refreshBadge);
refreshBadge();

async function refreshBadge() {
  const { enabled } = await chrome.storage.sync.get({ enabled: true });
  await chrome.action.setBadgeBackgroundColor({ color: enabled ? '#4f46e5' : '#6b7280' });
  await chrome.action.setBadgeText({ text: enabled ? 'ON' : 'OFF' });
}
