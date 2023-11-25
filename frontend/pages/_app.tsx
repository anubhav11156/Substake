import type { AppProps } from "next/app";
import { IBM_Plex_Mono } from "next/font/google";
import { Toaster } from "sonner";

import "@/styles/globals.css";
import ConnectKitWrapper from "@/providers/ConnectKitWrapper";

const font = IBM_Plex_Mono({ subsets: ["latin"], weight: "300" });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={font.className}>
      <ConnectKitWrapper>
        <Toaster position="bottom-right" />
        <Component {...pageProps} />
      </ConnectKitWrapper>
    </div>
  );
}
