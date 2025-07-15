function colour(status) {
    return {
      ok:    '#4caf50',
      flaky: '#ff9800',
      down:  '#f44336'
    }[status] || '#9e9e9e';
  }
  
  function fmtMs(n) {
    return n == null ? '—' : `${n} ms`;
  }
  
  async function render() {
    try {
      // Get status from background script
      const response = await chrome.runtime.sendMessage({ type: 'getStatus' });
      const { latestResults = [], lastChecked = 0 } = response || {};
  
      const list = document.getElementById('list');
      list.innerHTML = '';
  
      if (!latestResults || !latestResults.length) {
        document.getElementById('none').hidden = false;
        document.getElementById('time').textContent = '';
        return;
      }
  
      document.getElementById('none').hidden = true;
  
      latestResults.forEach(result => {
        const row = document.createElement('div'); 
        row.className = 'row';
  
        const dot = document.createElement('span'); 
        dot.className = 'dot';
        dot.style.background = colour(result.status);
  
        const siteName = document.createElement('span'); 
        siteName.className = 'url';
        siteName.textContent = result.name;
        siteName.title = result.url; // Show full URL on hover
  
        const ms = document.createElement('span'); 
        ms.className = 'ms';
        ms.textContent = fmtMs(result.ms);
  
        row.append(dot, siteName, ms);
        list.appendChild(row);
      });
  
      if (lastChecked) {
        const t = new Date(lastChecked);
        document.getElementById('time').textContent = `Last check ${t.toLocaleTimeString()}`;
      } else {
        document.getElementById('time').textContent = '';
      }
    } catch (error) {
      console.error('Failed to get status:', error);
      document.getElementById('none').hidden = false;
      document.getElementById('none').textContent = 'Failed to load data';
      document.getElementById('time').textContent = '';
    }
  }
  
  document.addEventListener('DOMContentLoaded', render);