export default function JsonLd({ jsonLd }: { jsonLd: Record<string, unknown> }) {
  const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializedJsonLd }} />;
}
