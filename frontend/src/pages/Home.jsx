import { useState } from "react";
import { Link } from "react-router-dom";
import { blogPosts, examplePages, resourcePages } from "../data/seoContent";

const categories = [
  {
    title: "AI Tool",
    description: "ATS analysis, resume scoring, and job-fit feedback powered by AI for modern job seekers.",
    link: "/how-ats-systems-work"
  },
  {
    title: "Resources",
    description: "Actionable guides, keyword tips, and career advice to improve resume quality and ATS performance.",
    link: "/how-to-write-an-ats-friendly-resume"
  },
  {
    title: "Blog",
    description: "Practical content on resume writing, applicant tracking systems, and smarter job-search strategy.",
    link: "/blog"
  }
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-shell home-page">
      <header className="site-header">
        <div className="container header-inner">
          <Link className="brand" to="/">
            ResumeAI
          </Link>

          <div className="header-analysis">
            <Link className="btn btn-primary" to="/dashboard">
              Start Analysis
            </Link>
          </div>

          <button
            className="mobile-menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="home-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            id="home-navigation"
            aria-label="Main navigation"
          >
            {categories.map((item) => (
              <Link key={item.title} to={item.link}>
                {item.title}
              </Link>
            ))}
          </nav>

          <div className={`header-actions${menuOpen ? " is-open" : ""}`}>
            <Link className="btn btn-light" to="/login">
              Login
            </Link>
            <Link className="btn btn-secondary" to="/register">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="container hero-grid">
            <div>
              <p className="eyebrow">AI Resume Analyzer</p>
              <h1>Turn your resume into a stronger application.</h1>
              <p className="lead">
                Improve ATS match, highlight your best skills, and get practical resume guidance for technical and non-technical roles.
              </p>

              <div className="hero-actions">
                <Link className="btn btn-primary" to="/dashboard">
                  Analyze My Resume
                </Link>
                <Link className="btn btn-secondary" to="/how-ats-systems-work">
                  Learn ATS Basics
                </Link>
              </div>

              <div className="hero-metrics">
                <div>
                  <strong>ATS-aware</strong>
                  <span>easy-to-scan structure</span>
                </div>
                <div>
                  <strong>Job-specific</strong>
                  <span>keyword alignment</span>
                </div>
                <div>
                  <strong>Recruiter-friendly</strong>
                  <span>clear proof and impact</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-card highlight">
                <span className="mini-label">ATS score</span>
                <strong>88%</strong>
                <p>Resume alignment improves once keywords and structure match the target role.</p>
              </div>

              <div className="visual-stack">
                <div className="visual-card">
                  <span>AI feedback</span>
                  <strong>Targeted suggestions</strong>
                </div>
                <div className="visual-card">
                  <span>Resume keywords</span>
                  <strong>Relevant and natural</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container section-block">
          <div className="section-header">
            <p className="eyebrow">Build it as</p>
            <h2>Clear guidance for every stage of the hiring journey</h2>
          </div>

          <div className="card-grid three-up">
            {categories.map((item) => (
              <Link key={item.title} className="info-card" to={item.link}>
                <span className="card-badge">{item.title}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="inline-link">Explore →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-block">
          <div className="section-header split">
            <div>
              <p className="eyebrow">Popular guides</p>
              <h2>Actionable resources for ATS and resume optimization</h2>
            </div>
            <Link className="text-link" to="/how-to-write-an-ats-friendly-resume">
              View all guides
            </Link>
          </div>

          <div className="card-grid four-up">
            {resourcePages.slice(0, 4).map((page) => (
              <Link key={page.path} className="info-card" to={page.path}>
                <span className="card-badge">{page.category}</span>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
                <span className="inline-link">Read article →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-block">
          <div className="section-header split">
            <div>
              <p className="eyebrow">Examples</p>
              <h2>Resume examples by role</h2>
            </div>
            <Link className="text-link" to="/resume-examples/software-engineer">
              See all examples
            </Link>
          </div>

          <div className="card-grid three-up">
            {examplePages.map((page) => (
              <Link key={page.path} className="info-card" to={page.path}>
                <span className="card-badge">{page.title.split(" ")[0]}</span>
                <h3>{page.title}</h3>
                <p>{page.description}</p>
                <span className="inline-link">Open example →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container section-block blog-section">
          <div className="section-header split">
            <div>
              <p className="eyebrow">Blog</p>
              <h2>Fresh job-search and resume advice</h2>
            </div>
            <Link className="text-link" to="/blog">
              Visit blog
            </Link>
          </div>

          <div className="card-grid two-up">
            {blogPosts.map((post) => (
              <Link key={post.path} className="info-card blog-card" to={post.path}>
                <span className="card-badge">{post.eyebrow}</span>
                <h3>{post.title}</h3>
                <p>{post.description}</p>
                <span className="inline-link">Read article →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="container cta-strip">
          <div>
            <p className="eyebrow">Ready to apply?</p>
            <h2>Use the analyzer to compare your resume with the role.</h2>
          </div>
          <Link className="btn btn-primary" to="/dashboard">
            Start free analysis
          </Link>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <div className="brand">ResumeAI</div>
            <p>Resume guidance for applicants who want stronger ATS alignment and clearer job-search strategy.</p>
          </div>
          <div>
            <h4>Resources</h4>
            <ul>
              <li><Link to="/how-ats-systems-work">How ATS works</Link></li>
              <li><Link to="/resume-keywords">Resume keywords</Link></li>
              <li><Link to="/how-to-improve-ats-score">ATS score tips</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
