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
    <div className="mt-4 max-w-sm space-y-8">
      <form onSubmit={change} className="space-y-3">
        <div>
          <label htmlFor="currentPin" className="mb-1 block font-semibold">Current PIN</label>
          <input
            id="currentPin"
            className="field tabular-nums"
            type="password"
            inputMode="numeric"
            autoComplete="current-password"
            value={currentPin}
            onChange={(e) => setCurrentPin(digits(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="newPin" className="mb-1 block font-semibold">New PIN</label>
          <input
            id="newPin"
            className="field tabular-nums"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={newPin}
            onChange={(e) => setNewPin(digits(e.target.value))}
          />
        </div>
        <div>
          <label htmlFor="confirmPin" className="mb-1 block font-semibold">Confirm new PIN</label>
          <input
            id="confirmPin"
            className="field tabular-nums"
            type="password"
            inputMode="numeric"
            autoComplete="new-password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(digits(e.target.value))}
          />
        </div>
        {msg && (
          <p className={`t-sm border-l-4 bg-paper-2 p-3 ${msg.ok ? "border-green" : "border-ink"}`} role="alert">
            {msg.text}
          </p>
        )}
        <button type="submit" className="btn btn-p btn-inline" disabled={busy || currentPin.length < 4 || newPin.length < 4}>
          {busy ? "Saving\u2026" : "Change PIN"}
        </button>
      </form>

      <div>
        <button onClick={signOut} className="btn btn-ol btn-inline">Sign out on this device</button>
      </div>
    </div>
  );
}
