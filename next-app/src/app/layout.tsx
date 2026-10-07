import type { Metadata } from "next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageTransitionReset } from "@/lib/page-transition";

export const metadata: Metadata = {
  title: "Lide Li | Product Designer",
  description:
    "Lide is a Product Designer crafting experiences that blend Design, Data, and AI.",
  openGraph: {
    title: "Lide Li",
    description: "Product Designer for 0→1 AI, SaaS, and developer tools.",
    url: "https://www.lide.studio",
    siteName: "Lide Li",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col antialiased" suppressHydrationWarning>
        <PageTransitionReset />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
