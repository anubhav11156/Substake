import { ConnectKitButton } from "connectkit";
import { JsonRpcProvider, ethers } from "ethers";
import Image from "next/image";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import Link from "next/link";

import { VAULT_ABI } from "@/abi/abi";
import { Button, buttonVariants } from "@/components/ui/button";
import { config, getAbi } from "@/configData";
import { cn } from "@/lib/utils";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";
import { getUserBalanceDetails } from "@/store/UserBalanceDetails";

interface NavbarProps {
  isNavLink?: boolean;
  isConnectWallet?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isNavLink = true,
  isConnectWallet = true,
}) => {
  const { address, isConnected } = useAccount();
  const [subTokenBalance, setSubTokenBalance] = getUserBalanceDetails(
    (state) => [state.subTokenBalance, state.setSubTokenBalance]
  );

  const vaultProxyAddress = config.substake.l2.vaultProxy;

  useEffect(() => {
    getUserSubTokenBalance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subTokenBalance, address]);

  const getUserSubTokenBalance = async () => {
    const jsonProvider = new JsonRpcProvider(
      process.env.NEXT_PUBLIC_SCROLL_RPC!
    );
    const contract = new ethers.Contract(
      vaultProxyAddress,
      VAULT_ABI.abi,
      jsonProvider
    );
    try {
      await contract.balanceOf(address).then((response) => {
        let subBalance = ethers.parseUnits(response.toString());
        let converted = (Number(subBalance) / 10 ** 18).toFixed(3);
        setSubTokenBalance(converted.toString());
      });
    } catch (error) {
      console.log("Failed to fetch SUB balance ", error);
    }
  };

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
            <div className="hidden md:flex">
              <NavLinks />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isConnected && (
            <div
              className={cn(
                buttonVariants(),
                "rounded-xl font-medium uppercase transition-all w-full bg-[#9b923b] hover:bg-transparent text-white/90 ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2 items-center gap-2 truncate border border-mainBg bg-transparent hidden md:flex"
              )}
            >
              <div className="p-2 bg-mainBg rounded-full">
                <Image src="/logo_white.svg" width={15} height={15} alt="eth" />
              </div>
              <span className="truncate text-black">
                {!subTokenBalance ? "0.0000" : subTokenBalance}
              </span>
            </div>
          )}

          <ConnectKitButton.Custom>
            {({ isConnected, show, address }) => {
              return (
                <Button
                  onClick={show}
                  className={cn(
                    "rounded-xl font-medium uppercase transition-all w-36 bg-[#9b923b] hover:bg-[#a99f44] text-white/90 ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2",
                    {
                      "hidden md:flex": !isConnectWallet,
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
        </div>

        {isNavLink && (
          <div className="md:hidden flex items-center gap-4">
            <MobileNavLinks subTokenBalance={subTokenBalance} />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
