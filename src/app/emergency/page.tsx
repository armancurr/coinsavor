"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { getBudget, saveBudget } from "@/lib/storage";

export default function EmergencyPage() {
  const [amount, setAmount] = useState("");
  const budget = getBudget();

  const onDeduct = (value: number) => {
    const newRemaining = Math.max(0, budget.remaining - value);
    saveBudget(budget.total, newRemaining);
    setAmount("");
    alert("Emergency expense recorded.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number.parseFloat(amount);
    if (Number.isFinite(value) && value > 0) onDeduct(value);
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

        <div className="rounded-lg border bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Add Emergency Expense
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div>
              <label
                htmlFor="expense-amount"
                className="text-slate-600 text-sm font-medium"
              >
                Expense Amount (₹)
              </label>
              <Input
                id="expense-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 50 for an ice cream"
                required
                className="mt-1 bg-slate-100"
              />
            </div>
            <div className="flex gap-3">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="bg-slate-800 text-white">
                Deduct Expense
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
