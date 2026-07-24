"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type Props = {
  /** Frames MUST be pre-registered and cut from the same crop, or the seam drifts. */
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
};

// The overlay layer carries the BEFORE image and is clipped from the left.
// That guarantees left is always Before and right is always After, which is
// the convention every visitor expects. Swapping the labels instead of the
// layers is how this ends up backwards.
export default function BeforeAfter({ beforeSrc, afterSrc, beforeAlt, afterAlt }: Props) {
  const [pos, setPos] = useState(50);
  const box = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const fromX = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 4;
    if (e.key === "ArrowLeft") { setPos((p) => Math.max(2, p - step)); e.preventDefault(); }
    if (e.key === "ArrowRight") { setPos((p) => Math.min(98, p + step)); e.preventDefault(); }
    if (e.key === "Home") { setPos(2); e.preventDefault(); }
    if (e.key === "End") { setPos(98); e.preventDefault(); }
  };

  return (
    <div
      ref={box}
      className="wipe"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        fromX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && fromX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerCancel={() => (dragging.current = false)}
    >
      {/* base layer: AFTER */}
      <Image src={afterSrc} alt={afterAlt} width={1100} height={1375} sizes="(min-width:768px) 760px, 100vw" />
      <span className="tag tag-a">After</span>

      {/* overlay: BEFORE, clipped from the left */}
      <div className="wipe-over" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={beforeSrc} alt={beforeAlt} width={1100} height={1375} sizes="(min-width:768px) 760px, 100vw" />
        <span className="tag tag-b">Before</span>
      </div>

      <div
        className="wipe-bar"
        style={{ left: `${pos}%` }}
        role="slider"
        tabIndex={0}
        aria-label="Reveal the after photo"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
      >
        <span className="wipe-grip" aria-hidden="true">&#8596;</span>
      </div>
    </div>
  );
}
