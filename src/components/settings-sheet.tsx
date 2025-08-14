"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetInput } from "@/components/management/budget";
import { FoodList } from "@/components/management/food-list";
import { WeeklyOverview } from "@/components/calendar/weekly-overview";
import { EmergencyExpense } from "@/components/emergency/emergency-expense";
import {
  SketchLogo,
  CaretRight,
  Fire,
  CalendarBlank,
  GearSix,
} from "@phosphor-icons/react";
import {
  getBudget,
  getDailyHistory,
  getFoodList,
  saveBudget,
  saveFoodList,
} from "@/lib/storage";
import type { FoodItem } from "@/lib/types";

interface SettingsSheetProps {
  onBudgetUpdate?: () => void;
}

export function SettingsSheet({ onBudgetUpdate }: SettingsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [budget, setBudget] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [foodList, setFoodListState] = useState<FoodItem[]>([]);
  const [history, setHistory] = useState(() => getDailyHistory());

  useEffect(() => {
    if (isOpen) {
      const b = getBudget();
      setBudget(b.total);
      setRemainingBudget(b.remaining);
      setFoodListState(getFoodList());
      setHistory(getDailyHistory());
    }
  }, [isOpen]);

  const handleBudgetUpdate = (newBudget: number) => {
    setBudget(newBudget);
    setRemainingBudget(newBudget);
    saveBudget(newBudget, newBudget);
    onBudgetUpdate?.();
  };

  const onFoodListUpdate = (list: FoodItem[]) => {
    setFoodListState(list);
    saveFoodList(list);
  };

  const handleEmergencyDeduct = (amount: number) => {
    const currentBudget = getBudget();
    const newRemaining = Math.max(0, currentBudget.remaining - amount);
    saveBudget(currentBudget.total, newRemaining);
    onBudgetUpdate?.();
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
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
            className="ml-1 transition-transform group-data-[state=open]:rotate-90"
          />
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2 text-lime-900">
            <SketchLogo size={20} weight="fill" className="text-lime-600" />
            Settings
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="emergency" className="flex flex-col h-full">
          <TabsList className="grid grid-cols-4 bg-lime-100 mb-4">
            <TabsTrigger value="emergency" className="text-xs p-2">
              <Fire size={16} weight="fill" className="text-amber-600" />
            </TabsTrigger>
            <TabsTrigger value="calendar" className="text-xs p-2">
              <CalendarBlank
                size={16}
                weight="fill"
                className="text-indigo-600"
              />
            </TabsTrigger>
            <TabsTrigger value="management" className="text-xs p-2">
              <GearSix size={16} weight="fill" className="text-neutral-700" />
            </TabsTrigger>
            <TabsTrigger value="overview" className="text-xs p-2">
              Overview
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-hidden">
            <TabsContent
              value="emergency"
              className="h-full overflow-y-auto mt-0"
            >
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Emergency Expense
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Quick deduction from your budget
                  </p>
                </div>

                <div className="flex justify-center">
                  <EmergencyExpense onDeduct={handleEmergencyDeduct} />
                </div>

                <Card className="bg-slate-50">
                  <CardContent className="p-4">
                    <h4 className="font-medium text-slate-700 mb-2">
                      Current Budget
                    </h4>
                    <div className="text-2xl font-bold text-lime-700">
                      ₹{remainingBudget.toFixed(2)}
                    </div>
                    <p className="text-sm text-slate-500">remaining</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="calendar"
              className="h-full overflow-y-auto mt-0"
            >
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    Calendar
                  </h3>
                  <p className="text-sm text-slate-500 mb-4">
                    View your planning calendar
                  </p>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <Calendar
                      mode="single"
                      selected={new Date()}
                      className="rounded-md w-full"
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent
              value="management"
              className="h-full overflow-y-auto mt-0"
            >
              <Tabs defaultValue="budget" className="h-full">
                <TabsList className="grid grid-cols-2 bg-slate-100 mb-4">
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                  <TabsTrigger value="food">Food</TabsTrigger>
                </TabsList>

                <div className="h-full overflow-hidden">
                  <TabsContent
                    value="budget"
                    className="h-full overflow-y-auto mt-0"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Budget Management
                      </h3>
                      <BudgetInput
                        currentBudget={budget}
                        onBudgetUpdate={handleBudgetUpdate}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="food"
                    className="h-full overflow-y-auto mt-0"
                  >
                    <div className="h-full">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Food Management
                      </h3>
                      <div className="h-[calc(100%-3rem)]">
                        <FoodList
                          foodList={foodList}
                          onFoodListUpdate={onFoodListUpdate}
                        />
                      </div>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </TabsContent>

            <TabsContent
              value="overview"
              className="h-full overflow-y-auto mt-0"
            >
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  Weekly Overview
                </h3>
                <WeeklyOverview history={history} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
