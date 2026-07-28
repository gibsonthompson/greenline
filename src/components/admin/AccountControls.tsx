"use client";

import { useState } from "react";

type Msg = { ok: boolean; text: string } | null;

export default function AccountControls() {
  // Change PIN (replaces all PINs)
  const [curPin, setCurPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [changeMsg, setChangeMsg] = useState<Msg>(null);
  const [changeBusy, setChangeBusy] = useState(false);

  // Add PIN (keeps existing PINs)
  const [addCur, setAddCur] = useState("");
  const [addNew, setAddNew] = useState("");
  const [addLabel, setAddLabel] = useState("");
  const [addMsg, setAddMsg] = useState<Msg>(null);
  const [addBusy, setAddBusy] = useState(false);

  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 10);

  async function change(e: React.FormEvent) {
    e.preventDefault();
    setChangeMsg(null);
    if (newPin !== confirmPin) {
      setChangeMsg({ ok: false, text: "The new PINs do not match." });
      return;
    }
    setChangeBusy(true);
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "change", currentPin: curPin, newPin }),
    });
    const data = await res.json().catch(() => ({}));
    setChangeBusy(false);
    if (!res.ok) {
      setChangeMsg({ ok: false, text: data.error ?? "Could not change the PIN." });
      return;
    }
    setCurPin("");
    setNewPin("");
    setConfirmPin("");
    setChangeMsg({ ok: true, text: "PIN changed. This is now the only PIN." });
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setAddMsg(null);
    setAddBusy(true);
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add", currentPin: addCur, newPin: addNew, label: addLabel || "PIN" }),
    });
    const data = await res.json().catch(() => ({}));
    setAddBusy(false);
    if (!res.ok) {
      setAddMsg({ ok: false, text: data.error ?? "Could not add the PIN." });
      return;
    }
    setAddCur("");
    setAddNew("");
    setAddLabel("");
    setAddMsg({ ok: true, text: "PIN added. Both the existing PIN and this one now work." });
  }

  async function signOut() {
    await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => {});
    window.location.href = "/admin/login";
  }

  const note = (m: Msg) =>
    m && (
      <p
        role="alert"
        className="gladmin-notes"
        style={{ borderLeft: `3px solid ${m.ok ? "var(--a-green)" : "var(--a-red)"}` }}
      >
        {m.text}
      </p>
    );

  return (
    <div style={{ maxWidth: 400, display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Add an additional PIN, keeping existing ones */}
      <form onSubmit={add} className="gladmin-form" style={{ gap: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Add A PIN</div>
        <p style={{ fontSize: 12.5, color: "var(--a-mute)", marginTop: -6 }}>
          Adds a second PIN without removing the current one. Both will work. Use this to give
          yourself a login while keeping the existing PIN active.
        </p>
        <div>
          <label htmlFor="addCur" className="gladmin-label">Current PIN</label>
          <input id="addCur" className="gladmin-input" type="password" inputMode="numeric" autoComplete="off"
            value={addCur} onChange={(e) => setAddCur(digits(e.target.value))} />
        </div>
        <div>
          <label htmlFor="addLabel" className="gladmin-label">Label (optional)</label>
          <input id="addLabel" className="gladmin-input" type="text" maxLength={40} placeholder="Owner, Helper, etc."
            value={addLabel} onChange={(e) => setAddLabel(e.target.value)} />
        </div>
        <div>
          <label htmlFor="addNew" className="gladmin-label">New PIN</label>
          <input id="addNew" className="gladmin-input" type="password" inputMode="numeric" autoComplete="new-password"
            value={addNew} onChange={(e) => setAddNew(digits(e.target.value))} />
        </div>
        {note(addMsg)}
        <div>
          <button type="submit" className="gladmin-btn" disabled={addBusy || addCur.length < 4 || addNew.length < 4}
            style={addBusy || addCur.length < 4 || addNew.length < 4 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
            {addBusy ? "Adding\u2026" : "Add PIN"}
          </button>
        </div>
      </form>

      <div style={{ height: 1, background: "var(--a-line)" }} />

      {/* Change PIN, replacing all PINs */}
      <form onSubmit={change} className="gladmin-form" style={{ gap: 14 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Change PIN</div>
        <p style={{ fontSize: 12.5, color: "var(--a-mute)", marginTop: -6 }}>
          Replaces every PIN with a single new one. Any other PINs stop working.
        </p>
        <div>
          <label htmlFor="curPin" className="gladmin-label">Current PIN</label>
          <input id="curPin" className="gladmin-input" type="password" inputMode="numeric" autoComplete="current-password"
            value={curPin} onChange={(e) => setCurPin(digits(e.target.value))} />
        </div>
        <div>
          <label htmlFor="newPin" className="gladmin-label">New PIN</label>
          <input id="newPin" className="gladmin-input" type="password" inputMode="numeric" autoComplete="new-password"
            value={newPin} onChange={(e) => setNewPin(digits(e.target.value))} />
        </div>
        <div>
          <label htmlFor="confirmPin" className="gladmin-label">Confirm New PIN</label>
          <input id="confirmPin" className="gladmin-input" type="password" inputMode="numeric" autoComplete="new-password"
            value={confirmPin} onChange={(e) => setConfirmPin(digits(e.target.value))} />
        </div>
        {note(changeMsg)}
        <div>
          <button type="submit" className="gladmin-btn" disabled={changeBusy || curPin.length < 4 || newPin.length < 4}
            style={changeBusy || curPin.length < 4 || newPin.length < 4 ? { opacity: 0.5, cursor: "not-allowed" } : undefined}>
            {changeBusy ? "Saving\u2026" : "Change PIN"}
          </button>
        </div>
      </form>

      <div style={{ height: 1, background: "var(--a-line)" }} />

      <div>
        <button onClick={signOut} className="gladmin-btn-ghost">Sign Out On This Device</button>
      </div>
    </div>
  );
}
