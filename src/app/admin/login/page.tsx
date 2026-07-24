"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [pinSet, setPinSet] = useState<boolean | null>(null);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const first = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setPinSet(Boolean(d.pinSet)))
      .catch(() => setPinSet(true));
  }, []);

  useEffect(() => {
    if (pinSet !== null) first.current?.focus();
  }, [pinSet]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const setup = pinSet === false;
    if (setup && pin !== confirmPin) {
      setError("The two PINs do not match.");
      setBusy(false);
      return;
    }
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: setup ? "setup" : "login", pin }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error ?? "Something went wrong.");
      setPin("");
      setConfirmPin("");
      setBusy(false);
      first.current?.focus();
      return;
    }
    window.location.href = "/admin";
  }

  const digits = (v: string) => v.replace(/\D/g, "").slice(0, 10);

  return (
    <div className="grid min-h-screen place-items-center bg-forest px-5 py-16">
      <div className="w-full max-w-[380px]">
        <div className="flex justify-center">
          <Image src="/brand/logo.png" alt="Green Line Lawn Care" width={644} height={366} className="h-14 w-auto" priority />
        </div>

        <div className="mt-8 border border-line bg-white p-7">
          {pinSet === null ? (
            <p className="text-mute-l">Loading&hellip;</p>
          ) : (
            <>
              <h1 className="h3">{pinSet ? "Enter your PIN" : "Choose a PIN"}</h1>
              <p className="t-sm mt-1 text-mute-l">
                {pinSet
                  ? "Green Line admin"
                  : "First time setup. Pick 6 digits you will remember. You can change it later in Settings."}
              </p>

              <form onSubmit={submit} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="pin" className="mb-1 block font-semibold">
                    {pinSet ? "PIN" : "New PIN"}
                  </label>
                  <input
                    ref={first}
                    id="pin"
                    className="field text-center text-2xl tracking-[0.5em] tabular-nums"
                    type="password"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="\u2022\u2022\u2022\u2022\u2022\u2022"
                    value={pin}
                    onChange={(e) => setPin(digits(e.target.value))}
                    required
                  />
                </div>

                {!pinSet && (
                  <div>
                    <label htmlFor="confirm" className="mb-1 block font-semibold">Confirm PIN</label>
                    <input
                      id="confirm"
                      className="field text-center text-2xl tracking-[0.5em] tabular-nums"
                      type="password"
                      inputMode="numeric"
                      placeholder="\u2022\u2022\u2022\u2022\u2022\u2022"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(digits(e.target.value))}
                      required
                    />
                  </div>
                )}

                {error && (
                  <p className="border-l-4 border-green bg-paper-2 p-3 text-[0.9rem]" role="alert">{error}</p>
                )}

                <button type="submit" className="btn btn-p w-full" disabled={busy || pin.length < 4}>
                  {busy ? "Checking\u2026" : pinSet ? "Sign in" : "Set PIN and continue"}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="t-sm mt-5 text-center text-mute-d">
          {pinSet === false
            ? "Nobody can reach the admin until this PIN is set."
            : "Five wrong attempts locks sign-in for 15 minutes."}
        </p>
      </div>
    </div>
  );
}
