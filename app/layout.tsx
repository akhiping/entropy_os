import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Entropy - The Operating System for Knowledge Work",
  description: "Connect your tools. See the invisible connections. Let AI orchestrate your work.",
  keywords: ["AI", "productivity", "knowledge graph", "workspace", "visualization"],
  authors: [{ name: "Entropy" }],
  openGraph: {
    title: "Entropy - The Operating System for Knowledge Work",
    description: "Connect your tools. See the invisible connections. Let AI orchestrate your work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-bg-void text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
