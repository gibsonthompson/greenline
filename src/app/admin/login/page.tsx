"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import "@/app/admin/admin.css";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function LoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const push = useCallback((d: string) => {
    setError("");
    setPin((p) => (p.length < 10 ? p + d : p));
  }, []);

  const back = useCallback(() => {
    setError("");
    setPin((p) => p.slice(0, -1));
  }, []);

  const submit = useCallback(async () => {
    if (pin.length < 4 || busy) return;
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "login", pin }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setPin("");
      setBusy(false);
      return;
    }
    window.location.href = "/admin";
  }, [pin, busy]);

  // Hardware keyboard support for desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") push(e.key);
      else if (e.key === "Backspace") back();
      else if (e.key === "Enter") submit();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [push, back, submit]);

  const slots = Math.max(6, pin.length);

  const keyBtn: React.CSSProperties = {
    display: "flex", alignItems: "center", justifyContent: "center",
    height: 64, borderRadius: 10, border: "none", cursor: "pointer",
    background: "rgba(255,255,255,0.08)", color: "#fff",
    fontSize: 24, fontWeight: 700, fontFamily: "inherit",
  };

  return (
    <div
      className="gladmin"
      style={{
        height: "100dvh", overflow: "hidden",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        background: "#010101", padding: "0 24px",
        paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div style={{ width: "100%", maxWidth: 320 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Image src="/brand/logo.png" alt="Green Line Lawn Care" width={644} height={366} style={{ height: 64, width: "auto" }} priority />
        </div>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "var(--a-lime)" }}>
          Admin
        </p>
        <h1 style={{ marginTop: 4, textAlign: "center", fontSize: "1.25rem", fontWeight: 700, color: "#fff" }}>
          Enter your PIN
        </h1>

        {/* PIN dots */}
        <div
          style={{ marginTop: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}
          aria-live="polite"
          aria-label={`${pin.length} digits entered`}
        >
          {Array.from({ length: slots }).map((_, i) => (
            <span
              key={i}
              style={{
                height: 14, width: 14, borderRadius: "50%",
                border: `2px solid ${i < pin.length ? "var(--a-lime)" : "rgba(255,255,255,0.35)"}`,
                background: i < pin.length ? "var(--a-lime)" : "transparent",
              }}
            />
          ))}
        </div>

        {error ? (
          <p style={{ marginTop: 16, textAlign: "center", fontSize: "0.9rem", fontWeight: 600, color: "var(--a-lime)" }} role="alert">
            {error}
          </p>
        ) : (
          <p style={{ marginTop: 16, height: "1.35rem" }} />
        )}

        {/* Keypad */}
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {KEYS.map((k) => (
            <button key={k} type="button" onClick={() => push(k)} style={keyBtn}>
              {k}
            </button>
          ))}
          <button
            type="button"
            onClick={back}
            aria-label="Delete last digit"
            style={{ ...keyBtn, background: "transparent", fontSize: 18, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}
          >
            Back
          </button>
          <button type="button" onClick={() => push("0")} style={keyBtn}>
            0
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pin.length < 4 || busy}
            style={{
              ...keyBtn,
              background: "var(--a-lime)", color: "#010101", fontSize: 18,
              opacity: pin.length < 4 || busy ? 0.4 : 1,
              cursor: pin.length < 4 || busy ? "not-allowed" : "pointer",
            }}
          >
            {busy ? "..." : "Enter"}
          </button>
        </div>

        <p style={{ marginTop: 24, textAlign: "center", fontSize: "0.8rem", color: "rgba(255,255,255,0.55)" }}>
          Five wrong attempts locks sign-in for 15 minutes.
        </p>
      </div>
    </div>
  );
}
