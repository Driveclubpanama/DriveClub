import { Logo } from "./Logo";
import { DockNav } from "./DockNav";

const NAV_ITEMS = [
  { href: "/", label: "Inicio" },
  { href: "/noticias-rapidas", label: "Noticias Rápidas" },
  { href: "/noticias", label: "Revista" },
  { href: "https://www.instagram.com/driveclubpanama", label: "Instagram", external: true },
];

export function Header() {
  return (
    <header className="border-b border-ink/10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-5 flex items-center justify-between">
        <Logo />
        <nav className="font-mono text-xs uppercase tracking-widest text-ink/70">
          <DockNav items={NAV_ITEMS} />
        </nav>
      </div>
    </header>
  );
}
