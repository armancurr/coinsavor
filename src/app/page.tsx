"use client";

import { useState, useEffect } from "react";
import { BudgetInput } from "@/components/budget-input";
import { FoodList } from "@/components/food-list";
import { DailyPlan } from "@/components/daily-plan";
import { WeeklyOverview } from "@/components/weekly-overview";
import { ResetButton } from "@/components/reset-button";
import { EmergencyExpense } from "@/components/emergency-expense";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Settings, UtensilsCrossed } from "lucide-react";
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
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [hasPlannedForToday, setHasPlannedForToday] = useState(false);

    useEffect(() => {
        const storedBudget = getBudget();
        const storedFoodList = getFoodList();
        const storedHistory = getDailyHistory();

        setBudget(storedBudget.total);
        setRemainingBudget(storedBudget.remaining);
        setFoodList(storedFoodList);
        setHistory(storedHistory);

        const today = new Date().toDateString();
        const todaysHistory = storedHistory.find(
            (plan) => new Date(plan.date).toDateString() === today,
        );
        if (todaysHistory) {
            setTodaysPlan(todaysHistory);
            setHasPlannedForToday(true);
        }

        setIsLoaded(true);
    }, []);

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

    const handleEmergencyDeduct = (amount: number) => {
        const newRemainingBudget = remainingBudget - amount;
        setRemainingBudget(newRemainingBudget);
        saveBudget(budget, newRemainingBudget);
    };

    const handleBudgetUpdate = (newBudget: number) => {
        setBudget(newBudget);
        setRemainingBudget(newBudget);
        saveBudget(newBudget, newBudget);
    };

    const handleFoodListUpdate = (newFoodList: FoodItem[]) => {
        setFoodList(newFoodList);
    };

    const handleReset = () => {
        setBudget(0);
        setRemainingBudget(0);
        setFoodList([]);
        setTodaysPlan(null);
        setHistory([]);
        setHasPlannedForToday(false);
        setIsSettingsOpen(false);
    };

    if (!isLoaded) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-lime-600" />
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="min-h-screen font-sans">
                <div className="container mx-auto max-w-md px-4 py-6">
                    <header className="mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-white p-2 shadow-sm">
                                <UtensilsCrossed className="h-6 w-6 text-lime-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">
                                    CoinSaver
                                </h1>
                                <p className="text-sm text-slate-600">
                                    Daily Meal Planner
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <EmergencyExpense onDeduct={handleEmergencyDeduct} />
                            <Dialog
                                open={isSettingsOpen}
                                onOpenChange={setIsSettingsOpen}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="border-lime-400 bg-white/50 hover:bg-white"
                                    >
                                        <Settings className="h-4 w-4 text-slate-700" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="flex h-full max-h-[85vh] flex-col bg-white p-0 sm:h-auto">
                                    <DialogHeader className="p-6 pb-4">
                                        <DialogTitle>Management</DialogTitle>
                                    </DialogHeader>
                                    <Tabs
                                        defaultValue="budget"
                                        className="flex flex-grow flex-col overflow-hidden"
                                    >
                                        <TabsList className="mx-6 grid flex-shrink-0 grid-cols-3 bg-lime-100">
                                            <TabsTrigger value="budget">
                                                Budget
                                            </TabsTrigger>
                                            <TabsTrigger value="food">
                                                Food
                                            </TabsTrigger>
                                            <TabsTrigger value="overview">
                                                Overview
                                            </TabsTrigger>
                                        </TabsList>
                                        <TabsContent
                                            value="budget"
                                            className="flex-grow overflow-y-auto p-6"
                                        >
                                            <BudgetInput
                                                currentBudget={budget}
                                                onBudgetUpdate={
                                                    handleBudgetUpdate
                                                }
                                            />
                                        </TabsContent>
                                        <TabsContent
                                            value="food"
                                            className="flex-grow overflow-y-auto p-6"
                                        >
                                            <FoodList
                                                foodList={foodList}
                                                onFoodListUpdate={
                                                    handleFoodListUpdate
                                                }
                                            />
                                        </TabsContent>
                                        <TabsContent
                                            value="overview"
                                            className="flex-grow overflow-y-auto p-6"
                                        >
                                            <WeeklyOverview history={history} />
                                            <div className="mt-6 border-t pt-4">
                                                <ResetButton
                                                    onReset={handleReset}
                                                />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </header>

                    {budget === 0 && (
                        <Card className="mb-6 border-dashed border-lime-500 bg-lime-100/50 text-center">
                            <CardContent className="p-6">
                                <p className="mb-3 text-slate-700">
                                    Set your budget to start
                                </p>
                                <Button
                                    onClick={() => setIsSettingsOpen(true)}
                                    className="bg-slate-800 text-white hover:bg-slate-900"
                                >
                                    <Settings className="mr-2 h-4 w-4" />
                                    Open Settings
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {budget > 0 && (
                        <Card className="mb-6 bg-white shadow-md">
                            <CardContent className="p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <p className="text-sm text-slate-500">
                                        Remaining
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Total: ₹{budget.toFixed(2)}
                                    </p>
                                </div>
                                <p className="mb-3 text-3xl font-bold text-lime-700">
                                    ₹{remainingBudget.toFixed(2)}
                                </p>
                                <div className="h-2 rounded-full bg-lime-300/70">
                                    <div
                                        className="h-2 rounded-full bg-lime-600 transition-all duration-500"
                                        style={{
                                            width: `${Math.max(0, (remainingBudget / budget) * 100)}%`,
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <div className="mb-8">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="w-full">
                                    <Button
                                        onClick={handleGeneratePlan}
                                        disabled={
                                            isGenerating ||
                                            foodList.length === 0 ||
                                            remainingBudget <= 0 ||
                                            hasPlannedForToday
                                        }
                                        className="w-full transform rounded-xl bg-slate-800 py-6 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-slate-900 disabled:translate-y-0 disabled:bg-slate-500 disabled:text-slate-300 disabled:shadow-none"
                                    >
                                        {isGenerating ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : hasPlannedForToday ? (
                                            "Plan Set for Today"
                                        ) : (
                                            "Get Today's Plan"
                                        )}
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            {hasPlannedForToday && (
                                <TooltipContent>
                                    <p>
                                        A plan has already been generated for
                                        today.
                                    </p>
                                </TooltipContent>
                            )}
                        </Tooltip>
                    </div>

                    {todaysPlan && (
                        <div className="space-y-4">
                            <div className="flex items-baseline justify-between">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Today's Plan
                                </h2>
                                <p className="text-sm font-medium text-slate-600">
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
            </div>
        </TooltipProvider>
    );
}