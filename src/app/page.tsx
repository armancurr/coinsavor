"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DailyPlan } from "@/components/food-card";
import { WeekView } from "@/components/week-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Spinner,
  GearSix,
  CalendarBlank,
  Fire,
  SketchLogo,
  CaretRight,
} from "@phosphor-icons/react";
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
  const [actionsOpen, setActionsOpen] = useState(false);

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

  // Management and emergency have dedicated routes now

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
            <button
              type="button"
              onClick={() => setActionsOpen((v) => !v)}
              aria-expanded={actionsOpen}
              aria-controls="header-actions"
              className="group flex h-10 items-center gap-2 rounded-lg bg-white px-3 shadow-sm ring-1 ring-slate-200 transition"
            >
              <span className="rounded-md bg-white p-1.5">
                <SketchLogo size={18} weight="fill" className="text-lime-600" />
              </span>
              <span className="select-none text-base font-semibold leading-none text-lime-900">
                coinsavor
              </span>
              <CaretRight
                size={16}
                weight="bold"
                className={`ml-1 transition-transform ${actionsOpen ? "rotate-180" : "rotate-0"}`}
              />
            </button>
            <div
              id="header-actions"
              className={`flex h-10 items-center overflow-hidden transition-[width,opacity] duration-300 ${actionsOpen ? "w-40 opacity-100" : "w-0 opacity-0"}`}
            >
              <div className="flex h-full items-center gap-1.5 rounded-lg bg-white px-1.5 shadow-sm ring-1 ring-slate-200">
                <Link href="/emergency" aria-label="Emergency">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-amber-600 hover:bg-amber-50"
                  >
                    <Fire size={18} weight="fill" />
                  </Button>
                </Link>
                <Link href="/calendar" aria-label="Calendar">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-indigo-600 hover:bg-indigo-50"
                  >
                    <CalendarBlank size={18} weight="fill" />
                  </Button>
                </Link>
                <Link href="/management" aria-label="Management">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-700 hover:bg-slate-100"
                  >
                    <GearSix size={18} weight="fill" />
                  </Button>
                </Link>
              </div>
            </div>
          </header>

          <WeekView />

          {budget === 0 && (
            <Card className="mb-6 border-dashed border-lime-500 bg-lime-100/50 text-center">
              <CardContent className="p-6">
                <p className="mb-3 text-slate-700">Set your budget to start</p>
                <Link href="/management">
                  <Button className="bg-slate-800 text-white hover:bg-slate-900">
                    <GearSix className="mr-2 h-4 w-4" />
                    Open Settings
                  </Button>
                </Link>
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
