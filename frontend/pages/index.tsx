import { Suspense } from "react";
import type { Metadata } from "next";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Loading from "@/components/Loading";

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

        <div className="flex flex-col justify-center items-center mt-32">
          <h1 className="text-2xl text-center">Landing page</h1>

          <Button
            className="rounded-none mt-5 bg-[#637FEA] hover:bg-[#708ae8]"
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
