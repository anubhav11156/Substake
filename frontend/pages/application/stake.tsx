import { toast } from "sonner";
import { getNetwork } from "@wagmi/core";
import { Dot } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { useAccount, useBalance, useConnect } from "wagmi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApplicationLayout from "@/layouts/ApplicationLayout";
import { ConnectKitButton } from "connectkit";

const StakePage: NextPage = () => {
  const [stakeValue, setStakeValue] = useState("");

  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });
  const { connector: activeConnector, isConnected } = useAccount();
  const { chain, chains } = getNetwork();
  const accountBalance = data?.formatted;

  const _chain = chain?.name;

  return (
    <ApplicationLayout>
      <div className="max-w-[85rem] mx-auto w-full">
        <div className="mt-36 flex flex-col w-full max-w-lg mx-auto items-center px-3 sm:px-0">
          <div className="hover:bg-gray-200 transition-all shadow-sm relative border border-black p-4 w-full flex items-center gap-4">
            <Image src="/eth.svg" width={40} height={40} alt="eth" />

            <div className="flex flex-col">
              <p className="text-xs text-gray-500">AVAILABLE TO STAKE</p>
              <p className="font-bold">{isConnected ? accountBalance : 0.0}</p>
            </div>
            <p className="flex items-center absolute top-2 right-2 text-gray-500 uppercase text-xs font-medium">
              {isConnected ? (
                <>
                  <Dot className="text-gray-400" color="green" />
                  {_chain}
                </>
              ) : (
                <>
                  <Dot className="text-gray-400" color="red" />
                  DISCONNECTED
                </>
              )}
            </p>
          </div>

          <div className="border-x border-b border-gray-400 p-4 w-full flex items-center gap-3">
            <Input
              value={stakeValue ? stakeValue : ""}
              onChange={(e) => setStakeValue(e.target.value)}
              className="border-none outline-none placeholder:text-gray-500 text-black text-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium"
              placeholder="0.0"
              type="number"
            />

            <div
              onClick={() => {
                if (!isConnected) {
                  toast.error("Please connect your wallet first");
                } else setStakeValue(accountBalance ? accountBalance : "");
              }}
              className="bg-gray-200 px-2 py-1 w-fit text-xs font-medium cursor-pointer hover:bg-gray-300 transition-all"
            >
              MAX
            </div>
          </div>

          <div className="mt-5 w-full text-xs space-y-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-500 uppercase">you will recieve</p>
              <p>739248.9811 SUB</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-500 uppercase">Exchange Rate</p>
              <p>1 SUB = 1.0000001 ETH </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-500 uppercase">Protocol Fee</p>
              <p>0.01 %</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 uppercase">APR</p>
              <p>3.45 %</p>
            </div>
          </div>

          {isConnected ? (
            <Button className="mt-5 rounded-none w-full h-[52px] text-lg font-medium bg-[#637FEA] hover:bg-[#708ae8] transition-all uppercase">
              Stake
            </Button>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => {
                return (
                  <Button
                    onClick={show}
                    className="mt-5 rounded-none w-full h-[52px] text-lg font-medium bg-[#637FEA] hover:bg-[#708ae8] uppercase transition-all"
                  >
                    Connect Wallet
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          )}
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default StakePage;
