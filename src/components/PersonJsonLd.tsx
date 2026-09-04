import { site, education, skillGroups } from "@/content/site";

/**
 * Person structured data for the home page. Every value traces to
 * src/content — nothing here is asserted that the rest of the site does not
 * also state in plain text.
 */
export default function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    email: `mailto:${site.email}`,
    url: site.seo.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
      addressCountry: "PK",
    },
    sameAs: [site.links.linkedin, site.links.github],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.institution,
    },
    knowsAbout: skillGroups.map((g) => g.title),
  };

  // Static, build-time content from our own data files — no user input. The
  // `<` escape is defence in depth against a stray "</script>" ever landing in
  // a content string.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
