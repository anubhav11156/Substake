import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAccount } from "wagmi";

import { DataTable } from "@/components/ui/data-table";
import { Column, columns } from "./columns";
import Loading from "@/components/Loading";

export const StakeTable: React.FC = () => {
  const { address } = useAccount();

  const getStakeData = async () => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: address,
      }),
    };

    const res = await fetch("http://localhost:3000/api/getUserStakes", options);

    const data = await res.json();

    return data?.user;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["stakeData"],
    queryFn: getStakeData,
  });

  let formattedData: Column[] = data?.map((item: any) => ({
    assets: item?.Asset,
    shares: item?.shares,
    createdAt: format(new Date(item?.createdAt), "MMMM do, yyyy, hh:mm a"),
    stakeBatchId: item?.StakeBatchId,
    network: item?.network,
    protocol: item?.protocol,
    status: item?.status,
  }));

  if (isLoading) {
    return <Loading />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-2xl text-center text-gray-500">
          Something went wrong.
        </p>
      </div>
    );
  }

  return <DataTable searchKey="id" columns={columns} data={formattedData} />;
};
