"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { BudgetInput } from "@/components/budget-input";
import { FoodList } from "@/components/food-list";
import { WeeklyOverview } from "@/components/weekly-overview";
import { ResetButton } from "@/components/reset-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getBudget,
  getDailyHistory,
  getFoodList,
  saveBudget,
  saveFoodList,
  clearAllData,
} from "@/lib/storage";
import type { FoodItem } from "@/lib/types";

export default function ManagementPage() {
  const [budget, setBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [foodList, setFoodListState] = useState<FoodItem[]>([]);
  const [history, setHistory] = useState(() => getDailyHistory());

  useEffect(() => {
    const b = getBudget();
    setBudget(b.total);
    setRemainingBudget(b.remaining);
    setFoodListState(getFoodList());
    setHistory(getDailyHistory());
  }, []);

  const handleBudgetUpdate = (newBudget: number) => {
    setBudget(newBudget);
    setRemainingBudget(newBudget);
    saveBudget(newBudget, newBudget);
  };

  const onFoodListUpdate = (list: FoodItem[]) => {
    setFoodListState(list);
    saveFoodList(list);
  };

  const handleReset = () => {
    clearAllData();
    setBudget(0);
    setRemainingBudget(0);
    setFoodListState([]);
    setHistory([]);
  };

  return (
    <div className="min-h-screen font-sans">
      <div className="container mx-auto max-w-md px-4 py-6">
        <div className="mb-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        </div>

        <Tabs
          defaultValue="budget"
          className="flex flex-grow flex-col overflow-hidden"
        >
          <TabsList className="mx-0 grid flex-shrink-0 grid-cols-3 bg-lime-100">
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="food">Food</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>
          <TabsContent
            value="budget"
            className="flex-grow overflow-y-auto p-0 py-4"
          >
            <BudgetInput
              currentBudget={budget}
              onBudgetUpdate={handleBudgetUpdate}
            />
          </TabsContent>
          <TabsContent
            value="food"
            className="flex-grow overflow-y-auto p-0 py-4"
          >
            <FoodList foodList={foodList} onFoodListUpdate={onFoodListUpdate} />
          </TabsContent>
          <TabsContent
            value="overview"
            className="flex-grow overflow-y-auto p-0 py-4"
          >
            <WeeklyOverview history={history} />
            <div className="mt-6 border-t pt-4">
              <ResetButton onReset={handleReset} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
