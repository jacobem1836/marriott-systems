// Audit checkout buttons — same-origin external script so it satisfies a
// `script-src 'self'` CSP with no inline-script exception required.
(function () {
  function initAuditButtons() {
    var buttons = document.querySelectorAll('[id^="buy-audit-btn"]');
    buttons.forEach(function (btn) {
      btn.addEventListener("click", async function () {
        btn.disabled = true;
        btn.textContent = "redirecting…";

        var leadId = btn.dataset.leadId || "";
        var payload = {};
        if (leadId) payload.lead_id = leadId;

        try {
          var res = await fetch("/api/create-checkout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          var data = await res.json();
          if (data.url) {
            window.location.href = data.url;
          } else {
            btn.textContent = "something went wrong – try again";
            btn.disabled = false;
          }
        } catch (e) {
          btn.textContent = "something went wrong – try again";
          btn.disabled = false;
        }
      });
    });
  }

  initAuditButtons();
})();
