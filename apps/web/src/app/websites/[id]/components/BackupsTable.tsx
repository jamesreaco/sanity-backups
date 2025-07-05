"use client"

import { toast } from "sonner";
import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { allColumns } from "./BackupsTableColumns";
import { api } from "../../../../../convex/_generated/api";
import { Doc } from "../../../../../convex/_generated/dataModel";
import CreateBackupButton from "@/app/websites/[id]/components/CreateBackupButton";

import { 
  ColumnDef, 
  flexRender, 
  getCoreRowModel, 
  useReactTable 
} from "@tanstack/react-table";

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";

interface DataTableProps<TData> {
  data: TData[];
  website: Doc<"websites">;
};

export function BackupsTable<TData, TValue>({ data, website }: DataTableProps<TData>) {

  const [rowSelection, setRowSelection] = useState({});
  
  const deleteBackup = useAction(api.backups.deleteBackup);

  const table = useReactTable({
    data,
    columns: (allColumns as ColumnDef<TData, TValue>[]),
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    state: { rowSelection },
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows.length;
  const totalRows = table.getFilteredRowModel().rows.length;

  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    for (const row of selectedRows) {
      const backup = row.original as Doc<"backups">;
      await deleteBackup({ id: backup._id, objectKey: backup.s3Location });
      toast.success('Backup deleted successfully');
    }
    setRowSelection({});
  };

  if (totalRows === 0) {
    return (
      <div className="bg-white/50 w-full h-40 border border-neutral-200/75 flex flex-col items-center justify-center gap-4">
        <p>Create a backup to get started.</p>
        <CreateBackupButton website={website} classNames="h-10" />
      </div>
    )
  };

  return (
    <div className="border">
      <Table className="bg-white">
        <TableHeader className="bg-neutral-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} className="px-3.5">
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length && (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="py-4 px-3.5">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <div className="border-t flex items-center justify-between px-4 py-3 bg-neutral-100 text-xs text-muted-foreground">
        <div>{selectedRows} of {totalRows} row(s) selected.</div>
        {selectedRows > 0 && (
          <button 
            onClick={handleDeleteSelected}
            className="text-red-600 hover:underline"
          >
            Delete Selected
          </button>
        )}
      </div>
    </div>
  );
}; 