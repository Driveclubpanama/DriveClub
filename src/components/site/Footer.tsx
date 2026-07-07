export function Footer() {
  return (
    <footer className="border-t border-ink/10 mt-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="font-mono text-[11px] uppercase tracking-widest text-ink/50">
          DriveClub Panama · Est. 2017
        </p>
        <p className="font-mono text-[11px] text-ink/50">
          Contenido original de{" "}
          <a
            href="https://www.instagram.com/driveclubpanama"
            target="_blank"
            rel="noreferrer noopener"
            className="text-gold hover:underline"
          >
            @DriveClubPanama
          </a>
        </p>
      </div>
    </footer>
  );
}
