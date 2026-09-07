import { useEffect, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import "./LegalPageLayout.css";

interface LegalPageLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
}

export default function LegalPageLayout({
  children,
  title,
  description,
}: LegalPageLayoutProps) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="legal-page">
      <title>{title} | Carsl</title>
      <meta name="description" content={description} />
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Carsl home">CARSL</Link>
        <nav aria-label="Legal pages">
          <NavLink to="/privacy-policy">Privacy policy</NavLink>
          <NavLink to="/terms-of-use">Terms of use</NavLink>
          <NavLink to="/delete-account">Delete account</NavLink>
        </nav>
      </header>
      {children}
      <footer className="site-footer">
        <p>Operator: Carsl · <a href="mailto:carsl.ssfo@gmail.com">carsl.ssfo@gmail.com</a></p>
        <nav aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/privacy-policy">Privacy policy</Link>
          <Link to="/terms-of-use">Terms of use</Link>
          <Link to="/delete-account">Request account deletion</Link>
        </nav>
      </footer>
    </div>
  );
}
