"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface BudgetInputProps {
    currentBudget: number;
    onBudgetUpdate: (newBudget: number) => void;
}

export function BudgetInput({
    currentBudget,
    onBudgetUpdate,
}: BudgetInputProps) {
    const [value, setValue] = useState(currentBudget.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newBudget = Number.parseFloat(value);
        if (newBudget > 0) {
            onBudgetUpdate(newBudget);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="monthly-budget" className="text-slate-600">
                    Your Monthly Budget (₹)
                </Label>
                <Input
                    id="monthly-budget"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g., 5000"
                    className="mt-1 bg-slate-100"
                />
            </div>
            <Button type="submit" className="w-full bg-slate-800 text-white">
                Set Budget
            </Button>
        </form>
    );
}