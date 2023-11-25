import { ConnectKitButton } from "connectkit";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
    <header className="w-full border-b border-black">
      <div className="flex items-center justify-between max-w-[85rem] w-full mx-auto py-5 px-3">
        <div className="flex items-center gap-16">
          <Link href="/">
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
                  "rounded-none font-medium uppercase transition-all",
                  {
                    "hidden sm:flex": !isConnectWallet,
                    "bg-gray-200 text-black hover:bg-gray-300": isConnected,
                  }
                )}
              >
                {isConnected
                  ? `${address?.slice(0, 5)}...${address?.slice(-5)}`
                  : "connect wallet"}
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
