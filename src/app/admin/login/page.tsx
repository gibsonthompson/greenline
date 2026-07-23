"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (!url || !anon) return;
    setBusy(true);
    setError("");
    const supa = createBrowserClient(url, anon);
    const { error } = await supa.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Sign in failed. Check the email and password and try again.");
      setBusy(false);
      return;
    }
    window.location.href = "/admin";
  }

  if (!url || !anon) {
    return (
      <div className="mx-auto max-w-md">
        <h1 className="t-display-md">Admin setup needed</h1>
        <p className="mt-3 text-ink-60">
          Supabase environment variables are not configured yet. Add
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, redeploy, and create the
          admin user in Supabase Auth. See the README.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="t-display-md">Sign in</h1>
      <form onSubmit={login} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="mb-1 block font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="field"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-1 block font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="field"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p className="field-error-text" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-fill w-full" disabled={busy}>
          {busy ? "Signing in\u2026" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
