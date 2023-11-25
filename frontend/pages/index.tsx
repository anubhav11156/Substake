import type { Metadata } from "next";
import { NextPage } from "next";
import { useRouter } from "next/navigation";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useAccount } from "wagmi";

export const metadata: Metadata = {
  title: "Substake",
  description: "Substake",
};

const Home: NextPage = () => {
  const router = useRouter();

  const { address } = useAccount();

  return (
    <div className="h-full">
      <Navbar isNavLink={false} />

      <div className="flex flex-col justify-center items-center mt-32">
        <h1 className="text-2xl text-center">Landing page</h1>

        <Button
          className="rounded-none mt-5"
          onClick={() => router.push("/application/stake")}
        >
          Launch Dapp
        </Button>
      </div>
    </div>
  );
};

export default Home;
