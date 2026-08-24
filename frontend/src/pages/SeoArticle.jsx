import { useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SeoPageLayout from "../components/SeoPageLayout";
import { seoPages } from "../data/seoContent";

function getPageFromLocation(location, params) {
  const exactPath = location.pathname;

  const match = seoPages.find((page) => page.path === exactPath);
  if (match) return match;

  if (params?.slug) {
    return seoPages.find((page) => page.slug === params.slug) || null;
  }

  return null;
}

export default function SeoArticle() {
  const location = useLocation();
  const params = useParams();
  const page = getPageFromLocation(location, params);

  useEffect(() => {
    if (!page) return;

    document.title = `${page.title} | ResumeAI`;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", page.description);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", page.title);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", page.description);
    }
  }, [page]);

  if (!page) {
    return (
      <SeoPageLayout
        eyebrow="Page not found"
        title="This page does not exist yet"
        description="Try one of our resume and ATS guides instead."
        breadcrumbs={[{ label: "Home", to: "/" }, { label: "Not found" }]}
      >
        <section className="container section-block">
          <div className="empty-state">
            <h3>We could not find that resource.</h3>
            <Link className="btn btn-primary" to="/">
              Go to homepage
            </Link>
          </div>
        </section>
      </SeoPageLayout>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: page.title,
    description: page.description,
    author: {
      "@type": "Organization",
      name: "ResumeAI"
    },
    publisher: {
      "@type": "Organization",
      name: "ResumeAI"
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://resumeai.example${page.path}`
    }
  };

  return (
    <SeoPageLayout
      eyebrow={page.category}
      title={page.title}
      description={page.description}
      breadcrumbs={[{ label: "Home", to: "/" }, { label: page.category }, { label: page.title }]}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="container article-layout">
        <article className="article-content">
          <div className="hero-callout">
            {page.heroText}
          </div>

          {page.sections.map((section) => (
            <section key={section.heading} className="article-section">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}

          {page.faqs && page.faqs.length > 0 && (
            <section className="faq-block">
              <h2>Frequently asked questions</h2>
              <div className="faq-list">
                {page.faqs.map((faq) => (
                  <div key={faq.question} className="faq-item">
                    <h3>{faq.question}</h3>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="article-sidebar">
          <div className="sidebar-card">
            <h3>Quick wins</h3>
            <ul>
              <li>Match key terms from the posting</li>
              <li>Keep formatting clean and readable</li>
              <li>Show measurable results in bullets</li>
              <li>Tailor your resume for the role</li>
            </ul>
          </div>

          <div className="sidebar-card">
            <h3>Continue reading</h3>
            <ul>
              {page.related.map((relatedPath) => {
                const relatedPage = seoPages.find((item) => item.path === relatedPath);
                if (!relatedPage) return null;

                return (
                  <li key={relatedPage.path}>
                    <Link to={relatedPage.path}>{relatedPage.title}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </aside>
      </section>

      <section className="container section-block">
        <div className="section-header">
          <p className="eyebrow">Related resources</p>
          <h2>More content to keep your resume strong</h2>
        </div>

        <div className="card-grid three-up">
          {seoPages
            .filter((item) => item.path !== page.path)
            .slice(0, 3)
            .map((item) => (
              <Link key={item.path} className="info-card" to={item.path}>
                <span className="card-badge">{item.category}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span className="inline-link">Read more →</span>
              </Link>
            ))}
        </div>
      </section>
    </SeoPageLayout>
  );
}
