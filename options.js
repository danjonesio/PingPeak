const MAX_SITES = 5;
const inputsDiv = document.getElementById('inputs');

// Build input boxes
for (let i = 0; i < MAX_SITES; i++) {
  const input = document.createElement('input');
  input.type = 'url';
  input.placeholder = `https://example${i+1}.com`;
  inputsDiv.appendChild(input);
}

async function load() {
  const { urls = [] } = await chrome.storage.sync.get('urls');
  urls.forEach((u, i) => inputsDiv.children[i].value = u);
}

async function save(e) {
  e.preventDefault();
  const urls = [...inputsDiv.children]
               .map(inp => inp.value.trim())
               .filter(Boolean)
               .slice(0, MAX_SITES);
  await chrome.storage.sync.set({ urls });
  alert('Saved!');
}

document.getElementById('form').addEventListener('submit', save);
load();