import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getNetwork } from "@wagmi/core";
import { ConnectKitButton } from "connectkit";
import { ethers } from "ethers";
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
import { AddUserUntakesType } from "@/interfaces/UserStakes";
import ApplicationLayout from "@/layouts/ApplicationLayout";
import { cn } from "@/lib/utils";
import { getUserBalanceDetails } from "@/store/UserBalanceDetails";

const UnstakePage: NextPage = () => {
  const [unstakeValue, setUnstakeValue] = useState("");
  const [unstakeLoading, setUnstakeLoading] = useState(false);
  const [ethPerSubToken, setethPerSubToken] = useState("");
  const [receiveSUB, setReceiveSub] = useState(0);
  const [subTokenBalance] = getUserBalanceDetails((state) => [
    state.subTokenBalance,
  ]);
  const [isMounted, setIsMounted] = useState(false);

  const queryClient = useQueryClient();

  const { address } = useAccount();
  const { data } = useBalance({
    address: address,
  });
  const { connector, isConnected } = useAccount();
  const { chain } = getNetwork();
  const accountBalance = data?.formatted;

  const _chain = chain?.name;

  const vaultProxyAddress = config.substake.l2.vaultProxy;
  const vaultAbiPath = "../../abi/SubstakeVault.json";

  useEffect(() => {
    getSubTokenPerEth();
    caculateSubTokenAmount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unstakeValue]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  const caculateSubTokenAmount = useCallback(() => {
    let ethAmount = Number(unstakeValue) * Number(ethPerSubToken);
    setReceiveSub(ethAmount);
  }, [ethPerSubToken, unstakeValue]);

  const getSubTokenPerEth = useCallback(async () => {
    const jsonProvider = new ethers.providers.JsonRpcProvider(
      process.env.NEXT_PUBLIC_SCROLL_RPC!
    );
    const contract = new ethers.Contract(
      vaultProxyAddress,
      VAULT_ABI.abi,
      jsonProvider
    );
    try {
      await contract.subTokenPerEth().then((response:any) => {
        let subPerEth = ethers.utils.parseUnits(response.toString());
        let converted = (Number(subPerEth) / 10 ** 18).toFixed(3);
        setethPerSubToken(converted);
      });
    } catch (error) {
      console.log(error);
    }
  }, [vaultProxyAddress]);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: async (data: AddUserUntakesType) => {
      const res = await fetch("http://localhost:3000/api/addUserUnstakes", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res?.status !== 200)
        return toast.error("Someting went wrong!", { id: "stake" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stakeData"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const unstakeHandler = async () => {
    if (!unstakeValue) return toast.error("Please enter a amount!");
    if (unstakeValue === "0")
      return toast.error("Please enter a valid amount!");

    setUnstakeLoading(true);
    toast.loading("Unstaking...", { id: "unstake" });

    const modal = new web3modal({
      cacheProvider: true,
    });
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = await provider.getSigner();
    const unstakeAmount = ethers.utils.parseEther(unstakeValue);

    const contract = new ethers.Contract(
      vaultProxyAddress,
      VAULT_ABI.abi,
      signer
    );

    try {
      let aprvTx = await contract.approve(vaultProxyAddress, unstakeAmount);
      const aprvTxRes = await aprvTx.wait();

      if (aprvTxRes?.status === 0)
        return toast.error("Approved Failed!", { id: "unstake" });

      let unstakeBatchId;
      try {
        unstakeBatchId = (await contract.activeUnstakeBatch()).toString();
        if (!unstakeBatchId) return toast.error("Unstake failed");
      } catch (error) {
        console.log(error);
      }

      let tx = await contract.redeem(unstakeAmount, address, {
        gasLimit: 800000,
      });
      const txRes = await tx.wait();

      if (txRes?.status === 0)
        return toast.error("Redeem failed!", { id: "unstake" });

      mutate({
        address: address!,
        assetsExpected: 0,
        assetsFinalized: 0,
        unstakeBatchId: unstakeBatchId,
        protocol: "Uniswap V3",
        network: _chain!,
        shares: unstakeValue,
      });

      if (isPending) return toast.loading("Untaking...", { id: "unstake" });
      if (isError) return toast.error("Failed to unstake!", { id: "unstake" });

      toast.success("Successfully Unstaked!", { id: "unstake" });

      setUnstakeValue("");
      setUnstakeLoading(false);
    } catch (error) {
      toast.error("Failed to unstake!", { id: "unstake" });
      console.log("error:", error);
      setUnstakeValue("");
      setUnstakeLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <ApplicationLayout>
      <div className="h-[calc(100vh-82px)] justify-center flex flex-col mx-auto items-center px-3 sm:px-0">
        <div className="fixed -left-72 top-[80px] opacity-60">
          <div className="relative w-[695px] h-[1024px]">
            <Image src="/widget.svg" fill alt="eth" className="rotate-180" />
          </div>
        </div>

        <div className="rounded-xl border-2 border-mainBg w-full max-w-xl p-3 bg-[#fadfb5] shadow-xl z-30">
          <div className="rounded-tl-xl rounded-tr-xl hover:bg-[#fadfb5] transition-all shadow-sm relative border border-mainBg p-4 w-full flex items-center gap-4">
            <div className="p-2 bg-mainBg rounded-[14px]">
              <Image src="/logo_white.svg" width={25} height={25} alt="eth" />
            </div>

            <div className="flex flex-col">
              <p className="text-xs text-gray-500 uppercase">
                available to unstake
              </p>
              <p className="font-bold">{isConnected ? subTokenBalance : 0.0}</p>
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
              value={unstakeValue ? unstakeValue : ""}
              onChange={(e) => setUnstakeValue(e.target.value)}
              className="border-none outline-none placeholder:text-gray-500 text-black text-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium bg-[#fadfb5]"
              placeholder="0.0"
              type="number"
            />

            <button
              disabled={unstakeLoading}
              onClick={() => {
                if (!isConnected) {
                  toast.error("Please connect your wallet first");
                } else setUnstakeValue(subTokenBalance ? subTokenBalance : "");
              }}
              className="bg-[#9b923b] hover:bg-[#a99f44] text-white/90 px-2 py-1 w-fit text-xs font-medium cursor-pointer transition-all rounded-md ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              MAX
            </button>
          </div>

          <div className="mt-5 w-full text-xs space-y-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-500 uppercase">
                you will recieve (expected)
              </p>
              <p>{receiveSUB} ETH</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-500 uppercase">Exchange Rate</p>
              <p>1 SUB = {ethPerSubToken} ETH </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-500 uppercase">Protocol Fee</p>
              <p>0.05 %</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-gray-500 uppercase">APR</p>
              <p>3.45 %</p>
            </div>
          </div>

          {isConnected ? (
            <Button
              disabled={unstakeLoading}
              onClick={unstakeHandler}
              className="mt-5 rounded-xl w-full h-[52px] text-lg font-medium bg-[#9b923b] hover:bg-[#a99f44] text-white/90 transition-all uppercase ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
            >
              Unstake
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

export default UnstakePage;
