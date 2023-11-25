import { Dot } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApplicationLayout from "@/layouts/ApplicationLayout";
import { useAccount, useBalance, useConnect } from 'wagmi';
import { getNetwork } from '@wagmi/core'


const StakePage: NextPage = () => {

  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });

  const accountBalance = data?.formatted;

  const { connector: activeConnector, isConnected } = useAccount();
  console.log(isConnected);


  const { chain, chains } = getNetwork();

  console.log("chain : ",chain);

  return (
    <ApplicationLayout>
      <div className="max-w-[85rem] mx-auto w-full">
        <div className="mt-36 flex flex-col w-full max-w-lg mx-auto items-center px-3 sm:px-0">
          <div className="hover:bg-gray-200 transition-all shadow-sm relative border border-black p-4 w-full flex items-center gap-4">
            <Image src="/eth.svg" width={40} height={40} alt="eth" />

            <div className="flex flex-col">
              <p className="text-xs text-gray-400">AVAILABLE TO STAKE</p>
              <p className="font-bold">
                {isConnected ? `${accountBalance}` : "0.0"}
              </p>
            </div>

            <p className="flex items-center absolute top-2 right-2 text-gray-400 uppercase text-xs font-medium">
              <Dot className="text-gray-300" /> Scroll
            </p>
          </div>

          <div className="border-x border-b border-gray-400 p-4 w-full flex items-center gap-3">
            <Input
              className="border-none outline-none placeholder:text-gray-400 text-black text-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium"
              placeholder="0.0"
            />

            <div className="bg-gray-200 px-2 py-1 w-fit text-xs font-medium">
              MAX
            </div>
          </div>

          <div className="mt-5 w-full text-xs space-y-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-400 uppercase">you will recieve</p>
              <p>739248.981130118906064854 SUB</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-400 uppercase">Exchange Rate</p>
              <p>1 SUB = 1.0000001 ETH </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-400 uppercase">Protocol Fee</p>
              <p>0.01 %</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 uppercase">APR</p>
              <p>3.45 %</p>
            </div>
          </div>

          <Button className="mt-5 rounded-none w-full h-[52px] text-lg font-medium bg-black hover:bg-black/95">
            {isConnected ? "STAKE" : "CONNECT WALLET"}
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default StakePage;
