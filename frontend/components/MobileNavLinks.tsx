import { ConnectKitButton } from "connectkit";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import NavLinks from "./NavLinks";
import { Button } from "./ui/button";

const MobileNavLinks: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent>
        <div className="flex flex-col gap-10 w-full items-center pt-10">
          <NavLinks className="flex flex-col" />

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
                    "rounded-none font-normal uppercase transition-all",
                    {
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
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavLinks;
