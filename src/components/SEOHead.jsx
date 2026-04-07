import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ title, description, path = "" }) => {
  const fullTitle = `${title} | 75 Squared Agency Las Vegas`;
  const defaultDesc = "Enterprise-grade software development, comprehensive digital marketing, and proprietary web applications built in Las Vegas. Dominate your market with 75 Squared.";

  // Generative Engine Optimization JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "75 Squared",
    "description": description || defaultDesc,
    "url": `https://75squared.com${path}`,
    "telephone": "+1-702-907-0932",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Las Vegas",
      "addressRegion": "NV",
      "addressCountry": "US"
    },
    "areaServed": ["Las Vegas", "Henderson", "Summerlin", "United States"],
    "priceRange": "$$$",
    "makesOffer": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Digital Marketing & SEO Optimization"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Custom Software & Web Application Development"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Generative AI Integration"
        }
      }
    ]
  };

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDesc} />
      <meta name="geo.region" content="US-NV" />
      <meta name="geo.placename" content="Las Vegas" />
      <link rel="canonical" href={`https://75squared.com${path}`} />
      
      {/* Schema Injection for both Traditional & Local SEO */}
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
