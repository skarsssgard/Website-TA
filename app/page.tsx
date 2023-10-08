"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Calendar } from "@/components/ui/calendar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    BatteryCharging,
    CalendarDays,
    Sun,
    CalendarClock,
} from "lucide-react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { firebase_DB } from "@/config/FirebaseConfig";

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [data, setData] = useState<any>();

    useEffect(() => {
        const Ref = collection(firebase_DB, "tabel");
        const Doc = doc(Ref, "tanggal");

        const subs = onSnapshot(Doc, (snapshot) => {
            const data: any = snapshot.data();
            setData(data);
            console.log(data);
        });
    }, []);

    return (
        <>
            <div className="mx-auto py-auto">
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
                                selected={date}
                                onSelect={setDate}
                                className="rounded-md border"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 w-[80%] mx-auto pb-4 pt-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Date / Time
                            </CardTitle>
                            <CalendarClock />
                        </CardHeader>
                        <CardContent className="text-2xl font-bold">
                            <p className="border-b">5 Oktober 2023</p>
                            <p>12 : 10 : 01</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Light Intensity
                            </CardTitle>
                            <Sun />
                        </CardHeader>
                        <CardContent className="text-4xl font-bold">
                            {data?.intensitasCahaya}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium">
                                Power
                            </CardTitle>
                            <BatteryCharging />
                        </CardHeader>
                        <CardContent className="text-4xl font-bold">
                            {data?.daya}
                        </CardContent>
                    </Card>
                </div>
                <div className="w-[80%] mx-auto border-solid border-2 rounded-md">
                    <Table>
                        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[20px] text-center border-r">
                                    NO
                                </TableHead>
                                <TableHead className="w-[200px] text-center border-r">
                                    Time
                                </TableHead>
                                <TableHead className="w-[250px] text-center border-r">
                                    Light Intensity
                                </TableHead>
                                <TableHead className="w-[250px] text-center border-r">
                                    Power
                                </TableHead>
                                <TableHead className="text-center">
                                    Information
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="text-center border-r">
                                    {data?.no}
                                </TableCell>
                                <TableCell className="text-center border-r">
                                    {data?.waktu}
                                </TableCell>
                                <TableCell className="text-center border-r">
                                    {data?.intensitasCahaya}
                                </TableCell>
                                <TableCell className="text-center border-r">
                                    {data?.daya}
                                </TableCell>
                                <TableCell className="text-center ">
                                    {data?.keterangan}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
}
