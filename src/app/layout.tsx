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
      <body className={urbanist.className}>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
