const MAX_SITES = 5;
const DEFAULT_CHECK_INTERVAL = 60; // seconds
const DEFAULT_TIMEOUT = 5; // seconds
const DEFAULT_RETRIES = 2;

let monitoredSites = [];
let latestResults = [];
let lastChecked = 0;
let siteTimers = new Map();

async function loadSettings() {
  const { sites = [] } = await chrome.storage.sync.get(['sites']);
  monitoredSites = sites;
  
  // Clear any existing timers
  for (const timer of siteTimers.values()) {
    clearTimeout(timer);
  }
  siteTimers.clear();
  
  // Set up individual timers for each site
  sites.forEach(site => {
    const interval = site.interval || DEFAULT_CHECK_INTERVAL;
    checkSite(site);  // Initial check
    // Schedule next check based on site's interval
    siteTimers.set(site.url, setInterval(() => checkSite(site), interval * 1000));
  });
  
  return { sites };
}

chrome.runtime.onInstalled.addListener(async () => {
  // Load settings and kick-off the first run immediately
  await loadSettings();
  checkAllSites();
  // Then start periodic checks - run every minute as baseline
  chrome.alarms.create('sentinel', { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'sentinel') checkAllSites();
});

async function pingSite(url, retryCount = 3, timeout = 5000) {
    for (let attempt = 1; attempt <= retryCount; attempt++) {
        try {
            const startTime = Date.now();
            const response = await Promise.race([
                fetch(url, { mode: 'no-cors' }),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Timeout')), timeout)
                )
            ]);
            
            const duration = Date.now() - startTime;
            return { 
                status: 'ok', 
                ms: duration, 
                attempts: attempt 
            };
        } catch (error) {
            if (attempt === retryCount) {
                return { 
                    status: 'down', 
                    ms: null, 
                    error: error.message 
                };
            }
            // Wait 2 seconds before retry
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

async function checkAllSites() {
  // Clear any existing timers
  siteTimers.forEach(timer => clearTimeout(timer));
  siteTimers.clear();

  // Store the results and timestamp
  latestResults = await Promise.all(monitoredSites.map(async (site) => {
    const result = await pingSite(site.url, site.retries + 1, site.timeout * 1000);
    
    // Schedule next check for this specific site
    siteTimers.set(site.url, setTimeout(() => {
      checkSite(site);
    }, site.interval * 1000));
    
    return { ...result, url: site.url, name: site.name };
  }));
  
  lastChecked = Date.now();
  updateBadge();
}

async function checkSite(site) {
  const result = await pingSite(site.url, site.retries + 1, site.timeout * 1000);
  
  // Update this site's result in latestResults
  latestResults = latestResults.map(r => 
    r.url === site.url ? { ...result, url: site.url } : r
  );
  
  lastChecked = Date.now();
  updateBadge();
  
  // Schedule next check for this site
  siteTimers.set(site.url, setTimeout(() => {
    checkSite(site);
  }, site.interval * 1000));
}

function updateBadge() {
  let colour = 'green';
  if (latestResults.some(r => r.status === 'down')) {
    colour = 'red';
  } else if (latestResults.some(r => r.attempts > 1)) {
    colour = 'amber';
  }

  const badgeColours = {
    green: [76, 175, 80, 255],
    amber: [255, 152, 0, 255],
    red:   [244, 67, 54, 255]
  };

  chrome.action.setBadgeBackgroundColor({ color: badgeColours[colour] });
  chrome.action.setBadgeText({ text: '●' });
  chrome.action.setIcon({
    path: {
      "16": `icons/16/${colour}.png`,
      "32": `icons/32/${colour}.png`,
      "48": `icons/48/${colour}.png`,
      "128": `icons/128/${colour}.png`
    }
  });
}

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'getStatus') {
    // Send the current status immediately
    sendResponse({
      latestResults: latestResults.map(result => ({
        ...result,
        name: monitoredSites.find(site => site.url === result.url)?.name || result.url.replace(/^https?:\/\//, '')
      })),
      lastChecked
    });
  } else if (message.type === 'updateSettings') {
    loadSettings()
      .then(() => sendResponse({ success: true }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Will respond asynchronously
  }
});