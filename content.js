(() => {
  const STORAGE_KEY = 'autoFitEnabled';
  const MIN_RATIO = 0.1;

  let enabled = true;
  let debounceTimer = null;

  function computeFitRatio() {
    // Reset first so the measurement isn't skewed by a zoom level we applied ourselves.
    document.documentElement.style.zoom = '';
    const contentWidth = document.documentElement.scrollWidth;
    const viewportWidth = window.innerWidth;
    if (contentWidth <= viewportWidth) return 1;
    return Math.max(viewportWidth / contentWidth, MIN_RATIO);
  }

  function applyFit() {
    if (!enabled) {
      document.documentElement.style.zoom = '';
      return;
    }
    const ratio = computeFitRatio();
    document.documentElement.style.zoom = ratio < 1 ? String(ratio) : '';
  }

  function scheduleApplyFit() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(applyFit, 200);
  }

  const observer = new MutationObserver(scheduleApplyFit);

  function start() {
    applyFit();
    window.addEventListener('resize', scheduleApplyFit);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  chrome.storage.local.get({ [STORAGE_KEY]: true }, (result) => {
    enabled = result[STORAGE_KEY];
    start();
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'local' || !(STORAGE_KEY in changes)) return;
    enabled = changes[STORAGE_KEY].newValue;
    applyFit();
  });
})();
