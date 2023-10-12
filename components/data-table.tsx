"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onColumnFiltersChange: setColumnFilters,
      getFilteredRowModel: getFilteredRowModel(),
      state: {
        sorting,
        columnFilters,
      },
  });

  return (
      <div className="w-[80%] mx-auto border-solid border-2 rounded-md">
          <div className="m-2 flex items-center max-w-sm">
              <Input
                  placeholder="Search ..."
                  value={
                      (table.getColumn("ket")?.getFilterValue() as string) ??
                      ""
                  }
                  onChange={(event) =>
                      table
                          .getColumn("ket")
                          ?.setFilterValue(event.target.value)
                  }
              />
          </div>
          <Table>
              <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                              return (
                                  <TableHead
                                      className="text-center"
                                      key={header.id}
                                  >
                                      {header.isPlaceholder
                                          ? null
                                          : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                  </TableHead>
                              );
                          })}
                      </TableRow>
                  ))}
              </TableHeader>
              <TableBody className="text-center">
                  {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                          <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                          >
                              {row.getVisibleCells().map((cell) => (
                                  <TableCell key={cell.id}>
                                      {flexRender(
                                          cell.column.columnDef.cell,
                                          cell.getContext()
                                      )}
                                  </TableCell>
                              ))}
                          </TableRow>
                      ))
                  ) : (
                      <TableRow>
                          <TableCell
                              colSpan={columns.length}
                              className="h-24 text-center"
                          >
                              No results.
                          </TableCell>
                      </TableRow>
                  )}
              </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 p-4">
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
              >
                  Previous
              </Button>
              <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
              >
                  Next
              </Button>
          </div>
      </div>
  );
}
