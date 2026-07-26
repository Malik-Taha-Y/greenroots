import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full">
      <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 26V15M14 15C14 15 7 14 7 7C7 7 14 8 14 15ZM14 15C14 15 21 14 21 7C21 7 14 8 14 15Z"
              stroke="#1F4D33"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-display font-semibold text-lg tracking-tight text-canopy-900 group-hover:text-canopy-700 transition-colors">
            GreenRoots
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/history" className="text-canopy-800 hover:text-canopy-600 transition-colors">
            Past recommendations
          </Link>
        </nav>
      </div>
    </header>
  );
}
