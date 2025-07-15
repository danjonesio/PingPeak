const MAX_SITES      = 5;
const checkInterval  = 60 * 1000; // 1 minute
const retries        = 2;         // first try + 2 extra = 3 attempts total
const timeoutMs      = 5000;

let latestResults = [];
let lastChecked = 0;

chrome.runtime.onInstalled.addListener(() => {
  // Kick-off the first run immediately
  checkAllSites();
  // Then every minute
  chrome.alarms.create('sentinel', { periodInMinutes: checkInterval / 60000 });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'sentinel') checkAllSites();
});

async function fetchWithTimeout(url) {
  return Promise.race([
    fetch(url, { mode: 'no-cors' }),                 // we only need success/fail
    new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), timeoutMs))
  ]);
}

async function pingSite(url) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
        const t0 = performance.now();
        await fetchWithTimeout(url);
        const ms = Math.round(performance.now() - t0);
        return { status: attempt === 0 ? 'ok' : 'flaky', ms };
    } catch (e) {
      if (attempt === retries) {
        return { status: 'down', ms: null };
      }
      // otherwise loop & retry
    }
  }
}

async function checkAllSites() {
  const { urls = [] } = await chrome.storage.sync.get('urls');
  const limited = urls.slice(0, MAX_SITES);

  // Store the results and timestamp
  latestResults = await Promise.all(limited.map(async (url) => {
    const result = await pingSite(url);
    return { ...result, url };
  }));
  lastChecked = Date.now();

  let colour = 'green';
  if (latestResults.some(r => r.status === 'down')) colour = 'red';
  else if (latestResults.some(r => r.status === 'flaky')) colour = 'amber';

  // Badge: set background colour & text
  const badgeColours = {
    green: [76, 175, 80, 255],
    amber: [255, 152, 0, 255],
    red:   [244, 67, 54, 255]
  };
  await chrome.action.setBadgeBackgroundColor({ color: badgeColours[colour] });
  await chrome.action.setBadgeText({ text: '●' }); // solid dot
  await chrome.action.setIcon({
    path: {
      "16": `icons/16/${colour}.png`,
      "32": `icons/32/${colour}.png`,
      "48": `icons/48/${colour}.png`,
      "128": `icons/128/${colour}.png`
    }
  });
}

// Update the message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getStatus') {
    sendResponse({
      latestResults,
      lastChecked
    });
    return true;
  }
});