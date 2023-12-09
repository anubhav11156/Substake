import { getNetwork } from "@wagmi/core";
import { ConnectKitButton } from "connectkit";
import { JsonRpcProvider, N, ethers } from "ethers";
import { Dot } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAccount, useBalance } from "wagmi";
import web3modal from "web3modal";

import { VAULT_ABI } from "@/abi/abi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { config } from "@/configData";
import ApplicationLayout from "@/layouts/ApplicationLayout";
import { cn } from "@/lib/utils";

const StakePage: NextPage = () => {
  const [stakeValue, setStakeValue] = useState("");
  const [ethPerSubToken, setEthPerSubToken] = useState("");
  const [receiveSUB, setReceiveSub] = useState(0);
  const [stakeLoading, setStakeLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { address } = useAccount();

  const { data } = useBalance({
    address: address,
  });
  const { isConnected } = useAccount();
  const { chain } = getNetwork();
  const accountBalance = data?.formatted;
  const _chain = chain?.name;

  const vaultProxyAddress = config.substake.l2.vaultProxy;

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    getEthPerSub();
    caculateSubTokenAmount();
  }, [stakeValue]);

  const caculateSubTokenAmount = useCallback(() => {
    let subTokenAmont = Number(stakeValue) * Number(ethPerSubToken);
    setReceiveSub(subTokenAmont);
  }, [stakeValue, ethPerSubToken]);

  const getEthPerSub = useCallback(async () => {
    const jsonProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_SCROLL_RPC!
    );
    const contract = new ethers.Contract(
      vaultProxyAddress,
      VAULT_ABI.abi,
      jsonProvider
    );
    try {
      await contract.ethPerSubToken().then((response) => {
        let ethPerSub = (Number(response) / 10 ** 18).toFixed(4);
        setEthPerSubToken(ethPerSub);
      });
    } catch (error) {
      console.log(error);
    }
  }, [vaultProxyAddress]);

  const stakeHandler = async () => {
    if (!stakeValue) return toast.error("Please enter an amount!");
    if (Number(stakeValue) === 0)
      return toast.error("Please enter a valid amount!");

    setStakeLoading(true);
    toast.loading("Staking...", { id: "stake" });

    const modal = new web3modal({
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.BrowserProvider(connection);
    const signer = await provider.getSigner();
    const stakeAmount = ethers.parseEther(stakeValue);

    const contract = new ethers.Contract(
      vaultProxyAddress,
      VAULT_ABI.abi,
      signer
    );

    let stakeBatchId;
    try {
      stakeBatchId = contract
        .activeStakeBatch()
        .then((res) => console.log(Number(res)));
    } catch (error) {
      console.log(error);
    }

    if (!stakeBatchId) return toast.error("Deposit failed");

    try {
      let tx = await contract.deposit(stakeAmount, address, {
        value: stakeAmount,
        gasLimit: 1100000,
      });

      toast.success("Successfully Staked!", { id: "stake" });
      setStakeValue("");
      setStakeLoading(false);
    } catch (error) {
      toast.error("Failed to stake!", { id: "stake" });
      setStakeValue("");
      setStakeLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <ApplicationLayout>
      <div className="h-[calc(100vh-82px)] flex flex-col mx-auto justify-center items-center px-3 sm:px-0 overflow-hidden">
        <div className="fixed -right-72 top-[80px] opacity-60">
          <div className="relative w-[695px] h-[1024px]">
            <Image src="/widget.svg" fill alt="eth" />
          </div>
        </div>

        <div className="shadow-xl rounded-xl border-2 border-mainBg w-full max-w-xl p-3 bg-[#fadfb5] z-40">
          <div className="rounded-tl-xl rounded-tr-xl transition-all shadow-sm relative border border-mainBg p-4 w-full flex items-center gap-4">
            <Image src="/eth.svg" width={40} height={40} alt="eth" />

            <div className="flex flex-col">
              <p className="text-xs text-gray-500">AVAILABLE TO STAKE</p>
              <p className="font-bold">{isConnected ? accountBalance : 0.0}</p>
            </div>

            <div className="absolute top-2 right-2 uppercase font-medium text-xs flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger className="sm:hidden rounded-xl">
                    <Dot
                      className={cn("text-red-500", {
                        "text-green-500": isConnected,
                      })}
                    />
                  </TooltipTrigger>
                  <TooltipContent
                    className={cn("bg-[#fadfb5] border-mainBg text-green-500", {
                      "text-red-500": !isConnected,
                    })}
                  >
                    {isConnected ? _chain : "Disconnected"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Dot
                className={cn("text-red-500 hidden sm:flex", {
                  "text-green-500": isConnected,
                })}
              />
              <span
                className={cn("text-green-500 hidden sm:flex", {
                  "text-red-500": !isConnected,
                })}
              >
                {isConnected ? _chain : "Disconnected"}
              </span>
            </div>
          </div>

          <div className="border-x border-b border-mainBg p-4 w-full flex items-center gap-3 rounded-bl-xl rounded-br-xl">
            <Input
              value={stakeValue ? stakeValue : ""}
              onChange={(e) => setStakeValue(e.target.value)}
              className="border-none outline-none placeholder:text-gray-500 text-black text-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium bg-[#fadfb5]"
              placeholder="0.0"
              type="number"
              disabled={stakeLoading}
            />

            <button
              disabled={stakeLoading}
              onClick={() => {
                if (!isConnected) {
                  toast.error("Please connect your wallet first");
                } else setStakeValue(accountBalance ? accountBalance : "");
              }}
              className="bg-[#9b923b] hover:bg-[#a99f44] text-white/90 px-2 py-1 w-fit text-xs font-medium cursor-pointer transition-all rounded-md ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              MAX
            </button>
          </div>

          <div className="mt-5 w-full text-xs space-y-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-500 uppercase">you will recieve</p>
              <p>{receiveSUB} SUB</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-500 uppercase">Exchange Rate</p>
              <p>1 SUB = {ethPerSubToken} ETH </p>
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
            <Button
              disabled={stakeLoading}
              onClick={stakeHandler}
              className="mt-5 rounded-xl w-full h-[52px] text-lg font-medium bg-[#9b923b] hover:bg-[#a99f44] text-white/90 transition-all uppercase ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
            >
              Stake
            </Button>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => {
                return (
                  <Button
                    onClick={show}
                    className="mt-5 rounded-xl w-full h-[52px] text-lg font-medium bg-[#9b923b] hover:bg-[#a99f44] text-white/90 uppercase transition-all ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
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
