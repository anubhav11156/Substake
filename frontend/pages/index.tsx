import type { Metadata } from "next";
import { NextPage } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useAccount } from "wagmi";

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
  const router = useRouter();

  const { address } = useAccount();

  return (
    <Suspense fallback={<Loading />}>
      <div className="h-full">
        <Navbar isNavLink={false} />

        {/* <div className="fixed -right-72 top-[68px] sm:top-[80px] opacity-60">
          <div className="relative w-[695px] h-[1024px]">
            <Image src="/mainbg.svg" fill alt="eth" />
          </div>
        </div> */}

        <div
          className={cn(
            font.className,
            "h-full lg:h-[calc(100vh-82px)] flex flex-col lg:flex-row justify-center lg:justify-between items-center w-full max-w-[85rem] mx-auto px-3 gap-8 lg:gap-0"
          )}
        >
          <div className="mt-16 lg:mt-0 flex flex-col justify-center items-center lg:items-start lg:justify-start">
            <h1 className="font-bold text-6xl text-center lg:text-start text-mainBg leading-[4.8rem] tracking-wider">
              Unlock liquidity and <br className="hidden lg:flex" /> amplify
              rewards
            </h1>

            <p className="font-medium text-center lg:text-start text-lg text-[#4a4622] leading-[4.8rem] tracking-wider">
              Start liquid staking securely across multiple chains
            </p>

            <Button
              className="rounded-xl mt-3.5 lg:mt-5 bg-[#fadfb5] hover:bg-mainBg hover:text-white text-mainBg transition-all border-2 border-mainBg text-base font-semibold h-16 w-32"
              onClick={() => router.push("/application/stake")}
            >
              Launch Dapp
            </Button>
          </div>

          <div className="">
            <Image src="/logo.svg" width={500} height={500} alt="sldkjf" />
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
