/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "@/styles/globals.css";
import RootProvider from "./RootProviders";
import { ToastProvider } from "@/components/ui/Toast"; 

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link rel="icon" href="favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Urbanist:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={urbanist.className}>
        <ToastProvider>
          <RootProvider>{children}</RootProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
