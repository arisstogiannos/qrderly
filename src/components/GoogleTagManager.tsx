'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function GoogleTagManager() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only load GTM after the component mounts
    setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
  }, []);

  if (!isLoaded) return null;

  return (
    <>
      <Script
        id="google-tag-manager"
        strategy="lazyOnload"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-W7D4ZMR5');
          `,
        }}
      />
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-W7D4ZMR5"
          height="0"
          width="0"
          title="Google Tag Manager"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
