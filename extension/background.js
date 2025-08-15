let activeTab = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const newTab = await chrome.tabs.get(activeInfo.tabId);
  logTime(activeTab, Date.now() - startTime);
  activeTab = newTab;
  startTime = Date.now();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === 'complete') {
    logTime(activeTab, Date.now() - startTime);
    activeTab = tab;
    startTime = Date.now();
  }
});

function logTime(tab, duration) {
  if (!tab || !tab.url) return;
  const hostname = new URL(tab.url).hostname;

  fetch('http://localhost:5000/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hostname, duration })
  });
}

