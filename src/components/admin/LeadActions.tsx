"use client";

import { useState, useTransition } from "react";
import { updateLeadStatus } from "@/app/admin/actions";

const STATUSES = ["new", "contacted", "quoted", "scheduled", "won", "lost"];

export default function LeadActions({
  leadId,
  status,
  quoted,
}: {
  leadId: string;
  status: string;
  quoted: number | null;
}) {
  const [pending, start] = useTransition();
  const [quote, setQuote] = useState(quoted?.toString() ?? "");
  const [current, setCurrent] = useState(status);

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="lead-status" className="mb-1 block font-medium">
          Status
        </label>
        <select
          id="lead-status"
          className="field"
          value={current}
          disabled={pending}
          onChange={(e) => {
            const v = e.target.value;
            setCurrent(v);
            start(() => updateLeadStatus(leadId, v));
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="lead-quote" className="mb-1 block font-medium">
          Quoted amount
        </label>
        <div className="flex gap-2">
          <input
            id="lead-quote"
            className="field"
            inputMode="decimal"
            placeholder="0.00"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
          <button
            type="button"
            className="btn btn-ghost-light"
            disabled={pending}
            onClick={() => start(() => updateLeadStatus(leadId, "quoted", quote))}
          >
            Save quote
          </button>
        </div>
      </div>
    </div>
  );
}
