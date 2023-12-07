import { ConnectKitButton } from "connectkit";
import { Menu } from "lucide-react";
import Image from "next/image";
import { useAccount } from "wagmi";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import NavLinks from "./NavLinks";
import { Button, buttonVariants } from "./ui/button";

const MobileNavLinks: React.FC<{ subTokenBalance: string }> = ({
  subTokenBalance,
}) => {
  const { address, isConnecting, isDisconnected, isConnected } = useAccount();

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2" />
      </SheetTrigger>
      <SheetContent className="bg-[#f9e5c7]">
        <div className="flex flex-col gap-10 w-full items-center pt-10">
          <NavLinks className="flex flex-col" />

          <div className="flex flex-col items-center gap-2">
            {isConnected && (
              <div
                className={cn(
                  buttonVariants(),
                  "rounded-xl font-thin uppercase transition-all w-full bg-[#9b923b] hover:bg-transparent text-white/90 ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2 flex items-center gap-2 truncate border border-mainBg bg-transparent"
                )}
              >
                <div className="p-2 bg-mainBg rounded-full">
                  <Image
                    src="/logo_white.svg"
                    width={15}
                    height={15}
                    alt="eth"
                  />
                </div>
                <span className="truncate text-black">
                  {!subTokenBalance ? "0.0000" : subTokenBalance}
                </span>
              </div>
            )}

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
                      "rounded-xl font-thin uppercase transition-all bg-[#9b923b] hover:bg-[#a99f44] text-white/90 ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
                    )}
                  >
                    {isConnected
                      ? `${address?.slice(0, 5)}...${address?.slice(-5)}`
                      : "connect wallet"}
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavLinks;
