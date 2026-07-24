"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { services } from "@/data/services";
import { processPhoto } from "@/lib/image-pipeline";

// Four steps, three fields max per step (build spec 8.2). Progress is
// the line device filling left to right, not a dot stepper. Steps are
// URL-addressable (?step=n) and answers persist to sessionStorage so a
// back-button press or an accidental navigation loses nothing.

type PhotoState = {
  key: string;
  name: string;
  status: "processing" | "uploading" | "done" | "skipped";
  storagePath?: string;
  width?: number;
  height?: number;
  bytes?: number;
  previewUrl?: string;
  reason?: string;
};

type FormState = {
  services: string[];
  address: string;
  city: string;
  zip: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  smsConsent: boolean;
};

const CONSENT_TEXT =
  "Text me about my estimate at this number. Message and data rates may apply. Message frequency varies. Reply STOP to opt out or HELP for help.";

const EMPTY: FormState = {
  services: [],
  address: "",
  city: "",
  zip: "",
  name: "",
  phone: "",
  email: "",
  notes: "",
  smsConsent: false,
};

const STORAGE_KEY = "gl-estimate";

function loadSaved(): FormState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export default function EstimateForm() {
  const router = useRouter();
  const params = useSearchParams();
  const step = Math.min(4, Math.max(1, Number(params.get("step") ?? 1)));

  const [form, setForm] = useState<FormState>(EMPTY);
  const [photos, setPhotos] = useState<PhotoState[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const startedAt = useRef(Date.now());
  const honeypotRef = useRef<HTMLInputElement>(null);
  const turnstileToken = useRef("");
  const turnstileDiv = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setForm(loadSaved());
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    } catch {
      /* storage full or unavailable; the form still works */
    }
  }, [form]);

  // Cloudflare Turnstile, invisible mode. Renders only when the site
  // key is configured; without it the server accepts honeypot+timing
  // alone (dev mode).
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey || step !== 4 || !turnstileDiv.current) return;
    const w = window as unknown as {
      turnstile?: { render: (el: Element, opts: object) => void };
    };
    const render = () => {
      w.turnstile?.render(turnstileDiv.current as Element, {
        sitekey: siteKey,
        size: "invisible",
        callback: (token: string) => {
          turnstileToken.current = token;
        },
      });
    };
    if (w.turnstile) {
      render();
      return;
    }
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
    s.async = true;
    s.onload = render;
    document.head.appendChild(s);
  }, [step]);

  function go(next: number) {
    router.push(`/estimate?step=${next}`, { scroll: true });
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => {
      const { [key as string]: _drop, ...rest } = e;
      return rest;
    });
  }

  /* ---------- step validation ---------- */

  function validateStep(n: number): boolean {
    const e: Record<string, string> = {};
    if (n === 1 && form.services.length === 0) {
      e.services = "Pick at least one so we know what to price.";
    }
    if (n === 2) {
      if (!form.address.trim()) e.address = "We need the street address to quote the job.";
      if (!form.city.trim()) e.city = "Enter the city.";
    }
    if (n === 4) {
      if (!form.name.trim()) e.name = "Enter your name so we know who to ask for.";
      if (form.phone.replace(/\D/g, "").length < 10)
        e.phone = "Enter a ten-digit phone number so we can send your price.";
      if (form.email && !/^\S+@\S+\.\S+$/.test(form.email))
        e.email = "That email does not look complete. It is optional, so you can also clear it.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  /* ---------- photos ---------- */

  async function onFiles(list: FileList | null) {
    if (!list) return;
    const room = 6 - photos.filter((p) => p.status !== "skipped").length;
    const files = Array.from(list).slice(0, Math.max(0, room));
    for (const file of files) {
      const key = `${file.name}-${file.size}-${Date.now()}`;
      setPhotos((p) => [...p, { key, name: file.name, status: "processing" }]);
      try {
        const processed = await processPhoto(file);
        const previewUrl = URL.createObjectURL(processed.blob);
        setPhotos((p) =>
          p.map((ph) => (ph.key === key ? { ...ph, status: "uploading", previewUrl } : ph))
        );
        const res = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            filename: processed.name,
            contentType: "image/jpeg",
            bytes: processed.blob.size,
          }),
        });
        if (!res.ok) throw new Error("upload url");
        const { uploadUrl, storagePath } = await res.json();
        // Supabase signed upload URLs carry the token in the query string.
        // Adding an Authorization header makes the PUT fail, which is why
        // uploads were not working. Send the bytes with no auth header.
        const put = await fetch(uploadUrl, {
          method: "PUT",
          headers: { "Content-Type": "image/jpeg" },
          body: processed.blob,
        });
        if (!put.ok) throw new Error("upload");
        setPhotos((p) =>
          p.map((ph) =>
            ph.key === key
              ? {
                  ...ph,
                  status: "done",
                  storagePath,
                  width: processed.width,
                  height: processed.height,
                  bytes: processed.blob.size,
                }
              : ph
          )
        );
      } catch {
        // Photos are optional. If one cannot be processed or uploaded, drop it
        // silently rather than showing an error.
        setPhotos((p) => p.filter((ph) => ph.key !== key));
      }
    }
  }

  function removePhoto(key: string) {
    setPhotos((p) => p.filter((ph) => ph.key !== key));
  }

  /* ---------- submit ---------- */

  async function submit() {
    if (!validateStep(4)) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          consentText: form.smsConsent ? CONSENT_TEXT : null,
          photoPaths: photos
            .filter((p) => p.status === "done")
            .map((p) => ({ path: p.storagePath, width: p.width, height: p.height, bytes: p.bytes })),
          turnstileToken: turnstileToken.current,
          honeypot: honeypotRef.current?.value ?? "",
          elapsedMs: Date.now() - startedAt.current,
          utm: Object.fromEntries(
            ["utm_source", "utm_medium", "utm_campaign"]
              .map((k) => [k, new URLSearchParams(window.location.search).get(k)])
              .filter(([, v]) => v)
          ),
        }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error ?? "Something went wrong sending your request.");
      }
      sessionStorage.removeItem(STORAGE_KEY);
      router.push("/thank-you");
    } catch (e) {
      setSubmitError(
        e instanceof Error
          ? e.message
          : "Something went wrong sending your request. Call us instead: (925) 436-6691."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      {/* Progress: the line, filling left to right */}
      <div aria-hidden="true" className="mb-2 h-[3px] w-full bg-concrete-30">
        <div
          className="h-full bg-turf transition-[width] duration-200"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>
      <p className="t-body-sm mb-8 text-ink-60" aria-live="polite">
        Step {step} of 4
      </p>

      {/* honeypot */}
      <div className="hp" aria-hidden="true">
        <label>
          Company website
          <input ref={honeypotRef} type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {step === 1 && (
        <fieldset>
          <legend className="t-display-sm">What Do You Need?</legend>
          <p className="mt-2 text-ink-60">Pick everything that applies.</p>
          <ul className="mt-6 space-y-3">
            {[...services.map((s) => ({ slug: s.slug, name: s.name })), { slug: "other", name: "Something Else" }].map(
              (s) => {
                const on = form.services.includes(s.slug);
                return (
                  <li key={s.slug}>
                    <button
                      type="button"
                      aria-pressed={on}
                      onClick={() =>
                        set(
                          "services",
                          on ? form.services.filter((x) => x !== s.slug) : [...form.services, s.slug]
                        )
                      }
                      className={`flex min-h-[48px] w-full items-center justify-between rounded-sm border-[1.5px] px-4 py-3 text-left font-medium transition-colors duration-200 ${
                        on
                          ? "border-turf-fill bg-turf-fill text-white"
                          : "border-concrete-30 bg-concrete-00 text-ink hover:border-ink"
                      }`}
                    >
                      <span>{s.name}</span>
                      <span aria-hidden="true">{on ? "\u2713" : "+"}</span>
                    </button>
                  </li>
                );
              }
            )}
          </ul>
          {errors.services && <p className="field-error-text mt-4">{errors.services}</p>}
          <div className="mt-8">
            <button type="button" className="btn btn-fill" onClick={() => validateStep(1) && go(2)}>
              Next: Where Is It
            </button>
          </div>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset>
          <legend className="t-display-sm">Where Is The Property?</legend>
          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="address" className="mb-1 block font-medium">
                Street Address
              </label>
              <input
                id="address"
                className="field"
                autoComplete="street-address"
                value={form.address}
                onChange={(e) => set("address", e.target.value)}
                onBlur={() => validateStep(2)}
                aria-describedby={errors.address ? "address-err" : undefined}
              />
              {errors.address && (
                <p id="address-err" className="field-error-text">
                  {errors.address}
                </p>
              )}
            </div>
            <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
              <div>
                <label htmlFor="city" className="mb-1 block font-medium">
                  City
                </label>
                <input
                  id="city"
                  className="field"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={(e) => set("city", e.target.value)}
                  aria-describedby={errors.city ? "city-err" : undefined}
                />
                {errors.city && (
                  <p id="city-err" className="field-error-text">
                    {errors.city}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="zip" className="mb-1 block font-medium">
                  ZIP
                </label>
                <input
                  id="zip"
                  className="field"
                  inputMode="numeric"
                  autoComplete="postal-code"
                  maxLength={5}
                  value={form.zip}
                  onChange={(e) => set("zip", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex gap-4">
            <button type="button" className="btn btn-ghost-light" onClick={() => go(1)}>
              Back
            </button>
            <button type="button" className="btn btn-fill" onClick={() => validateStep(2) && go(3)}>
              Next: Photos
            </button>
          </div>
        </fieldset>
      )}

      {step === 3 && (
        <fieldset>
          <legend className="t-display-sm">Show Us The Property</legend>
          <p className="mt-2 max-w-[52ch] text-ink-60">
            Optional, but photos get you an accurate price without us needing to come out first. Up
            to six. Pick them from your photo library.
          </p>
          <label className="mt-6 block">
            <span className="btn btn-ghost-light w-full cursor-pointer sm:w-auto">Choose Photos</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                onFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </label>

          {photos.length > 0 && (
            <ul className="mt-6 grid grid-cols-3 gap-3">
              {photos.map((p) => (
                <li key={p.key} className="relative">
                  <div className="relative aspect-square overflow-hidden rounded-sm bg-concrete-00">
                    {p.previewUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={p.previewUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="grid h-full place-items-center text-[0.8rem] text-ink-60">
                        {p.status === "processing" ? "Reading\u2026" : p.status}
                      </div>
                    )}
                    {p.status === "uploading" && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-[0.75rem] text-paper">
                        Uploading&hellip;
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removePhoto(p.key)}
                    className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-sm bg-black text-paper"
                    aria-label={`Remove ${p.name}`}
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-8 flex gap-4">
            <button type="button" className="btn btn-ghost-light" onClick={() => go(2)}>
              Back
            </button>
            <button
              type="button"
              className="btn btn-fill"
              disabled={photos.some((p) => p.status === "processing" || p.status === "uploading")}
              onClick={() => go(4)}
            >
              {photos.some((p) => p.status === "uploading" || p.status === "processing")
                ? "Finishing Uploads\u2026"
                : "Next: Contact Info"}
            </button>
          </div>
        </fieldset>
      )}

      {step === 4 && (
        <fieldset>
          <legend className="t-display-sm">How Do We Reach You?</legend>
          <div className="mt-6 space-y-5">
            <div>
              <label htmlFor="name" className="mb-1 block font-medium">
                Name
              </label>
              <input
                id="name"
                className="field"
                autoComplete="name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                aria-describedby={errors.name ? "name-err" : undefined}
              />
              {errors.name && (
                <p id="name-err" className="field-error-text">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block font-medium">
                Phone
              </label>
              <input
                id="phone"
                className="field"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                onBlur={() => validateStep(4)}
                aria-describedby={errors.phone ? "phone-err" : undefined}
              />
              {errors.phone && (
                <p id="phone-err" className="field-error-text">
                  {errors.phone}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block font-medium">
                Email <span className="font-normal text-ink-60">(Optional)</span>
              </label>
              <input
                id="email"
                className="field"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                aria-describedby={errors.email ? "email-err" : undefined}
              />
              {errors.email && (
                <p id="email-err" className="field-error-text">
                  {errors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="notes" className="mb-1 block font-medium">
                Anything Else <span className="font-normal text-ink-60">(Optional)</span>
              </label>
              <textarea
                id="notes"
                className="field min-h-[96px]"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>
            <label className="flex items-start gap-3 text-[0.95rem]">
              <input
                type="checkbox"
                className="mt-1 h-5 w-5 accent-[#2d6d14]"
                checked={form.smsConsent}
                onChange={(e) => set("smsConsent", e.target.checked)}
              />
              <span>
                {CONSENT_TEXT}{" "}
                <a href="/sms-terms" className="text-turf-ink underline underline-offset-2">
                  SMS terms
                </a>
              </span>
            </label>
          </div>

          <div ref={turnstileDiv} />

          {submitError && (
            <p className="field-error-text mt-6" role="alert">
              {submitError}
            </p>
          )}

          <div className="mt-8 flex gap-4">
            <button type="button" className="btn btn-ghost-light" onClick={() => go(3)}>
              Back
            </button>
            <button type="button" className="btn btn-fill" disabled={submitting} onClick={submit}>
              {submitting ? "Sending\u2026" : "Send My Estimate Request"}
            </button>
          </div>
        </fieldset>
      )}
    </div>
  );
}
