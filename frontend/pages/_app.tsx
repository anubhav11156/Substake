import type { AppProps } from "next/app";
import { IBM_Plex_Mono } from "next/font/google";
import { useRouter } from "next/router";
import React from "react";
import { Toaster } from "sonner";

import Loading from "@/components/Loading";
import { cn } from "@/lib/utils";
import ConnectKitWrapper from "@/providers/ConnectKitWrapper";
import "@/styles/globals.css";

const font = IBM_Plex_Mono({ subsets: ["latin"], weight: "300" });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const handleRouteChange = (url: any) => {
      setLoading(true);
    };

    const handleRouteChangeComplete = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events]);

  if (loading) return <Loading />;

  return (
    <div className={cn(font.className, "bg-[#FFDEAD]")}>
      <ConnectKitWrapper>
        <Toaster
          position="bottom-right"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "bg-[#FFDEAD] border gap-3 right-0 font-semibold border-mainBg text-black/80 flex items-center p-4 rounded-xl shadow-lg",
            },
          }}
        />
        <Component {...pageProps} />
      </ConnectKitWrapper>
    </div>
  );
}
