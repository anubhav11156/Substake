import { Menu } from "lucide-react";
import Link from "next/link";
import MobileNavLinks from "./MobileNavLinks";
import NavLinks from "./NavLinks";
import { Button } from "./ui/button";

interface NavbarProps {
  isNavLink?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isNavLink = true }) => {
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

        <Button className="rounded-none hidden sm:flex bg-[#627EEA] hover:bg-[#6d86ea] font-medium uppercase">
          Connect Wallet
        </Button>

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
