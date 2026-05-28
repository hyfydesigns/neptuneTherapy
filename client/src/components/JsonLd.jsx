import { Helmet } from 'react-helmet-async';

/**
 * Injects a JSON-LD script tag into <head> for structured data.
 * Used on the homepage for LocalBusiness / MedicalBusiness schema.
 */
export default function JsonLd({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
