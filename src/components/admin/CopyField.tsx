"use client";

import { useState } from "react";

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <span className="mb-1 block font-medium">{label}</span>
      <div className="flex gap-2">
        <input className="field t-data" readOnly value={value} onFocus={(e) => e.target.select()} />
        <button
          type="button"
          className="btn btn-ghost-light shrink-0"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              /* select-and-copy fallback is the focused input */
            }
          }}
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
