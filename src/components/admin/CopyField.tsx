"use client";

import { useState } from "react";

export default function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <span className="gladmin-label">{label}</span>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          className="gladmin-input"
          style={{ fontVariantNumeric: "tabular-nums" }}
          readOnly
          value={value}
          onFocus={(e) => e.target.select()}
        />
        <button
          type="button"
          className="gladmin-btn-ghost"
          style={{ flexShrink: 0 }}
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
