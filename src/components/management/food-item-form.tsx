"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [description, setDescription] = useState(
    initialItem?.description || "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price.trim()) return;
    const priceNum = Number.parseFloat(price);
    if (priceNum <= 0) return;

    onSubmit({
      id: initialItem?.id || "",
      name: name.trim(),
      price: priceNum,
      description: description.trim(),
    });

    if (!initialItem) {
      setName("");
      setPrice("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <Label
          htmlFor="food-name"
          className="text-slate-700 font-medium mb-2 block"
        >
          Food Item Name
        </Label>
        <input
          id="food-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full text-center text-4xl font-bold text-slate-800 bg-white border border-slate-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {/* Price */}
      <div>
        <Label
          htmlFor="food-price"
          className="text-slate-700 font-medium mb-2 block"
        >
          Price (₹)
        </Label>
        <input
          id="food-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          className="w-full text-center text-4xl font-bold text-slate-800 bg-white border border-slate-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {/* Description */}
      <div>
        <Label
          htmlFor="food-description"
          className="text-slate-700 font-medium mb-2 block"
        >
          Short Description
        </Label>
        <input
          id="food-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full text-center text-4xl font-bold text-slate-800 bg-white border border-slate-400 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 pt-2">
        <Button
          type="submit"
          className="flex-1 bg-slate-800 text-white text-md py-4"
        >
          {initialItem ? "Update Item" : "Add Item"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 bg-slate-800 text-white text-md py-4"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
