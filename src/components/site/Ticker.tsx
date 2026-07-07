import Link from "next/link";

export interface TickerItem {
  slug: string;
  title: string;
  href: string;
}

export function Ticker({ items }: { items: TickerItem[] }) {
  if (items.length === 0) return null;

  const loopItems = [...items, ...items];

  return (
    <div className="border-y border-gold/40 bg-ink text-cream overflow-hidden">
      <div className="flex whitespace-nowrap animate-ticker">
        {loopItems.map((item, index) => (
          <Link
            key={`${item.slug}-${index}`}
            href={item.href}
            className="font-mono text-xs md:text-sm uppercase tracking-wide px-6 py-3 hover:text-gold transition-colors flex items-center gap-6"
          >
            <span className="text-gold">●</span>
            {item.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
