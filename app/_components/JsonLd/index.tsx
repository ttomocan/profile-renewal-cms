export default function JsonLd({ jsonLd }: { jsonLd: Record<string, any> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
