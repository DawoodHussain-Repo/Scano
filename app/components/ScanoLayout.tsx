import Link from "next/link";
import { ReactNode } from "react";

interface ScanoLayoutProps {
  children: ReactNode;
}

export default function ScanoLayout({ children }: ScanoLayoutProps) {
  return (
    <main className="app-shell">
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="portfolio-title">Scano</div>
          <div className="flex gap-4">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Link href="/verdict/example" className="nav-link">
              Example Verdict
            </Link>
          </div>
        </div>
      </nav>

      <div className="main-panel">{children}</div>

      <footer className="footer">
        <div className="footer-inner">
          <p>© {new Date().getFullYear()} Scano. All rights reserved.</p>
          <p>Built for future PDF contract intelligence pipeline.</p>
        </div>
      </footer>
    </main>
  );
}
