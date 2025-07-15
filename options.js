const MAX_SITES = 5;
const DEFAULT_CHECK_INTERVAL = 60;
const DEFAULT_TIMEOUT = 5;
const DEFAULT_RETRIES = 2;

const siteConfigsDiv = document.getElementById('site-configs');
const addSiteBtn = document.getElementById('add-site');

// Add click handler for the Add Site button
addSiteBtn.addEventListener('click', () => {
    if (siteConfigsDiv.children.length >= MAX_SITES) {
        alert('Maximum number of sites reached (5)');
        return;
    }
    createSiteConfig();
});

function createSiteConfig(config = {}) {
    const { url = '', name = '', interval = DEFAULT_CHECK_INTERVAL, timeout = DEFAULT_TIMEOUT, retries = DEFAULT_RETRIES } = config;
    
    const siteDiv = document.createElement('div');
    siteDiv.className = 'site-config';
    
    siteDiv.innerHTML = `
        <button type="button" class="remove-site" aria-label="Remove site">×</button>
        <div class="site-row">
            <div class="site-inputs">
                <input type="text" class="name-input" value="${name}" placeholder="Monitor Name" required>
                <input type="url" class="url-input" value="${url}" placeholder="https://example.com" required>
            </div>
            <div class="site-settings">
                <label>
                    Check every
                    <input type="number" class="interval" value="${interval}" min="30" max="3600">
                    <span>seconds</span>
                </label>
                <label>
                    Timeout after
                    <input type="number" class="timeout" value="${timeout}" min="1" max="30">
                    <span>seconds</span>
                </label>
                <label>
                    Retry
                    <input type="number" class="retries" value="${retries}" min="0" max="5">
                    <span>times</span>
                </label>
            </div>
        </div>
    `;
    
    // Add remove button handler
    siteDiv.querySelector('.remove-site').addEventListener('click', () => {
        siteDiv.remove();
        updateAddButton();
    });
    
    siteConfigsDiv.appendChild(siteDiv);
    updateAddButton();
}

function updateAddButton() {
  addSiteBtn.disabled = siteConfigsDiv.children.length >= MAX_SITES;
}

async function load() {
  const { sites = [] } = await chrome.storage.sync.get('sites');
  sites.forEach(site => createSiteConfig(site));
  updateAddButton();
}

async function save(e) {
  e.preventDefault();    const sites = [...siteConfigsDiv.children].map(wrapper => {
    const url = wrapper.querySelector('.url-input').value.trim();
    const name = wrapper.querySelector('.name-input').value.trim() || url.replace(/^https?:\/\//, '');
    const interval = parseInt(wrapper.querySelector('.interval').value, 10);
    const timeout = parseInt(wrapper.querySelector('.timeout').value, 10);
    const retries = parseInt(wrapper.querySelector('.retries').value, 10);

    if (!url) return null;

    // Validate inputs
    if (interval < 30 || interval > 3600) {
      throw new Error(`Invalid interval for ${url}: must be between 30 and 3600 seconds`);
    }
    if (timeout < 1 || timeout > 30) {
      throw new Error(`Invalid timeout for ${url}: must be between 1 and 30 seconds`);
    }
    if (retries < 0 || retries > 5) {
      throw new Error(`Invalid retries for ${url}: must be between 0 and 5`);
    }

    return { url, name, interval, timeout, retries };
  }).filter(Boolean);

  try {
    await chrome.storage.sync.set({ sites });
    
    // Notify background script of updated settings
    chrome.runtime.sendMessage({ 
      type: 'updateSettings',
      sites
    });

    alert('Settings saved successfully!');
  } catch (error) {
    alert(`Error saving settings: ${error.message}`);
  }
}

document.getElementById('form').addEventListener('submit', save);
load();