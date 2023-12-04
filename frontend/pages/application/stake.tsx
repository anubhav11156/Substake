import { getNetwork } from "@wagmi/core";
import { ConnectKitButton } from "connectkit";
import { Dot } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";
import { useAccount, useBalance, useConnect } from "wagmi";
import web3modal from "web3modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApplicationLayout from "@/layouts/ApplicationLayout";
import { toast } from "sonner";

const { ethers, JsonRpcProvider } = require("ethers");
let fs = require("fs");
require("dotenv").config();
const fsPromise = fs.promises;

const vaultAbiPath = "../../contracts/out/SubstakeVault.sol/SubstakeVault.json";
const vaultContractAddress = "0x9F8a444192459a84e99290748309415f7f19bFBA";
const privateKey = "0x...";
const scrollSepoliaRPC = "https://rpc.scroll.network";

const StakePage: NextPage = () => {
  async function getAbi(path: string) {
    const data = await fsPromise.readFile(path, "utf-8");
    const abi = JSON.parse(data);
    return abi;
  }
  const [stakeValue, setStakeValue] = useState("");

  const { address, isConnecting, isDisconnected } = useAccount();
  const { data, isError, isLoading } = useBalance({
    address: address,
  });
  const { connector: activeConnector, isConnected } = useAccount();
  const { chain, chains } = getNetwork();
  const accountBalance = data?.formatted;

  const _chain = chain?.name;

  const stakeHandler = async () => {
    const modal = new web3modal({
      cacheProvider: true,
    });
    const connection = await modal.connect();

    const provider = new JsonRpcProvider(scrollSepoliaRPC);
    const signer = new ethers.Wallet(privateKey, provider);

    const vaultAbi = await getAbi(vaultAbiPath);

    const vaultContract = new ethers.Contract(vaultContractAddress, vaultAbi, signer);

    const tx = await vaultContract.stake({ value: ethers.utils.parseEther(stakeValue) });
  };

  return (
    <ApplicationLayout>
      <div className="h-[calc(100vh-82px)] flex flex-col w-full max-w-xl mx-auto justify-center items-center px-3 sm:px-0 overflow-hidden">
        <div className="fixed -right-72 top-[68px] sm:top-[80px] opacity-60">
          <div className="relative w-[695px] h-[1024px]">
            <Image src="/widget.svg" fill alt="eth" />
          </div>
        </div>

        <div className="rounded-xl border-2 border-mainBg w-full p-3 bg-[#fadfb5] shadow-xl z-30">
          <div className="rounded-tl-xl rounded-tr-xl transition-all shadow-sm relative border border-mainBg p-4 w-full flex items-center gap-4">
            <Image src="/eth.svg" width={40} height={40} alt="eth" />

            <div className="flex flex-col">
              <p className="text-xs text-gray-500">AVAILABLE TO STAKE</p>
              <p className="font-bold">{isConnected ? accountBalance : 0.0}</p>
            </div>
            <span className="flex items-center absolute top-2 right-2 text-gray-500 uppercase text-xs font-medium">
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
            </span>
          </div>

          <div className="border-x border-b border-mainBg p-4 w-full flex items-center gap-3 rounded-bl-xl rounded-br-xl">
            <Input
              value={stakeValue ? stakeValue : ""}
              onChange={(e) => setStakeValue(e.target.value)}
              className="border-none outline-none placeholder:text-gray-500 text-black text-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium bg-[#fadfb5]"
              placeholder="0.0"
              type="number"
            />

            <div
              onClick={() => {
                if (!isConnected) {
                  toast.error("Please connect your wallet first");
                } else setStakeValue(accountBalance ? accountBalance : "");
              }}
              className="bg-[#9b923b] hover:bg-[#a99f44] text-white/90 px-2 py-1 w-fit text-xs font-medium cursor-pointer transition-all rounded-md"
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
            <Button
              onClick={stakeHandler}
              className="mt-5 rounded-xl w-full h-[52px] text-lg font-medium bg-[#9b923b] hover:bg-[#a99f44] text-white/90 transition-all uppercase"
            >
              Stake
            </Button>
          ) : (
            <ConnectKitButton.Custom>
              {({ show }) => {
                return (
                  <Button
                    onClick={show}
                    className="mt-5 rounded-xl w-full h-[52px] text-lg font-medium bg-[#9b923b] hover:bg-[#a99f44] text-white/90 uppercase transition-all"
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
