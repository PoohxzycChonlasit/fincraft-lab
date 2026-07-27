import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "@/app/providers";
import { Toaster } from "@/components/ui/sonner";
import { THEME_COOKIE_NAME } from "@/features/theme/constants/theme-constants";
import { parseThemePreference } from "@/features/theme/types/theme-types";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FinCraft Lab — Financial Literacy Discovery Lab",
  description:
    "Interactive Financial Literacy Discovery Lab for learning finance by combining elements and running simulations.",
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
      className={`${inter.variable} h-full antialiased ${isDark ? "dark" : ""}`}
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
