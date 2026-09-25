import type { Metadata } from "next";
import "./globals.css";
import MobileGuard from "@/components/MobileGuard";

export const metadata: Metadata = {
  title: "AKAR",
  description: "An app",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <MobileGuard>{children}</MobileGuard>
      </body>
    </html>
  );
}
