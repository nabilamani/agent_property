import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { SavedPropertiesProvider } from "@/context/SavedPropertiesContext";

import { getAgent } from "@/app/actions/agent";

export async function generateMetadata(): Promise<Metadata> {
  const agent = await getAgent();
  const logoUrl = agent?.logo || "/favicon.ico";

  return {
    title: "AgentPro - Platform Listing Properti Terpercaya",
    description: "Temukan rumah, tanah, apartemen, dan properti impian Anda. Platform listing properti profesional dengan akses langsung ke agen terpercaya.",
    icons: {
      icon: logoUrl,
      shortcut: logoUrl,
      apple: logoUrl,
    },
  };
}

import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SavedPropertiesProvider>
            {children}
          </SavedPropertiesProvider>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
