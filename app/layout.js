import { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import "./global.css";
import { CartProvider } from "../context/CartContext";
import { CountryProvider } from "../context/CountryContext";
import CustomCursor from "../components/CustomCursor";
import ClientProviders from "../components/ClientProviders";

export const metadata = {
  title: "Tornado",
  description: "Luxury watches for the discerning customer",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="Auh72HE-0wU8HYwXIroXnVnPBaoE_bj8mr2pFDTwyMQ" />
        
        {/* Google Tag Manager */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TH98W8PZ');`,
          }}
        />
        
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XWX57GY6HW"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XWX57GY6HW');
            `,
          }}
        />
        
        {/* Microsoft Clarity */}
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "rt3ykmj10u");
            `,
          }}
        />
        
        {/* Preload critical Inter fonts */}
        <link
          rel="preload"
          href="/fonts/web/Inter-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/web/Inter-Medium.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/web/Inter-SemiBold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/web/Inter-Bold.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Apple Sign In SDK */}
        <script 
          type="text/javascript" 
          src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
          async
        ></script>
        <meta name="appleid-signin-client-id" content={process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || "your-apple-client-id"} />
        <meta name="appleid-signin-scope" content="name email" />
        <meta name="appleid-signin-redirect-uri" content={`${process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000'}/auth/callback`} />
        <meta name="appleid-signin-state" content="apple-signin" />
        <meta name="appleid-signin-use-popup" content="true" />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TH98W8PZ"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        
        <ClientProviders>
          <CountryProvider>
            {children}
          </CountryProvider>
        </ClientProviders>
      </body>
    </html>
  );
}
