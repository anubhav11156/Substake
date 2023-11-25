import { NextPage } from "next";

import ApplicationLayout from "@/layouts/ApplicationLayout";

const RewardPage: NextPage = () => {
  return (
    <ApplicationLayout>
      <div className="max-w-[85rem] mx-auto w-full">
        <h1 className="text-center mt-10">Reward</h1>
      </div>
    </ApplicationLayout>
  );
};

export default RewardPage;
