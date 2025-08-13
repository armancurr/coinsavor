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

        if (!name.trim() || !price.trim()) {
            alert("Please fill in all fields");
            return;
        }

        const priceNum = Number.parseFloat(price);
        if (priceNum <= 0) {
            alert("Price must be greater than 0");
            return;
        }

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
                <Label htmlFor="food-name">Food Item Name</Label>
                <Input
                    id="food-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Chicken Curry, Rice Bowl"
                    required
                />
            </div>

            <div>
                <Label htmlFor="food-price">Price (INR)</Label>
                <Input
                    id="food-price"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., 150"
                    min="0"
                    step="1"
                    required
                />
            </div>

            <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                    {initialItem ? "Update Item" : "Add Item"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
}
