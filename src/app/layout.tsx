import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AgentPro - Platform Listing Properti Terpercaya",
  description: "Temukan rumah, tanah, apartemen, dan properti impian Anda. Platform listing properti profesional dengan akses langsung ke agen terpercaya.",
};

import { SavedPropertiesProvider } from "@/context/SavedPropertiesContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} h-full antialiased font-sans`}
    >
      <body className="min-h-full flex flex-col">
        <SavedPropertiesProvider>
          {children}
        </SavedPropertiesProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
