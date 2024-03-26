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
    BatteryCharging,
    CalendarDays,
    Sun,
    CalendarClock,
} from "lucide-react";
import { format } from "date-fns";
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { firebase_DB } from "@/config/FirebaseConfig";
import { DataTable } from "@/components/data-table";
import { Logging, columns } from "@/components/colums";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function Home() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [data, setData] = useState<Logging[]>();
    const [monitoring, setMonitoring] = useState<any>();
    const [tanggal, setTanggal] = useState<any>();
    const [time, setTime] = useState<any>();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [trigger, setTrigger] = useState(false);

    const close = async () => {
        const alertRef = collection(firebase_DB, "popUp");
        const alertDoc = doc(alertRef, "alertDialog");
        const payload = {
            alert : false
        };
        
        await updateDoc(alertDoc, payload);
    }

    const cleaning = async () => {
        const alertRef = collection(firebase_DB, "popUp");
        const alertDoc = doc(alertRef, "alertDialog");
        const payload = {
            alert: false,
            inputAlert: true
        };

        await updateDoc(alertDoc, payload);
    };


    useEffect(() => {
        const Ref = collection(firebase_DB, "tabel");
        const formatDate = selectedDate
            ? format(selectedDate, "d-M-yyyy")
            : format(new Date(), "d-M-yyyy");
        const filter = query(Ref, where("tanggal", "==", formatDate), orderBy("waktu", "desc"));
        const subs = onSnapshot(filter, (snapshot) => {
            const data: Logging[] = snapshot.docs.map((doc) => {
                const docData = doc.data();
                return {
                    no: docData.no,
                    waktu: docData.waktu,
                    intsCahaya: docData.intsCahaya,
                    daya: docData.daya,
                    ket: docData.ket,
                    id: doc.id,
                };
                console.log(docData);
            });
            setData(data);
            
        });

        const Ref2 = collection(firebase_DB, "monitoring");
        const docs = doc(Ref2, "data");
        const subs2 = onSnapshot(docs, (snapshot) => {
            const monitoring = snapshot.data();
            setMonitoring(monitoring);
        });

        //time
        const interval = setInterval(() => {
            const time = new Date();
            const hours = time.getHours();
            const minutes = time.getMinutes();
            const seconds = time.getSeconds();
            const day = time.getDate();
            const month = time.getMonth();
            const year = time.getFullYear();

            const formatTime = `${hours}:${minutes}:${seconds}`;
            const formatDate = `${day}-${month}-${year}`;
            setTanggal(formatDate);
            setTime(formatTime);
        }, 1000);

        const Ref3 = collection(firebase_DB, "popUp");
        const docs2 = doc(Ref3, "alertDialog");
        const subs3 = onSnapshot(docs2, (doc) => {
            const triggerAlert = doc.data();
            console.log("Alert Dialog from Firestore:", triggerAlert);
            setTrigger(triggerAlert.alert);
        });

        return () => {
            subs();
            subs2();
            subs3();
        };
    }, [selectedDate]);

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
                                selected={selectedDate}
                                onSelect={(date) => setSelectedDate(date)}
                                className="rounded-md border"
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-3 w-[80%] mx-auto pb-4 pt-5">
                    {selectedDate ? (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    History
                                </CardTitle>
                                <CalendarClock />
                            </CardHeader>
                            <CardContent className="text-2xl font-bold text-center">
                                <p className="">
                                    {selectedDate
                                        ? format(selectedDate, "d MMMM Y")
                                        : ""}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        Date / Time
                                    </CardTitle>
                                    <CalendarClock />
                                </CardHeader>
                                <CardContent className="text-2xl font-bold text-center">
                                    <p className="border-b py-1">
                                        {date
                                            ? format(date, "d MMMM Y")
                                            : "Pick a date"}
                                    </p>
                                    <p className="pt-1">{time}</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium">
                                        Light Intensity
                                    </CardTitle>
                                    <Sun />
                                </CardHeader>
                                <CardContent className="text-4xl font-bold text-center">
                                    {monitoring?.intsCahaya} lux
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-medium">
                                        Power
                                    </CardTitle>
                                    <BatteryCharging />
                                </CardHeader>
                                <CardContent className="text-4xl font-bold text-center">
                                    {monitoring?.daya} W
                                </CardContent>
                            </Card>
                        </>
                    )}
                </div>
                <DataTable columns={columns} data={data || []} />
                <AlertDialog open={trigger}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl">
                                Announcement
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-xl text-justify">
                                failed cleaning or cloudy weather conditions. If
                                the weather is cloudy, please ignore this
                                message, but if the weather is sunny, please
                                check the solar panel by an officer or re-clean
                                it because the minimum power limit has not been
                                reached.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <Button onClick={close}>OK</Button>
                            <AlertDialogAction onClick={cleaning}>
                                Cleaning Again
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </>
    );
}
