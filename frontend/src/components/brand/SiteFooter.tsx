export function SiteFooter() {
  return (
    <footer className="mt-6 w-full text-center">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-white/75">
        <a href="#" className="hover:text-white hover:underline">
          Why use us?
        </a>
        <span aria-hidden>·</span>
        <a href="#" className="hover:text-white hover:underline">
          Policy details
        </a>
        <span aria-hidden>·</span>
        <a href="#" className="hover:text-white hover:underline">
          Contact us
        </a>
        <span aria-hidden>·</span>
        <a
          href="https://github.com/01-Aadarsh/frontend"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white hover:underline"
        >
          View source
        </a>
      </div>
      <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-white/50">
        Built for Smart India Hackathon 2026 (SIH26045) under the Ministry
        of AYUSH, Government of India — an open-source student prototype,
        not an officially published government service.
      </p>
    </footer>
  );
}
