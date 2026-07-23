"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type Props = {
  before: string;
  after: string;
  caption: string;
  alt: string;
};

// Drag-handle wipe. User-driven, so it works identically under
// prefers-reduced-motion. Keyboard: role=slider with arrow keys.
export default function WipeCompare({ before, after, caption, alt }: Props) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pct = ((clientX - r.left) / r.width) * 100;
    setPos(Math.max(2, Math.min(98, pct)));
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setFromClientX(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (dragging.current) setFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPos((p) => Math.max(2, p - 4));
    if (e.key === "ArrowRight") setPos((p) => Math.min(98, p + 4));
    if (e.key === "Home") setPos(2);
    if (e.key === "End") setPos(98);
  };

  return (
    <figure>
      <div
        ref={ref}
        className="wipe aspect-[3/4] bg-field"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <Image src={before} alt={`${alt}, before`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={after} alt={`${alt}, after`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
        <span className="t-label absolute left-3 top-3 bg-black/70 px-2 py-1 text-paper">Before</span>
        <span className="t-label absolute right-3 top-3 bg-turf-fill px-2 py-1 text-white">After</span>
        <div
          className="wipe-handle"
          style={{ left: `${pos}%` }}
          role="slider"
          tabIndex={0}
          aria-label={`${caption}: reveal after photo`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos)}
          onKeyDown={onKeyDown}
        >
          <span className="wipe-grip" aria-hidden="true">&#8596;</span>
        </div>
      </div>
      <figcaption className="t-body-sm mt-2 text-ink-60">{caption}</figcaption>
    </figure>
  );
}
