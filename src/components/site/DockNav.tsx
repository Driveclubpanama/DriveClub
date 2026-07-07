"use client";

import Link from "next/link";
import { useRef, useState } from "react";

export interface DockNavItem {
  href: string;
  label: string;
  external?: boolean;
}

const MAX_SCALE = 1.35;
const FALLOFF_DISTANCE = 90;

export function DockNav({ items }: { items: DockNavItem[] }) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scales, setScales] = useState<number[]>(items.map(() => 1));

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const mouseX = event.clientX;

    setScales(
      itemRefs.current.map((el) => {
        if (!el) return 1;
        const rect = el.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const distance = Math.abs(mouseX - center);
        const falloff = Math.max(0, 1 - distance / FALLOFF_DISTANCE);
        return 1 + (MAX_SCALE - 1) * falloff;
      })
    );
  }

  function handleMouseLeave() {
    setScales(items.map(() => 1));
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="flex items-center gap-6"
    >
      {items.map((item, index) => (
        <div
          key={item.href}
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          style={{
            transform: `scale(${scales[index]})`,
            transition: "transform 0.15s ease-out",
          }}
          className="origin-bottom"
        >
          {item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer noopener"
              className="block hover:text-gold transition-colors"
            >
              {item.label}
            </a>
          ) : (
            <Link href={item.href} className="block hover:text-gold transition-colors">
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
