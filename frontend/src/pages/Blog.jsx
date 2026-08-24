import { Link } from "react-router-dom";
import SeoPageLayout from "../components/SeoPageLayout";
import { blogPosts } from "../data/seoContent";

export default function Blog() {
  return (
    <SeoPageLayout
      eyebrow="Blog"
      title="Resume and ATS advice for smarter job searching"
      description="Read practical articles on ATS systems, resume optimization, and career strategy for candidates who want to improve their results."
      breadcrumbs={[{ label: "Home", to: "/" }, { label: "Blog" }]}
    >
      <section className="container section-block">
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
    </SeoPageLayout>
  );
}
