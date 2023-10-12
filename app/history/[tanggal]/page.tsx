"use client";
import { Logging, columns } from "@/components/colums";
import { DataTable } from "@/components/data-table";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { firebase_DB } from "@/config/FirebaseConfig";
import { format } from "date-fns";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { CalendarDays, CalendarClock } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function Page({
    params,
}: {
    params: {
        tanggal: string;
    };
}) {
    const [data, setData] = useState<Logging[]>();
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        const Ref = collection(firebase_DB, "tabel");
        const formatDate = selectedDate
            ? format(selectedDate, "d-M-yyyy")
            : params.tanggal;
        const filter = query(Ref, where("tanggal", "==", formatDate));
        const subs = onSnapshot(filter, (snapshot) => {
            const data: Logging[] = snapshot.docs.map((doc) => {
                const docData = doc.data();
                return {
                    no: docData.no,
                    waktu: docData.waktu,
                    intensitasCahaya: docData.intensitasCahaya,
                    daya: docData.daya,
                    ket: docData.ket,
                    id: doc.id,
                };
            });
            setData(data);

            console.log(data);
        });
    });

    return (
        <div>
            <div className="flex justify-between p-20  py-10 pb-5 items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        SOLAR PANEL MONITORING
                    </h2>
                    <p className="text-muted-foreground">
                        Power Absorption and Maintenance
                    </p>
                    <p></p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CalendarDays width={30} height={30} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel className="text-center">
                            Calendar
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 w-[80%] mx-auto pb-4 pt-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Date
                        </CardTitle>
                        <CalendarClock />
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">
                        <p className="">{params.tanggal}</p>
                    </CardContent>
                </Card>
            </div>
            <div>
                <DataTable columns={columns} data={data || []} />
            </div>
        </div>
    );
}
