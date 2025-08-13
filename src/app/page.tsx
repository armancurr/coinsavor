"use client";

import { useState, useEffect } from "react";
import { BudgetInput } from "@/components/budget-input";
import { FoodList } from "@/components/food-list";
import { DailyPlan } from "@/components/daily-plan";
import { WeeklyOverview } from "@/components/weekly-overview";
import { ResetButton } from "@/components/reset-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Settings, RefreshCw } from "lucide-react";
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

    // Load data from localStorage on mount
    useEffect(() => {
        const storedBudget = getBudget();
        const storedFoodList = getFoodList();
        const storedHistory = getDailyHistory();

        setBudget(storedBudget.total);
        setRemainingBudget(storedBudget.remaining);
        setFoodList(storedFoodList);
        setHistory(storedHistory);
        setIsLoaded(true);
    }, []);

    const handleGeneratePlan = async () => {
        if (foodList.length === 0) {
            alert("Please add some food items first!");
            return;
        }

        setIsGenerating(true);

        // Simulate loading delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const result = generateDailyPlan(foodList, remainingBudget, history);

        if (result) {
            setTodaysPlan(result.plan);
            setRemainingBudget(result.newBudget);

            // Save the plan and update budget
            saveDailyPlan(result.plan);
            saveBudget(budget, result.newBudget);

            // Update history
            const updatedHistory = getDailyHistory();
            setHistory(updatedHistory);
        } else {
            alert(
                "Cannot generate a plan within your remaining budget. Try adding cheaper items or reset your budget.",
            );
        }

        setIsGenerating(false);
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
        setIsSettingsOpen(false);
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto px-4 py-6 max-w-2xl">
                {/* Header with Settings */}
                <header className="flex justify-between items-center mb-8">
                    <div className="text-center flex-1">
                        <h1 className="text-3xl font-bold mb-2">
                            Food Budget Planner
                        </h1>
                        <p className="text-gray-400">
                            Smart meal planning within your budget
                        </p>
                    </div>

                    <Dialog
                        open={isSettingsOpen}
                        onOpenChange={setIsSettingsOpen}
                    >
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="bg-gray-900 border-gray-700 hover:bg-gray-800"
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    Budget & Food Management
                                </DialogTitle>
                            </DialogHeader>

                            <Tabs defaultValue="budget" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                                    <TabsTrigger
                                        value="budget"
                                        className="data-[state=active]:bg-gray-700"
                                    >
                                        Budget
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="food"
                                        className="data-[state=active]:bg-gray-700"
                                    >
                                        Food Items
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="overview"
                                        className="data-[state=active]:bg-gray-700"
                                    >
                                        Overview
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="budget"
                                    className="space-y-4"
                                >
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white">
                                                Monthly Budget
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <BudgetInput
                                                currentBudget={budget}
                                                remainingBudget={
                                                    remainingBudget
                                                }
                                                onBudgetUpdate={
                                                    handleBudgetUpdate
                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="food" className="space-y-4">
                                    <Card className="bg-gray-800 border-gray-700">
                                        <CardHeader>
                                            <CardTitle className="text-white">
                                                Food Items
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <FoodList
                                                foodList={foodList}
                                                onFoodListUpdate={
                                                    handleFoodListUpdate
                                                }
                                            />
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent
                                    value="overview"
                                    className="space-y-4"
                                >
                                    {history.length > 0 ? (
                                        <Card className="bg-gray-800 border-gray-700">
                                            <CardHeader>
                                                <CardTitle className="text-white">
                                                    Weekly Overview
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <WeeklyOverview
                                                    history={history}
                                                />
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <div className="text-center py-8 text-gray-400">
                                            <p>
                                                No meal history yet. Generate
                                                your first meal plan!
                                            </p>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-gray-700">
                                        <ResetButton onReset={handleReset} />
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </DialogContent>
                    </Dialog>
                </header>

                {/* Budget Status Bar */}
                {budget > 0 && (
                    <Card className="mb-6 bg-gray-900 border-gray-700">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Remaining Budget
                                    </p>
                                    <p className="text-2xl font-bold text-green-400">
                                        ₹{remainingBudget}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-400">
                                        Total Budget
                                    </p>
                                    <p className="text-lg text-gray-300">
                                        ₹{budget}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-3 bg-gray-800 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.max(0, (remainingBudget / budget) * 100)}%`,
                                    }}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Generate Plan Button */}
                <div className="mb-6">
                    <Button
                        onClick={handleGeneratePlan}
                        disabled={
                            isGenerating ||
                            foodList.length === 0 ||
                            remainingBudget <= 0
                        }
                        className="w-full bg-white text-black hover:bg-gray-200 disabled:bg-gray-700 disabled:text-gray-400"
                        size="lg"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Generating Today's Meals...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Get Today's Meals
                            </>
                        )}
                    </Button>
                </div>

                {/* Setup Prompts */}
                {budget === 0 && (
                    <Card className="mb-6 bg-gray-900 border-gray-700 border-dashed">
                        <CardContent className="pt-6 text-center">
                            <p className="text-gray-400 mb-4">
                                Set up your monthly budget to get started
                            </p>
                            <Button
                                onClick={() => setIsSettingsOpen(true)}
                                variant="outline"
                                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Open Settings
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {budget > 0 && foodList.length === 0 && (
                    <Card className="mb-6 bg-gray-900 border-gray-700 border-dashed">
                        <CardContent className="pt-6 text-center">
                            <p className="text-gray-400 mb-4">
                                Add some food items to generate meal plans
                            </p>
                            <Button
                                onClick={() => setIsSettingsOpen(true)}
                                variant="outline"
                                className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
                            >
                                <Settings className="mr-2 h-4 w-4" />
                                Add Food Items
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Today's Plan */}
                {todaysPlan && (
                    <Card className="mb-6 bg-gray-900 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-white">
                                Today's Meal Plan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DailyPlan plan={todaysPlan} />
                        </CardContent>
                    </Card>
                )}

                {/* Quick Stats */}
                {history.length > 0 && (
                    <Card className="bg-gray-900 border-gray-700">
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Days Planned
                                    </p>
                                    <p className="text-xl font-bold text-white">
                                        {history.length}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">
                                        Total Spent
                                    </p>
                                    <p className="text-xl font-bold text-red-400">
                                        ₹
                                        {history.reduce(
                                            (sum, day) => sum + day.totalCost,
                                            0,
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
