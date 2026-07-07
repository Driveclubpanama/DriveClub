import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="inline-flex flex-col leading-none">
      <span className="font-serif text-2xl md:text-3xl font-semibold text-ink">
        DriveClub Magazine
      </span>
      <span className="font-mono text-[10px] md:text-xs tracking-widest uppercase text-gold mt-1">
        Est. 2017
      </span>
    </Link>
  );
}
