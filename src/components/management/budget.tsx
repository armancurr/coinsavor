"use client";

import { Button } from "@/components/ui/button";
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
      {/* Title & Description */}
      <div>
        <h3 className="font-semibold text-slate-900 mb-1">Budget Management</h3>
        <p className="text-sm text-slate-600 mb-4">
          Set your monthly budget to track and manage your expenses.
        </p>
      </div>

      {/* Big Input Field (identical to Emergency Expense) */}
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full text-center text-4xl font-bold text-slate-800 bg-white border border-slate-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-slate-500"
      />

      {/* Submit Button */}
      <Button
        size="sm"
        type="submit"
        className="w-full bg-slate-800 text-white text-md py-6"
      >
        Set Budget
      </Button>
    </form>
  );
}
