import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export type Column = {
  shares: number;
  assetsExpected: number;
  assetsFinalized: number;
  unstakeBatchId: number;
  network: string;
  protocol: string;
  status: string;
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "shares",
    header: "Shares",
  },
  {
    accessorKey: "assetsExpected",
    header: "Assets Expected",
  },
  {
    accessorKey: "assetsFinalized",
    header: "Assets Finalized",
  },
  {
    accessorKey: "unstakeBatchId",
    header: "Unstake Batch ID",
  },
  {
    accessorKey: "network",
    header: "Network",
  },
  {
    accessorKey: "protocol",
    header: "Protocol",
  },
  // {
  //   accessorKey: "createdAt",
  //   header: ({ column }: any) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Date
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  // },
  {
    accessorKey: "status",
    header: "Status",
  },
];
