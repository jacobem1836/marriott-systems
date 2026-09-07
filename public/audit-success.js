// Audit success page — notes submission, same-origin external script so it
// satisfies a `script-src 'self'` CSP with no inline-script exception required.
(function () {
  var btn = document.getElementById("notes-submit-btn");
  var textarea = document.getElementById("audit-notes");
  var confirmEl = document.getElementById("notes-confirm");

  if (!btn || !textarea || !confirmEl) return;

  var sessionId = new URLSearchParams(window.location.search).get("session_id") || "";

  btn.addEventListener("click", async function () {
    var notes = textarea.value.trim();
    if (!notes) {
      confirmEl.textContent = "Add a note first.";
      return;
    }
    btn.disabled = true;
    try {
      var res = await fetch("/api/audit-notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, notes: notes }),
      });
      if (res.ok) {
        confirmEl.textContent = "Noted – it will be covered in the audit.";
        textarea.disabled = true;
      } else {
        confirmEl.textContent = "Couldn't save the note – email it instead.";
        btn.disabled = false;
      }
    } catch (e) {
      confirmEl.textContent = "Couldn't save the note – email it instead.";
      btn.disabled = false;
    }
  });
})();
