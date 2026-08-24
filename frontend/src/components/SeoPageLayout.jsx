import { Link } from "react-router-dom";

const mainNav = [
  { label: "ATS Guide", to: "/how-ats-systems-work" },
  { label: "Resume Tips", to: "/how-to-write-an-ats-friendly-resume" },
  { label: "Keywords", to: "/resume-keywords" },
  { label: "Examples", to: "/resume-examples/software-engineer" },
  { label: "Blog", to: "/blog" }
];

export default function SeoPageLayout({
  eyebrow,
  title,
  description,
  children,
  breadcrumbs = []
}) {
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            ResumeAI
          </Link>

          <nav className="site-nav" aria-label="Main navigation">
            {mainNav.map((item) => (
              <Link key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="header-actions">
            <Link className="btn btn-light" to="/login">
              Login
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Sign Up
            </Link>
            <Link className="btn btn-primary" to="/dashboard">
              Try Analyzer
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="page-hero">
          <div className="container page-hero-inner">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}

            <h1>{title}</h1>

            {description && <p className="lead">{description}</p>}

            {breadcrumbs.length > 0 && (
              <div className="breadcrumbs" aria-label="Breadcrumb">
                {breadcrumbs.map((crumb, index) => (
                  <span key={crumb.label}>
                    {index > 0 && <span className="separator">/</span>}
                    {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : <span>{crumb.label}</span>}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {children}
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">ResumeAI</div>
            <p>
              AI-powered resume analysis, ATS guidance, and job-search content designed to help candidates stand out.
            </p>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li><Link to="/how-ats-systems-work">How ATS works</Link></li>
              <li><Link to="/resume-keywords">Resume keywords</Link></li>
              <li><Link to="/how-to-improve-ats-score">ATS score tips</Link></li>
            </ul>
          </div>

          <div>
            <h4>Examples</h4>
            <ul>
              <li><Link to="/resume-examples/software-engineer">Software engineer</Link></li>
              <li><Link to="/resume-examples/data-scientist">Data scientist</Link></li>
              <li><Link to="/resume-examples/ai-engineer">AI engineer</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
