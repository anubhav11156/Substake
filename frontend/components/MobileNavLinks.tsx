import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "./NavLinks";
import { Button } from "./ui/button";

const MobileNavLinks: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      {/* @ts-ignore */}
      <SheetContent>
        <div className="flex flex-col gap-10 w-full items-center pt-10">
          <NavLinks className="flex flex-col" />
          <Button className="rounded-none bg-[#627EEA] hover:bg-[#6d86ea] font-medium uppercase">
            Connect Wallet
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavLinks;
