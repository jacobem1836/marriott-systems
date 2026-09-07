// Scroll-reveal engine. Loaded as a plain same-origin <script src>, so it
// satisfies a `script-src 'self'` CSP with no inline-script exception required.
//
// Progressive enhancement contract: [data-reveal] elements render fully
// visible by default (see global.css). The hidden→visible transition is only
// armed once this script actually runs and adds `.js-reveal` to <html> below
// — if the script is blocked, slow, or errors out before that line, content
// simply stays visible. A safety timeout also force-reveals anything still
// hidden after ~3s, covering a hung/slow IntersectionObserver.
(function () {
  var root = document.documentElement;
  root.classList.add("js-reveal");

  var reducedMotionQuery =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");

  var revealObserver = null;

  function setupReveals() {
    var elements = document.querySelectorAll("[data-reveal]");

    if (revealObserver) {
      revealObserver.disconnect();
      revealObserver = null;
    }

    if (reducedMotionQuery && reducedMotionQuery.matches) {
      root.classList.remove("js-reveal-armed");
      elements.forEach(function (el) {
        el.dataset.revealed = "1";
      });
      return;
    }

    root.classList.add("js-reveal-armed");
    revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.dataset.revealed = "1";
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    var viewportHeight = window.innerHeight || 900;
    elements.forEach(function (el) {
      if (el.dataset.revealed) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < viewportHeight * 0.94 && rect.bottom > 0) {
        el.dataset.revealed = "1";
      } else {
        revealObserver.observe(el);
      }
    });
  }

  // Safety net: never leave content permanently hidden, even if the
  // IntersectionObserver above hangs or something upstream never fires.
  window.setTimeout(function () {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      if (!el.dataset.revealed) el.dataset.revealed = "1";
    });
  }, 3000);

  if (reducedMotionQuery && reducedMotionQuery.addEventListener) {
    reducedMotionQuery.addEventListener("change", setupReveals);
  }

  setupReveals();
})();
