import type { Metadata } from "next";
import Script from "next/script";
import Navigation from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tempo - Outreach CRM",
  description: "Track your outreach and follow-ups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Privacy-friendly analytics by Plausible */}
        <Script
          async
          src="https://plausible.io/js/pa-5QVtZBFUUlibKXY6n03GU.js"
          strategy="afterInteractive"
        />
        <Script id="plausible-init" strategy="afterInteractive">
          {`
            window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
            plausible.init()
          `}
        </Script>
      </head>
      <body className="bg-gray-50 dark:bg-gray-950">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}

