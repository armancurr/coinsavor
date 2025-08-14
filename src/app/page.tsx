"use client";

import { useState, useEffect } from "react";
import { DailyPlan } from "@/components/food-card";
import { WeekView } from "@/components/week-view";
import { SettingsSheet } from "@/components/settings-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Spinner } from "@phosphor-icons/react";
import { generateDailyPlan } from "@/lib/recommendation";
import {
  getBudget,
  getFoodList,
  getDailyHistory,
  saveDailyPlan,
  saveBudget,
} from "@/lib/storage";
import type { FoodItem, DailyPlan as DailyPlanType } from "@/lib/types";

export default function HomePage() {
  const [budget, setBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [foodList, setFoodList] = useState<FoodItem[]>([]);
  const [todaysPlan, setTodaysPlan] = useState<DailyPlanType | null>(null);
  const [history, setHistory] = useState<DailyPlanType[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasPlannedForToday, setHasPlannedForToday] = useState(false);

  useEffect(() => {
    const loadAndSyncState = () => {
      const storedBudget = getBudget();
      const storedFoodList = getFoodList();
      const storedHistory = getDailyHistory();

      setBudget(storedBudget.total);
      setRemainingBudget(storedBudget.remaining);
      setFoodList(storedFoodList);
      setHistory(storedHistory);

      const todayStr = new Date().toDateString();
      const todaysHistory = storedHistory.find(
        (plan) => new Date(plan.date).toDateString() === todayStr,
      );

      if (todaysHistory) {
        setTodaysPlan(todaysHistory);
        setHasPlannedForToday(true);
      } else {
        setTodaysPlan(null);
        setHasPlannedForToday(false);
      }
    };

    if (!isLoaded) {
      loadAndSyncState();
      setIsLoaded(true);
    }

    window.addEventListener("focus", loadAndSyncState);
    return () => {
      window.removeEventListener("focus", loadAndSyncState);
    };
  }, [isLoaded]);

  const handleGeneratePlan = async () => {
    if (foodList.length === 0) {
      alert("Please add some food items first!");
      return;
    }
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = generateDailyPlan(foodList, remainingBudget, history);

    if (result) {
      setTodaysPlan(result.plan);
      setRemainingBudget(result.newBudget);
      saveDailyPlan(result.plan);
      saveBudget(budget, result.newBudget);
      setHistory(getDailyHistory());
      setHasPlannedForToday(true);
    } else {
      alert(
        "Cannot generate a plan. Try adding cheaper items or reset your budget.",
      );
    }
    setIsGenerating(false);
  };

  const handleBudgetUpdate = () => {
    const storedBudget = getBudget();
    setBudget(storedBudget.total);
    setRemainingBudget(storedBudget.remaining);
  };

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 animate-spin text-lime-600" />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen font-sans">
        <div className="container mx-auto max-w-md px-4 py-6 pb-28">
          <header className="mb-6 flex items-center justify-between">
            <SettingsSheet onBudgetUpdate={handleBudgetUpdate} />
          </header>

          <WeekView />

          {budget === 0 && (
            <Card className="mb-6 border-dashed border-lime-500 bg-lime-100/50 text-center">
              <CardContent className="p-6">
                <p className="mb-3 text-slate-700">Set your budget to start</p>
                <p className="text-sm text-slate-500">
                  Click on coinsavor above to open settings
                </p>
              </CardContent>
            </Card>
          )}

          {budget > 0 && (
            <Card className="mb-6 bg-lime-50 border border-lime-600">
              <CardContent className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-base font-medium text-lime-700">
                    Total: ₹{budget.toFixed(2)}
                  </p>
                </div>
                <p className="mb-3 text-4xl font-bold text-lime-950">
                  ₹{remainingBudget.toFixed(2)}
                </p>
                <div className="h-2 rounded-full bg-lime-300">
                  <div
                    className="h-2 rounded-full bg-lime-700 transition-all duration-500"
                    style={{
                      width: `${Math.max(0, (remainingBudget / budget) * 100)}%`,
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {!hasPlannedForToday && budget > 0 && (
            <div className="my-8">
              <Button
                onClick={handleGeneratePlan}
                disabled={
                  isGenerating || foodList.length === 0 || remainingBudget <= 0
                }
                className="w-full transform rounded-xl bg-slate-800 py-6 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-slate-900 disabled:translate-y-0 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none"
              >
                {isGenerating ? (
                  <Spinner className="h-6 w-6 animate-spin" />
                ) : (
                  "Get Today's Plan"
                )}
              </Button>
            </div>
          )}

          {todaysPlan && (
            <div className="mt-8 space-y-4">
              <div className="flex items-baseline justify-end">
                <p className="text-sm font-medium text-lime-700">
                  Total:{" "}
                  <span className="font-bold text-lime-700">
                    ₹{todaysPlan.totalCost.toFixed(2)}
                  </span>
                </p>
              </div>
              <DailyPlan plan={todaysPlan} />
            </div>
          )}
        </div>

        {hasPlannedForToday && (
          <footer className="fixed bottom-0 left-0 z-10 w-full border-t border-lime-300/50 bg-lime-200/80 p-4 backdrop-blur-sm">
            <div className="container mx-auto max-w-md">
              <Button
                disabled
                className="w-full rounded-xl bg-slate-500 text-slate-300"
              >
                Plan Set for Today
              </Button>
            </div>
          </footer>
        )}
      </div>
    </TooltipProvider>
  );
}
