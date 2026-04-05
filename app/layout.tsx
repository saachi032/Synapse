import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synapse",
  description: "AI-powered study workspace for your PDFs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
