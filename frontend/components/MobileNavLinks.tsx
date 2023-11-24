import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import NavLinks from "./NavLinks";

const MobileNavLinks: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      {/* @ts-ignore */}
      <SheetContent>
        <NavLinks className="flex flex-col mt-10" />
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavLinks;
