const STORAGE_KEY = 'autoFitEnabled';

const toggle = document.getElementById('toggle');
const status = document.getElementById('status');

function render(enabled) {
  toggle.checked = enabled;
  status.textContent = `自動調整: ${enabled ? 'オン' : 'オフ'}`;
}

chrome.storage.local.get({ [STORAGE_KEY]: true }, (result) => {
  render(result[STORAGE_KEY]);
});

toggle.addEventListener('change', () => {
  chrome.storage.local.set({ [STORAGE_KEY]: toggle.checked });
  render(toggle.checked);
});
