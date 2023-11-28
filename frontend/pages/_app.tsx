import type { AppProps } from "next/app";
import { IBM_Plex_Mono } from "next/font/google";
import { useRouter } from "next/router";
import React from "react";
import { Toaster } from "sonner";

import ConnectKitWrapper from "@/providers/ConnectKitWrapper";
import "@/styles/globals.css";
import Loading from "@/components/Loading";

const font = IBM_Plex_Mono({ subsets: ["latin"], weight: "300" });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  // React.useEffect(() => {
  //   const handleRouteChange = (url: any) => {
  //     setLoading(true);
  //   };

  //   const handleRouteChangeComplete = () => {
  //     setLoading(false);
  //   };

  //   router.events.on("routeChangeStart", handleRouteChange);
  //   router.events.on("routeChangeComplete", handleRouteChangeComplete);

  //   return () => {
  //     router.events.off("routeChangeStart", handleRouteChange);
  //     router.events.off("routeChangeComplete", handleRouteChangeComplete);
  //   };
  // }, [router.events]);

  // if (loading) return <Loading />;

  return (
    <div className={font.className}>
      <ConnectKitWrapper>
        <Toaster position="bottom-right" />
        <Component {...pageProps} />
      </ConnectKitWrapper>
    </div>
  );
}
