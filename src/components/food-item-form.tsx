"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FoodItem } from "@/lib/types";

interface FoodItemFormProps {
    initialItem?: FoodItem;
    onSubmit: (item: FoodItem) => void;
    onCancel: () => void;
}

export function FoodItemForm({
    initialItem,
    onSubmit,
    onCancel,
}: FoodItemFormProps) {
    const [name, setName] = useState(initialItem?.name || "");
    const [price, setPrice] = useState(initialItem?.price?.toString() || "");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !price.trim()) return;
        const priceNum = Number.parseFloat(price);
        if (priceNum <= 0) return;

        onSubmit({
            id: initialItem?.id || "",
            name: name.trim(),
            price: priceNum,
        });

        if (!initialItem) {
            setName("");
            setPrice("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label
                    htmlFor="food-name"
                    className="text-xs font-medium text-slate-600"
                >
                    Food Item Name
                </Label>
                <Input
                    id="food-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Chicken Curry"
                    required
                    className="mt-1 border-slate-300 bg-slate-100"
                />
            </div>
            <div>
                <Label
                    htmlFor="food-price"
                    className="text-xs font-medium text-slate-600"
                >
                    Price (₹)
                </Label>
                <Input
                    id="food-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 150"
                    required
                    className="mt-1 border-slate-300 bg-slate-100"
                />
            </div>
            <div className="flex items-center gap-4 pt-2">
                <Button
                    type="submit"
                    className="flex-1 bg-slate-800 text-white hover:bg-slate-900"
                >
                    {initialItem ? "Update Item" : "Add Item"}
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    className="text-slate-600 hover:bg-slate-100"
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}