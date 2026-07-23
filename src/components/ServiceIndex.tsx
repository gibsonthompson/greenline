"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { services } from "@/data/services";

// A scope-of-work index, not a card grid. Left: rows. Right: one sticky
// image that swaps on hover. On mobile the image panel is dropped and
// the rows stand alone (spec 4.1.2).
export default function ServiceIndex() {
  const [active, setActive] = useState(0);

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-[1fr_minmax(280px,380px)]">
      <ul>
        {services.map((s, i) => (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              className="svc-row"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_minmax(0,44ch)] md:items-baseline md:gap-8">
                <span className="t-display-md">{s.name}</span>
                <span className="text-ink-60">{s.short}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="relative hidden md:block">
        <div className="sticky top-8 aspect-[4/5] overflow-hidden rounded-md bg-field">
          {services.map((s, i) => (
            <Image
              key={s.slug}
              src={s.photo}
              alt=""
              fill
              sizes="380px"
              className="object-cover transition-opacity duration-200"
              style={{ opacity: active === i ? 1 : 0 }}
              aria-hidden={active !== i}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
