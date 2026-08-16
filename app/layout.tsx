import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Poppins } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import SiteShell from "@/components/Layout/SiteShell";
import "./globals.css";

// IBM Plex Sans + Mono for everything site-wide, varying weight for
// hierarchy rather than mixing in a separate display/serif font (previously
// Cormorant Garamond for the Hero name, and an unused IBM Plex Serif load).
// Poppins is the one deliberate exception — used only for the "sgs."
// wordmark in the nav, matching the original favicon's typeface.
const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = "https://sarbagyaghoshrestha.com.np";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Sarbagya Gho Shrestha — Engineer | Innovator | Artist",
    template: "%s — Sarbagya Gho Shrestha",
  },
  description:
    "Sarbagya Gho Shrestha - Engineer | Innovator | Artist | IOE Pulchowk Campus",
  keywords: [
    "Sarbagya Gho Shrestha",
    "Engineer",
    "Innovator",
    "Artist",
    "Machine Learning",
    "5G Networks",
    "Research",
    "Duke University",
    "IOE",
    "Nepal",
    "Earthquake Prediction",
    "V2X Communication",
  ],
  authors: [{ name: "Sarbagya Gho Shrestha" }],
  openGraph: {
    title: "Sarbagya Gho Shrestha - Engineer | Innovator | Artist",
    url: siteUrl,
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarbagya Gho Shrestha - Engineer | Innovator | Artist",
  },
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#161616",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${plexSans.variable} ${plexMono.variable} ${poppins.variable}`}
    >
      <body className="bg-bg-primary text-text-primary font-sans antialiased transition-colors duration-carbon-moderate-01">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
