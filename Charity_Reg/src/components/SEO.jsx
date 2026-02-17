import { Helmet } from 'react-helmet-async';

/**
 * @param {{ title?: string; description?: string; image?: string; url?: string; type?: string }} props
 */
export function SEO({ title = 'Charity Fair Registration | Gospel Pillars Church Toronto', description, image, url, type = 'website' }) {
  const desc = description ?? 'Register for free groceries, food items and clothing at Gospel Pillars Church Toronto. Sunday 22nd February 2026.';
  const img = image ?? (typeof window !== 'undefined' ? `${window.location.origin}/logo.jpeg` : '/logo.jpeg');
  const canonical = url ?? (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={canonical} />
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={img} />
      <meta property="og:url" content={canonical} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  );
}
