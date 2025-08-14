"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function WeekView() {
    const [weekDates, setWeekDates] = useState<Date[]>([]);
    const [todayDate, setTodayDate] = useState(new Date().getDate());

    useEffect(() => {
        const today = new Date();
        // Set Monday as the first day of the week (0=Mon, 6=Sun)
        const dayOfWeek = (today.getDay() + 6) % 7;
        const monday = new Date(today);
        monday.setDate(today.getDate() - dayOfWeek);

        const dates = Array.from({ length: 7 }).map((_, i) => {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            return date;
        });
        setWeekDates(dates);

        // Update the 'today' date in case the component stays mounted past midnight
        const interval = setInterval(() => {
            setTodayDate(new Date().getDate());
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

    const dayLetters = ["M", "T", "W", "T", "F", "S", "S"];

    return (
        <div className="mb-6 rounded-2xl bg-none p-2 backdrop-blur-sm">
            <div className="flex justify-around">
                {weekDates.map((date, i) => {
                    const isToday = date.getDate() === todayDate;
                    return (
                        <div
                            key={i}
                            className={cn(
                                "flex flex-col items-center gap-2 rounded-xl p-2 text-center transition-all duration-300",
                                isToday
                                    ? "bg-white/20 backdrop-blur-md rounded-xl border border-white/20 font-bold text-slate-900 shadow-md"
                                    : "text-slate-700",
                            )}
                            style={{ flexBasis: "14%" }}
                        >
                            <p className="text-xs font-medium uppercase">
                                {dayLetters[i]}
                            </p>
                            <p className="text-lg">{date.getDate()}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}