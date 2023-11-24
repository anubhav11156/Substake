import { Dot } from "lucide-react";
import { NextPage } from "next";
import Image from "next/image";

import { Input } from "@/components/ui/input";

const StakePage: NextPage = () => {
  return (
    <div className="max-w-[80rem] mx-auto w-full">
      <div className="mt-16 flex flex-col w-full max-w-lg mx-auto items-center px-3 sm:px-0">
        <div className="shadow-sm relative border border-black p-4 w-full flex items-center gap-4">
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
      </div>
    </div>
  );
};

export default StakePage;
