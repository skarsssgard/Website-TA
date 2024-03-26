"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

export type Logging = {
  id: string;
  waktu: string;
  intsCahaya: number;
  daya: number;
  ket: string;
};

export const columns: ColumnDef<Logging>[] = [
    {
        accessorKey: "waktu",
        header: ({ column }) => {
            return (
                <Button
                    className="text-base"
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Time
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "intsCahaya",
        header: "Light Intensity",
    },
    {
        accessorKey: "daya",
        header: "Power",
    },
    {
        accessorKey: "ket",
        header: "Information",
    },
    
];
