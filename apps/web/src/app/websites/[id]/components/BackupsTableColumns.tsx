"use client"

import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from '@/components/ui/checkbox';
import DownloadBackupButton from "@/app/websites/[id]/components/DownloadBackupButton";

export type Backup = {
  _id: string;
  status: "pending" | "success" | "error";
  s3Location: string;
  createdAt: number;
};

export const columns: ColumnDef<Backup>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const value = getValue() as string;
      if (value === "pending") {
        return (
          <PendingIndicator />
        );
      } else if (value === "success") {
        return (
          <SuccessIndicator />
        );
      } else if (value === "error") {
        return (
          <FailedIndicator />
        );
      }

      return value.charAt(0).toUpperCase() + value.slice(1);
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) => {
      const value = getValue() as number;
      return new Date(value).toLocaleString();
    },
  },
  {
    accessorKey: "s3Location",
    header: "Download",
    cell: ({ row, getValue }) => {
      const value = getValue() as string;
      const status = row.getValue("status") as string;
      return (
        <DownloadBackupButton 
          disabled={status === "error"} 
          objectKey={value}
        />
      )
    },
  },
];

export const selectionColumn = {
  id: 'select',
  header: ({ table }: any) => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="translate-y-[2px] bg-white"
    />
  ),
  cell: ({ row }: any) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="translate-y-[2px]"
    />
  ),
  enableSorting: false,
  enableHiding: false,
};

function PendingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Pending</span>
    </div>
  )
};

function SuccessIndicator() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="success">Success</Badge>
    </div>
  )
};

function FailedIndicator() {
  return (
    <div className="flex items-center gap-2">
      <Badge variant="failure">Failed</Badge>
    </div>
  )
};

export const allColumns: ColumnDef<Backup>[] = [selectionColumn, ...columns]; 