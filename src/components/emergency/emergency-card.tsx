"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, AlertTriangle, Minus } from "lucide-react";

interface EmergencyExpenseProps {
  onDeduct: (amount: number) => void;
}

export function EmergencyExpense({ onDeduct }: EmergencyExpenseProps) {
  const [amount, setAmount] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const expenseAmount = Number.parseFloat(amount);
    if (expenseAmount > 0) {
      setIsSubmitting(true);
      // Add slight delay for smooth animation feedback
      await new Promise((resolve) => setTimeout(resolve, 300));
      onDeduct(expenseAmount);
      setAmount("");
      setIsOpen(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {/* Mobile-first floating action button style trigger */}
        <Button
          size="lg"
          className="relative group h-14 w-14 rounded-full bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 shadow-lg shadow-amber-500/25 border-0 hover:shadow-xl hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-600 via-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          <Flame className="h-6 w-6 text-white relative z-10 group-hover:animate-pulse" />
          {/* Subtle glow effect */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-amber-500 to-red-500 opacity-20 blur-md animate-pulse" />
        </Button>
      </DialogTrigger>

      <DialogContent className="mx-4 rounded-2xl bg-white border border-slate-200 shadow-2xl max-w-md w-full">
        {/* Clean header aligned with app theme */}
        <DialogHeader className="text-center pb-4">
          <div className="mx-auto mb-4 relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            {/* Subtle pulsing ring animation */}
            <div className="absolute inset-0 w-16 h-16 rounded-full bg-amber-400 animate-ping opacity-10" />
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Emergency Expense
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-2">
            Quick deduction from your budget
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-8 py-4">
          {/* Large, prominent input field */}
          <Card className="border-2 border-slate-200 bg-slate-50/50">
            <CardContent className="p-6">
              <Label
                htmlFor="expense-amount"
                className="text-slate-700 font-medium mb-4 block"
              >
                Enter Amount
              </Label>
              <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-2xl">
                  ₹
                </div>
                <Input
                  id="expense-amount"
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="h-20 pl-14 pr-6 text-4xl font-bold bg-white border-2 border-slate-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all duration-200 text-center"
                />
                {/* Focus indicator */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-400/5 to-orange-400/5 opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none" />
              </div>
              <p className="text-sm text-slate-500 mt-3 text-center">
                This amount will be deducted from your remaining budget
              </p>
            </CardContent>
          </Card>

          <DialogFooter className="gap-3 pt-6">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-300 hover:bg-slate-50 transition-colors duration-200"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
              className="flex-1 h-12 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4" />
                  Deduct Amount
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>

        {/* Subtle decorative elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-amber-200/20 to-orange-200/20 rounded-full blur-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-orange-200/20 to-amber-200/20 rounded-full blur-lg pointer-events-none" />
      </DialogContent>
    </Dialog>
  );
}
