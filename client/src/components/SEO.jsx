import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Neptune Therapy';
const SITE_URL = 'https://neptunetherapy.com';
const DEFAULT_IMAGE = `${SITE_URL}/images/nurse-patient.jpg`;

export default function SEO({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = false,
}) {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} | Home Health Agency Staffing in Texas`;

  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* Core */}
      <html lang="en" />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Geo (local SEO) */}
      <meta name="geo.region" content="US-TX" />
      <meta name="geo.placename" content="Houston, Texas" />
    </Helmet>
  );
}
