"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";

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

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-forest px-6"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="w-full max-w-[320px]">
        <div className="flex justify-center">
          <Image src="/brand/logo.png" alt="Green Line Lawn Care" width={644} height={366} className="h-16 w-auto" priority />
        </div>

        <p className="mt-6 text-center text-[0.72rem] font-bold uppercase tracking-[0.16em] text-lime-br">
          Admin
        </p>
        <h1 className="mt-1 text-center text-xl font-bold text-white">Enter your PIN</h1>

        {/* PIN dots */}
        <div className="mt-6 flex items-center justify-center gap-3" aria-live="polite" aria-label={`${pin.length} digits entered`}>
          {Array.from({ length: slots }).map((_, i) => (
            <span
              key={i}
              className={`h-3.5 w-3.5 rounded-full border-2 ${i < pin.length ? "border-lime bg-lime" : "border-white/35"}`}
            />
          ))}
        </div>

        {error ? (
          <p className="mt-4 text-center text-[0.9rem] font-semibold text-lime-br" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-4 h-[1.35rem]" />
        )}

        {/* Keypad */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => push(k)}
              className="flex h-16 items-center justify-center rounded-md bg-white/10 text-2xl font-bold text-white active:bg-white/20"
            >
              {k}
            </button>
          ))}
          <button
            type="button"
            onClick={back}
            aria-label="Delete last digit"
            className="flex h-16 items-center justify-center rounded-md text-lg font-semibold text-white/80 active:bg-white/10"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => push("0")}
            className="flex h-16 items-center justify-center rounded-md bg-white/10 text-2xl font-bold text-white active:bg-white/20"
          >
            0
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={pin.length < 4 || busy}
            className="flex h-16 items-center justify-center rounded-md bg-lime text-lg font-bold text-ink disabled:opacity-40"
          >
            {busy ? "..." : "Enter"}
          </button>
        </div>

        <p className="mt-6 text-center text-[0.8rem] text-mute-d">
          Five wrong attempts locks sign-in for 15 minutes.
        </p>
      </div>
    </div>
  );
}
