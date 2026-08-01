import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_Thai } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/app/providers";
import { FINCRAFT_BRAND } from "@/components/brand/fincraft-brand";
import { Toaster } from "@/components/ui/sonner";
import { THEME_COOKIE_NAME } from "@/features/theme/constants/theme-constants";
import { parseThemePreference } from "@/features/theme/types/theme-types";
import { getSiteUrl } from "@/lib/config/site-url";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const editorial = Noto_Serif_Thai({
  subsets: ["latin", "thai"],
  variable: "--font-editorial",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: FINCRAFT_BRAND.defaultTitle,
    template: FINCRAFT_BRAND.titleTemplate,
  },
  description: FINCRAFT_BRAND.description,
  applicationName: FINCRAFT_BRAND.name,
  keywords: [
    "financial literacy",
    "finance education",
    "interactive learning",
    "financial concepts",
    "financial simulation",
  ],
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: FINCRAFT_BRAND.name,
    title: FINCRAFT_BRAND.defaultTitle,
    description: FINCRAFT_BRAND.description,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: FINCRAFT_BRAND.defaultTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: FINCRAFT_BRAND.defaultTitle,
    description: FINCRAFT_BRAND.description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    {
      media: "(prefers-color-scheme: light)",
      color: FINCRAFT_BRAND.colors.lightTheme,
    },
    {
      media: "(prefers-color-scheme: dark)",
      color: FINCRAFT_BRAND.colors.darkTheme,
    },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const rawThemeCookie = cookieStore.get(THEME_COOKIE_NAME)?.value;
  const initialPreference = parseThemePreference(rawThemeCookie);

  const isDark = initialPreference === "dark";
  const colorScheme =
    initialPreference === "dark"
      ? "dark"
      : initialPreference === "light"
      ? "light"
      : undefined;

  return (
    <html
      lang="en"
      data-theme-preference={initialPreference}
      className={`${inter.variable} ${editorial.variable} h-full antialiased ${isDark ? "dark" : ""}`}
      style={colorScheme ? { colorScheme } : undefined}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--surface-flat,#FAFAF9)] text-[var(--color-text-primary,#1C1917)]">
        <Providers>
          {children}
          <Toaster position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
