import { NextPage } from "next";
import { useConnect } from "wagmi";

import ApplicationLayout from "@/layouts/ApplicationLayout";

const UnstakePage: NextPage = () => {
  return (
    <ApplicationLayout>
      <div className="max-w-[85rem] mx-auto w-full">
        <h1 className="text-center mt-10">Unstake</h1>

        <div></div>
      </div>
    </ApplicationLayout>
  );
};

export default UnstakePage;
