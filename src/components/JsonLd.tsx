/** Renders a JSON-LD block. Kept in one component so escaping is handled once. */
export default function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is inserted as-is; </script> in content would be the
      // only risk and none of our data contains markup.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
