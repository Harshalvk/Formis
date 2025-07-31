import type { Metadata } from "next";
import "./globals.css";
import { manrope } from "@/lib/fonts";
import AppProvider from "@/components/Providers/AppProvider";

export const metadata: Metadata = {
  title: "Formis",
  description: "AI form generator"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.className} antialiased`}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
