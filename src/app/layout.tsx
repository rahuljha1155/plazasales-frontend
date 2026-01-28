import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Footer from "@/components/shared/footer";
import Navbar from "@/components/shared/navbar";
import Preloader from "@/components/shared/preloader";
import PageTransition, {
  TransitionProvider,
} from "@/components/shared/page-transition";
// import { ThemeProvider } from "@/providers/theme-provider";
import ColorProvider from "@/providers/color-provider";
import RecaptchaProvider from "@/providers/recaptcha-provider";
import WhatsAppButton from "@/components/shared/whatsapp-button";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/ckeditor.css";
import { getSiteSeoMetadata } from "@/services/seoMetadataService";
import NewsletterDialog from "@/components/dialog/newsletter-dialog";
import { updateSeoFiles } from "@/lib/seo-file-handler";
import ErrorBoundaryWrapper from "./error-boundry";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const response = await getSiteSeoMetadata();
    if (
      response.status === 200 &&
      response.seoMetadata &&
      response.seoMetadata.length > 0
    ) {
      const seo = response.seoMetadata[0];

      const metadata: Metadata = {
        title:
          seo.title || "Plaza Sales || Enhancing your ecommerce experience",
        description:
          seo.description ||
          "Discover Plaza Sales, your trusted partner in ecommerce solutions.",
        keywords: seo.keywords || [
          "ecommerce",
          "sales",
          "online store",
          "business",
        ],
        authors: [{ name: "Webx Nepal", url: "https://webxnepal.com" }],
        openGraph: {
          title: seo.openGraph?.title || seo.title,
          description: seo.openGraph?.description || seo.description,
          type: "website",
          url: seo.openGraph?.url || seo.canonicalUrl,
          siteName: seo.openGraph?.siteName || "Plaza Sales",
          locale: seo.openGraph?.locale || "en_US",
          images:
            seo.openGraph?.images?.map((img) => ({
              url: img.url,
            })) || [],
        },
        twitter: {
          card: "summary_large_image",
          title: seo.twitter?.title || seo.title,
          description: seo.twitter?.description || seo.description,
          images: seo.twitter?.images || [],
        },
        robots: {
          index: seo.robots?.index ?? true,
          follow: seo.robots?.follow ?? true,
          "max-snippet": seo.robots?.maxSnippet,
          "max-image-preview": seo.robots?.maxImagePreview as
            | "none"
            | "standard"
            | "large"
            | undefined,
          "max-video-preview": seo.robots?.maxVideoPreview,
        },
        alternates: {
          canonical: seo.canonicalUrl,
          languages: seo.alternates?.languages || {},
        },
        manifest: "/manifest.json",
        other: {
          ...(seo.extraMeta
            ? Object.entries(seo.extraMeta).reduce((acc, [key, value]) => {
              if (typeof value === "string" || typeof value === "number") {
                acc[key] = value;
              }
              return acc;
            }, {} as Record<string, string | number>)
            : {}),
        },
      };

      // Create local files for sitemap and manifest
      await updateSeoFiles(seo.sitemapUrl, seo.manifestUrl);

      return metadata;
    }
  } catch (error: unknown) {
    // Log the error but don't fail the build
    if (
      (error as { response?: { status?: number } }).response?.status === 429
    ) {
    } else {
    }
  }

  return {
    title: "Plaza Sales || Enhancing your ecommerce experience",
    description:
      "Discover Plaza Sales, your trusted partner in ecommerce solutions. We specialize in boosting your online sales through innovative strategies and cutting-edge technology.",
    keywords: ["ecommerce", "sales", "online store", "business"],
    authors: [{ name: "Webx Nepal", url: "https://webxnepal.com" }],
  };
}

async function getSeoData() {
  try {
    const response = await getSiteSeoMetadata();
    if (
      response.status === 200 &&
      response.seoMetadata &&
      response.seoMetadata.length > 0
    ) {
      const seo = response.seoMetadata[0];
      return {
        jsonLd: seo.jsonLd,
        sitemapUrl: "/sitemap.xml",
      };
    }
  } catch (error: unknown) {
    // Log the error but don't fail the build
    if (
      (error as { response?: { status?: number } }).response?.status === 429
    ) {
    } else {
    }
  }
  return { jsonLd: null, sitemapUrl: null };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { jsonLd, sitemapUrl } = await getSeoData();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FFSEP7RYRQ"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FFSEP7RYRQ');
          `}
        </Script>
        {/* Suppress console warnings in development */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                const originalError = console.error;
                const originalWarn = console.warn;
                
                console.error = (...args) => {
                  if (
                    typeof args[0] === 'string' && (
                      args[0].includes('Hydration') ||
                      args[0].includes('hydration') ||
                      args[0].includes('did not match') ||
                      args[0].includes('Warning: ') ||
                      args[0].includes('preloaded using link preload') ||
                      args[0].includes('cannot contain') ||
                      args[0].includes('ERR_CACHE_OPERATION_NOT_SUPPORTED') ||
                      args[0].includes('ERR_BLOCKED_BY_CLIENT')
                    )
                  ) {
                    return;
                  }
                  originalError.apply(console, args);
                };
                
                console.warn = (...args) => {
                  if (
                    typeof args[0] === 'string' && (
                      args[0].includes('Hydration') ||
                      args[0].includes('hydration') ||
                      args[0].includes('did not match') ||
                      args[0].includes('Warning: ') ||
                      args[0].includes('Please ensure') ||
                      args[0].includes('preloaded using link preload') ||
                      args[0].includes('cannot contain') ||
                      args[0].includes('ERR_CACHE_OPERATION_NOT_SUPPORTED') ||
                      args[0].includes('ERR_BLOCKED_BY_CLIENT')
                    )
                  ) {
                    return;
                  }
                  originalWarn.apply(console, args);
                };
              }
            `,
          }}
        />
        {jsonLd && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        )}
        {sitemapUrl && (
          <link rel="sitemap" type="application/xml" href={sitemapUrl} />
        )}
      </head>
      <body
        className={` antialiased max-w-[2000px]  mx-auto `}
        suppressHydrationWarning
      >
        <ErrorBoundaryWrapper>
          <RecaptchaProvider>
            <TransitionProvider>
              <ColorProvider>
                {/* <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange> */}
                <Preloader />
                <Navbar />
                <PageTransition>
                  {children}
                  <Footer />
                </PageTransition>
                {/* </ThemeProvider> */}
              </ColorProvider>
              <WhatsAppButton />
              <NewsletterDialog />
              <Toaster />
            </TransitionProvider>
            <div id="portal-root" />
          </RecaptchaProvider>
        </ErrorBoundaryWrapper>
      </body>
    </html>
  );
}

export const revalidate = 10;
