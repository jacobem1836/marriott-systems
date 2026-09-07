// Homepage hero terminal — types through the page's own CTA copy
// (see [data-terminal-lines] in index.astro). Loaded as a plain same-origin
// <script src> so it satisfies a `script-src 'self'` CSP with no inline
// exception required.
(function () {
  var CHAR_DELAY_MS = 45;
  var LINE_PAUSE_MS = 1900;

  var container = document.querySelector("[data-terminal-lines]");
  if (!container) return;

  var textEl = container.querySelector("[data-terminal-text]");
  if (!textEl) return;

  var lines = [];
  try {
    lines = JSON.parse(container.getAttribute("data-terminal-lines") || "[]");
  } catch (e) {
    lines = [];
  }
  if (!lines.length) return;

  var timer = null;
  var lineIndex = 0;
  var charIndex = 0;

  var reducedMotionQuery =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  function isReducedMotion() {
    return Boolean(reducedMotionQuery && reducedMotionQuery.matches);
  }

  function typeChar() {
    var line = lines[lineIndex];
    if (charIndex <= line.length) {
      textEl.textContent = line.slice(0, charIndex);
      charIndex += 1;
      timer = window.setTimeout(typeChar, CHAR_DELAY_MS);
    } else {
      timer = window.setTimeout(function () {
        lineIndex = (lineIndex + 1) % lines.length;
        charIndex = 0;
        typeChar();
      }, LINE_PAUSE_MS);
    }
  }

  function stop() {
    window.clearTimeout(timer);
    timer = null;
  }

  function sync() {
    if (isReducedMotion()) {
      stop();
      textEl.textContent = lines[0];
    } else if (!timer) {
      lineIndex = 0;
      charIndex = 0;
      typeChar();
    }
  }

  sync();

  if (reducedMotionQuery && reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", sync);
  }
})();
