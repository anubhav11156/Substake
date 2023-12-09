import type { Metadata } from "next";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Substake",
  description: "Substake",
};

const Home: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <Suspense fallback={<Loading />}>
      <div
        className="h-full overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #ffdead 0%, #e1d77d 100%)",
        }}
      >
        <Navbar isNavLink={false} />

        <div
          className={cn(
            font.className,
            "h-full lg:h-[calc(100vh-82px)] flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full max-w-[85rem] mx-auto px-3 gap-24 lg:gap-0"
          )}
        >
          <div className="mt-16 lg:mt-0 flex flex-col justify-center items-center lg:items-start lg:justify-start relative">
            <h1 className="font-bold text-6xl text-center lg:text-start text-mainBg leading-[4.8rem] tracking-wider">
              Unlock liquidity and <br className="hidden lg:flex" /> amplify
              rewards
            </h1>

            <p className="font-medium text-center lg:text-start text-lg text-[#4a4622] leading-[4.8rem] tracking-wider">
              Start liquid staking securely across multiple chains
            </p>

            <Button
              className="rounded-xl mt-3.5 lg:mt-5 bg-[#fadfb5] hover:bg-mainBg hover:text-white text-mainBg transition-all border-2 border-mainBg text-base font-semibold h-16 w-32 z-10 bg-transparent"
              onClick={() => router.push("/application/stake")}
            >
              Launch Dapp
            </Button>
          </div>

          <div className="relative w-[462px] h-[240px] xl:w-[562px] xl:h-[289px] mb-5 md:mb-0">
            <Image
              src="/hero_image.svg"
              fill
              className="object-cover"
              alt="hero_image"
            />

            <Image
              src="/scroll.svg"
              width={105}
              height={109}
              className="absolute left-8 bottom-4 xl:left-12 xl:bottom-12 animate-bounce duration-[5000ms] "
              alt="scroll"
            />

            <Image
              src="/ethereum.svg"
              width={80}
              height={80}
              className="absolute right-[2.5rem] xl:right-[3.8rem] top-[50%] animate-bounce duration-[5000ms] "
              alt="ethereum"
            />

            <Image
              src="/block.svg"
              width={107}
              height={108}
              className="absolute -top-[3.5rem] left-[39%] xl:-top-6 xl:left-[41%] animate-bounce duration-[5000ms] "
              alt="block"
            />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
