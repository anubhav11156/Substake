import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export type Column = {
  assets: number;
  shares: number;
  createdAt: string;
  stakeBatchId: number;
  network: string;
  protcol: string;
  status: string;
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "assets",
    header: "Assets",
  },
  {
    accessorKey: "shares",
    header: "Shares",
  },
  {
    accessorKey: "stakeBatchId",
    header: "Stake Batch ID",
  },

  {
    accessorKey: "protcol",
    header: "Protocol",
  },
  {
    accessorKey: "network",
    header: "Network",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }: any) => {
      return (
        <Button
          variant="ghost"
          className="hover:bg-[#e3c9a0] ring-offset-[#fadfb5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mainBg focus-visible:ring-offset-2"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
