"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { DailyPlan } from "@/lib/types";

interface WeeklyOverviewProps {
    history: DailyPlan[];
}

export function WeeklyOverview({ history }: WeeklyOverviewProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const totalSpent = history.reduce((sum, plan) => sum + plan.totalCost, 0);
    const averageDaily = history.length > 0 ? totalSpent / history.length : 0;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-slate-800">History</h3>
                    <p className="text-sm text-slate-600">
                        Total: ₹{totalSpent.toFixed(2)} • Avg: ₹
                        {averageDaily.toFixed(2)}/day
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? "Hide" : "Show"}
                    {isExpanded ? (
                        <ChevronUp className="ml-2 h-4 w-4" />
                    ) : (
                        <ChevronDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            </div>

            {isExpanded && (
                <div className="space-y-2 pt-2">
                    {history
                        .slice()
                        .reverse()
                        .map((plan) => (
                            <Card key={plan.date} className="bg-white/70">
                                <CardContent className="p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-slate-700">
                                            {new Date(plan.date).toLocaleDateString(
                                                "en-IN",
                                                { month: "short", day: "numeric" },
                                            )}
                                        </p>
                                        <p className="font-bold text-lime-700">
                                            ₹{plan.totalCost.toFixed(2)}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            )}
        </div>
    );
}