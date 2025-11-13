import type { Metadata } from "next";
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
      <body className="bg-gray-50 dark:bg-gray-950">
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}

