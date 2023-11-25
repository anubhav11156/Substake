import { Dot } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApplicationLayout from "@/layouts/ApplicationLayout";

const StakePage: NextPage = () => {
  return (
    <ApplicationLayout>
      <div className="max-w-[85rem] mx-auto w-full">
        <div className="mt-36 flex flex-col w-full max-w-lg mx-auto items-center px-3 sm:px-0">
          <div className="hover:bg-gray-200 transition-all shadow-sm relative border border-black p-4 w-full flex items-center gap-4">
            <Image src="/eth.svg" width={40} height={40} alt="eth" />

            <div className="flex flex-col">
              <p className="text-xs text-gray-400">AVAILABLE TO STAKE</p>
              <p className="font-bold">7.8 (balance)</p>
            </div>

            <p className="flex items-center absolute top-2 right-2 text-gray-400 uppercase text-xs font-medium">
              <Dot className="text-gray-300" /> Etherium
            </p>
          </div>

          <div className="border-x border-b border-gray-400 p-4 w-full flex items-center gap-3">
            <Input
              className="border-none outline-none placeholder:text-gray-400 text-black text-xl focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold placeholder:font-medium"
              placeholder="0.0"
            />

            <div className="bg-gray-200 px-2 py-1 w-fit text-xs font-medium">
              MAX
            </div>
          </div>

          <div className="mt-5 w-full text-xs space-y-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-gray-400 uppercase">you will recieve</p>
              <p>739248.981130118906064854</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-400 uppercase">gas estimation</p>
              <p>-- ETH</p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-gray-400 uppercase">slippage tolerance</p>
              <p>5.00% EDIT</p>
            </div>
          </div>

          <Button className="mt-5 rounded-none w-full h-[52px] text-lg font-medium bg-black hover:bg-black/95">
            STAKE
          </Button>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default StakePage;
