import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NextPage } from "next";

import { StakeTable } from "@/components/tables/stakeTable/client";
import { UnstakeTable } from "@/components/tables/unstakeTable/client";
import ApplicationLayout from "@/layouts/ApplicationLayout";

const RewardPage: NextPage = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  if (!isMounted) return null;

  return (
    <ApplicationLayout>
      <div className="h-[calc(100vh-82px)] max-w-[85rem] w-full mx-auto px-3">
        <div className="pt-20">
          <Tabs defaultValue="stake" className="w-full">
            <TabsList className="grid grid-cols-2 sm:w-[400px] w-[200px] h-[42px] bg-transparent border border-mainBg">
              <TabsTrigger
                value="stake"
                className="data-[state=active]:bg-mainBg data-[state=active]:text-white transition-all ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
              >
                Stake
              </TabsTrigger>
              <TabsTrigger
                value="unstake"
                className="data-[state=active]:bg-mainBg data-[state=active]:text-white transition-all ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
              >
                Unstake
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stake" className="pt-5" tabIndex={-1}>
              <StakeTable />
            </TabsContent>
            <TabsContent value="unstake" className="pt-5" tabIndex={-1}>
              <UnstakeTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default RewardPage;
