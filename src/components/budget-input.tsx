"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BudgetInputProps {
    currentBudget: number;
    remainingBudget: number;
    onBudgetUpdate: (budget: number) => void;
}

export function BudgetInput({
    currentBudget,
    remainingBudget,
    onBudgetUpdate,
}: BudgetInputProps) {
    const [inputValue, setInputValue] = useState<string>(
        currentBudget.toString(),
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const budget = Number.parseFloat(inputValue);
        if (budget > 0) {
            onBudgetUpdate(budget);
        }
    };

    const spentAmount = currentBudget - remainingBudget;
    const spentPercentage =
        currentBudget > 0 ? (spentAmount / currentBudget) * 100 : 0;

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="flex-1">
                    <Label htmlFor="budget">Monthly Budget (INR)</Label>
                    <Input
                        id="budget"
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your monthly food budget"
                        min="0"
                        step="1"
                    />
                </div>
                <div className="flex items-end">
                    <Button type="submit">Set Budget</Button>
                </div>
            </form>

            {currentBudget > 0 && (
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Total Budget:</span>
                        <span className="font-medium">
                            ₹{currentBudget.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Spent:</span>
                        <span className="font-medium text-destructive">
                            ₹{spentAmount.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Remaining:</span>
                        <span className="font-medium text-green-600">
                            ₹{remainingBudget.toLocaleString()}
                        </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-secondary rounded-full h-2">
                        <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                                width: `${Math.min(spentPercentage, 100)}%`,
                            }}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                        {spentPercentage.toFixed(1)}% of budget used
                    </p>
                </div>
            )}
        </div>
    );
}
