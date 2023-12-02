import type { Metadata } from "next";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { useAccount } from "wagmi";

import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

        <div className="h-[calc(100vh-82px)] flex flex-col justify-center items-center">
          <h1 className="text-2xl text-center">Landing page</h1>

          <Button
            className="rounded-none mt-5 bg-[#9b923b] hover:bg-[#a99f44] text-white/90"
            onClick={() => router.push("/application/stake")}
          >
            Launch Dapp
          </Button>
        </div>
      </div>
    </Suspense>
  );
};

export default Home;
