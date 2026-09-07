import documents from "../data/legalDocuments.json";
import LegalPageLayout from "../layouts/LegalPageLayout";

export default function LegalDocument({ document }: { document: "privacy" | "terms" }) {
  const content = documents[document];
  return (
    <LegalPageLayout title={content.title} description={content.intro}>
      <main className="page" id="main">
        <div className="hero">
          <p className="eyebrow">Carsl · Publisher &amp; TV</p>
          <h1>{content.title}</h1>
          <p className="lead">{content.intro}</p>
          <p className="meta">Version {documents.version} · <a href={`mailto:${documents.contact}`}>{documents.contact}</a></p>
        </div>
        <div className="content-layout">
          <nav className="contents" aria-label="Document sections">
            <h2>On this page</h2>
            <ol>{content.sections.map((section, index) => <li key={section.title}><a href={`#section-${index}`}>{section.title.replace(/^\d+\.\s*/, "")}</a></li>)}</ol>
          </nav>
          <article>{content.sections.map((section, index) => (
            <section id={`section-${index}`} key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </section>
          ))}</article>
        </div>
      </main>
    </LegalPageLayout>
  );
}
