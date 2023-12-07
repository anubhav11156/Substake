import { ConnectKitButton } from "connectkit";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";
import { N, ethers, JsonRpcProvider } from "ethers";
import { useState, useEffect } from "react";
import { VAULT_ABI } from "@/abi/abi";
import { config, getAbi } from "@/configData";
import { useAccount, useBalance } from "wagmi";

interface NavbarProps {
  isNavLink?: boolean;
  isConnectWallet?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isNavLink = true,
  isConnectWallet = true,
}) => {

  const [subTokenBalance, setSubTokenBalance] = useState("");
  const { address, isConnecting, isDisconnected } = useAccount();

  const vaultProxyAddress = config.substake.l2.vaultProxy;

  useEffect(()=>{
    getUserSubTokenBalance();
  },[subTokenBalance, address]);

  const getUserSubTokenBalance = async () => {
    const jsonProvider = new JsonRpcProvider(process.env.NEXT_PUBLIC_SCROLL_RPC!);
    const contract = new ethers.Contract(vaultProxyAddress,
      VAULT_ABI.abi,
      jsonProvider
    );
    try {
      await contract.balanceOf(address)
        .then((response) => {
          let subBalance = (Number(response) / 10 ** 18).toFixed(6);
          setSubTokenBalance(subBalance);
        })
    } catch (error) {
      console.log("Failed to fetch SUB balance ",error);
    }
  }

  return (
    <header className="w-full border-b border-mainBg transition-all">
      <div className="flex items-center justify-between max-w-[85rem] w-full mx-auto py-5 px-3">
        <div className="flex items-center gap-16">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
          >
            <Image
              src="/logo2.svg"
              width={40}
              height={40}
              alt="logo"
              className="-rotate-90"
            />
            <p className="text-xl font-bold">SUBSTAKE</p>
          </Link>

          {isNavLink && (
            <div className="hidden sm:flex">
              <NavLinks />
            </div>
          )}
        </div>

        <ConnectKitButton.Custom>
          {({
            isConnected,
            isConnecting,
            show,
            hide,
            address,
            ensName,
            chain,
          }) => {
            return (
              <Button
                onClick={show}
                className={cn(
                  "rounded-xl font-medium uppercase transition-all w-36 bg-[#9b923b] hover:bg-[#a99f44] text-white/90 ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2",
                  {
                    "hidden sm:flex": !isConnectWallet,
                  }
                )}
              >
                {isConnected
                  ? `${address?.slice(0, 5)}...${address?.slice(-5)}`
                  : "connect"}
              </Button>
            );
          }}
        </ConnectKitButton.Custom>

        {isNavLink && (
          <div className="sm:hidden flex items-center gap-4">
            <MobileNavLinks />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
