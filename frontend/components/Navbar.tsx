import { ConnectKitButton } from "connectkit";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";

interface NavbarProps {
  isNavLink?: boolean;
  isConnectWallet?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({
  isNavLink = true,
  isConnectWallet = true,
}) => {
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
