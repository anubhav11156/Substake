import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NextPage } from "next";

import { StakeTable } from "@/components/tables/stakeTable/client";
import { UnstakeTable } from "@/components/tables/unstakeTable/client";
import ApplicationLayout from "@/layouts/ApplicationLayout";

const stakeData = [
  {
    assets: 1,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 2,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 3,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },
  {
    assets: 1,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 2,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 3,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },
  {
    assets: 1,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 2,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 3,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },
  {
    assets: 1,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 2,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 3,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },
  {
    assets: 1,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 2,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 3,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },
  {
    assets: 1,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 2,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },

  {
    assets: 3,
    shares: 10,
    createdAt: "10/10/2021",
    stakeBatchId: 1234567890,
    network: "Ethereum",
    protcol: "Compound",
    status: "Active",
  },
];

const unstakeData = [
  {
    shares: 10,
    assetsExpected: 10,
    assetsFinalized: 10,
    unstakeBatchId: 38,
    network: "Ethereum",
    protocol: "Compound",
    status: "Active",
  },
  {
    shares: 10,
    assetsExpected: 10,
    assetsFinalized: 10,
    unstakeBatchId: 38,
    network: "Ethereum",
    protocol: "Compound",
    status: "Active",
  },
  {
    shares: 10,
    assetsExpected: 10,
    assetsFinalized: 10,
    unstakeBatchId: 38,
    network: "Ethereum",
    protocol: "Compound",
    status: "Active",
  },
];

const RewardPage: NextPage = () => {
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
              <StakeTable data={stakeData} />
            </TabsContent>
            <TabsContent value="unstake" className="pt-5" tabIndex={-1}>
              <UnstakeTable data={unstakeData} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ApplicationLayout>
  );
};

export default RewardPage;
