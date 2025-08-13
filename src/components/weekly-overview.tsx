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
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">
                        Last {history.length} Days
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Total spent: ₹{totalSpent} • Average: ₹
                        {averageDaily.toFixed(0)}/day
                    </p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp className="h-4 w-4 mr-2" />
                            Hide
                        </>
                    ) : (
                        <>
                            <ChevronDown className="h-4 w-4 mr-2" />
                            Show Details
                        </>
                    )}
                </Button>
            </div>

            {isExpanded && (
                <div className="space-y-2">
                    {history
                        .slice()
                        .reverse()
                        .map((plan, index) => (
                            <Card key={plan.date}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-medium">
                                                {new Date(
                                                    plan.date,
                                                ).toLocaleDateString("en-IN", {
                                                    weekday: "short",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <div className="text-sm text-muted-foreground mt-1">
                                                <p>
                                                    {plan.meals.breakfast.name}{" "}
                                                    • {plan.meals.lunch.name} •{" "}
                                                    {plan.meals.dinner.name}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">
                                                ₹{plan.totalCost}
                                            </p>
                                            {index === 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                    Today
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                </div>
            )}
        </div>
    );
}
