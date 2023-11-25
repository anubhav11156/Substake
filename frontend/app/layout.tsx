import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import ConnectKitWrapper from "@/providers/ConnectKitWrapper";

const font = IBM_Plex_Mono({ subsets: ["latin"], weight: "300" });

export const metadata: Metadata = {
  title: "Substake",
  description: "Substake",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={font.className}>
        <ConnectKitWrapper>{children}</ConnectKitWrapper>
      </body>
    </html>
  );
}
