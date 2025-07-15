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
      const { latestResults = [], lastChecked = 0 } =
        await chrome.runtime.sendMessage({ type: 'getStatus' }) || {};
  
      const list = document.getElementById('list');
      list.innerHTML = '';
  
      if (!latestResults.length) {
        document.getElementById('none').hidden = false;
        document.getElementById('time').textContent = '';
        return;
      }
  
      document.getElementById('none').hidden = true;
  
      latestResults.forEach(r => {
        const row = document.createElement('div'); row.className = 'row';
  
        const dot = document.createElement('span'); dot.className = 'dot';
        dot.style.background = colour(r.status);
  
        const url = document.createElement('span'); url.className = 'url';
        url.textContent = r.url.replace(/^https?:\/\//, '');
  
        const ms  = document.createElement('span'); ms.className = 'ms';
        ms.textContent = fmtMs(r.ms);
  
        row.append(dot, url, ms);
        list.appendChild(row);
      });
  
      const t = new Date(lastChecked);
      document.getElementById('time').textContent =
        `Last check ${t.toLocaleTimeString()}`;
    } catch (error) {
      console.error('Failed to get status:', error);
      document.getElementById('none').hidden = false;
      document.getElementById('none').textContent = 'Failed to load data';
      document.getElementById('time').textContent = '';
    }
  }
  
  document.addEventListener('DOMContentLoaded', render);