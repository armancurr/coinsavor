"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime-500 to-green-500 flex items-center justify-center shadow-md">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900">History</h3>
            <p className="text-sm text-slate-600">
              <span className="font-medium text-slate-800">
                Total: ₹{totalSpent.toFixed(2)}
              </span>{" "}
              • Avg: ₹{averageDaily.toFixed(2)}/day
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-lg border-slate-300 hover:bg-slate-50 transition-all"
        >
          {isExpanded ? "Hide" : "Show"}
          {isExpanded ? (
            <ChevronUp className="ml-2 h-4 w-4" />
          ) : (
            <ChevronDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>

      {/* History List */}
      {isExpanded && (
        <div className="space-y-2 pt-2 animate-fadeIn">
          {history.length === 0 ? (
            <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-6">
              <p className="text-sm text-slate-500">No history available</p>
            </div>
          ) : (
            history
              .slice()
              .reverse()
              .map((plan) => (
                <Card
                  key={plan.date}
                  className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <p className="font-semibold text-slate-800">
                      {new Date(plan.date).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <p className="font-bold text-lime-700">
                      ₹{plan.totalCost.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
}
