"use client";

import { useState } from "react";

export default function AccountControls() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 10);

  async function change(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (newPin !== confirmPin) {
      setMsg({ ok: false, text: "The new PINs do not match." });
      return;
    }
    setBusy(true);
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change", currentPin, newPin }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) {
      setMsg({ ok: false, text: data.error ?? "Could not change the PIN." });
      return;
    }
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
    setMsg({ ok: true, text: "PIN changed." });
  }

  async function signOut() {
    await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    window.location.href = "/admin/login";
  }

  return (
    <div style={{ maxWidth: 360, display: "flex", flexDirection: "column", gap: 28 }}>
      <form onSubmit={change} className="gladmin-form" style={{ gap: 14 }}>
        <div>
          <label htmlFor="currentPin" className="gladmin-label">Current PIN</label>
          <input
            id="currentPin"
            className="gladmin-input"
            style={{ fontVariantNumeric: "tabular-nums" }}
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={currentPin}
            onChange={(e) => setCurrentPin(digits(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="newPin" className="gladmin-label">New PIN</label>
          <input
            id="newPin"
            className="gladmin-input"
            style={{ fontVariantNumeric: "tabular-nums" }}
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={newPin}
            onChange={(e) => setNewPin(digits(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="confirmPin" className="gladmin-label">Confirm New PIN</label>
          <input
            id="confirmPin"
            className="gladmin-input"
            style={{ fontVariantNumeric: "tabular-nums" }}
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(digits(e.target.value))}
          />
        </div>
        {msg && (
          <p
            role="alert"
            className="gladmin-notes"
            style={{ borderLeft: `3px solid ${msg.ok ? "var(--a-green)" : "var(--a-red)"}` }}
          >
            {msg.text}
          </p>
        )}
        <div>
          <button
            type="submit"
            className="gladmin-btn"
            disabled={busy || currentPin.length < 4 || newPin.length < 4}
            style={busy || currentPin.length < 4 || newPin.length < 4 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
          >
            {busy ? "Saving\u2026" : "Change PIN"}
          </button>
        </div>
      </form>

      <div>
        <button onClick={signOut} className="gladmin-btn-ghost">Sign Out On This Device</button>
      </div>
    </div>
  );
}
