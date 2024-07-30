/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import RootProvider from "./RootProviders";

const urbanist = Urbanist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GMS",
  description: "Grants Management System For RTB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com"/>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>
      </head>
      <body className={urbanist.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
