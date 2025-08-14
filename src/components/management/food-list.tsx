"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FoodItemForm } from "@/components/management/food-item-form";
import { Edit2, Trash2, Plus, UtensilsCrossed } from "lucide-react";
import { saveFoodList } from "@/lib/storage";
import type { FoodItem } from "@/lib/types";

interface FoodListProps {
  foodList: FoodItem[];
  onFoodListUpdate: (foodList: FoodItem[]) => void;
}

export function FoodList({ foodList, onFoodListUpdate }: FoodListProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);

  const handleAddItem = (item: FoodItem) => {
    const newList = [...foodList, { ...item, id: Date.now().toString() }];
    saveFoodList(newList);
    onFoodListUpdate(newList);
    setShowForm(false);
  };

  const handleEditItem = (item: FoodItem) => {
    const newList = foodList.map((food) => (food.id === item.id ? item : food));
    saveFoodList(newList);
    onFoodListUpdate(newList);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    const newList = foodList.filter((item) => item.id !== id);
    saveFoodList(newList);
    onFoodListUpdate(newList);
  };

  const openFormForNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const openFormForEdit = (item: FoodItem) => {
    setShowForm(false);
    setEditingItem(item);
  };

  const closeForms = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2"></div>
        {!showForm && !editingItem && (
          <Button
            onClick={openFormForNew}
            size="sm"
            className="bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-600 hover:to-green-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add New
          </Button>
        )}
      </div>

      {/* Form Section */}
      {(showForm || editingItem) && (
        <Card className="mb-4 border-2 border-slate-200 bg-slate-50/50 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <FoodItemForm
              initialItem={editingItem ?? undefined}
              onSubmit={editingItem ? handleEditItem : handleAddItem}
              onCancel={closeForms}
            />
          </CardContent>
        </Card>
      )}

      {/* Food List TODO */}
      <div className="space-y-2">
        {foodList.length === 0 && !showForm && !editingItem ? (
          <div className="flex h-26 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50">
            <p className="text-center text-sm text-slate-500">
              No food items yet.
            </p>
          </div>
        ) : (
          foodList.map((item) => (
            <Card
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-semibold text-slate-800">{item.name}</h4>
                  <p className="text-sm font-medium text-lime-700">
                    ₹{item.price.toFixed(2)}
                  </p>
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openFormForEdit(item)}
                    className="h-8 w-8 text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-lg"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                    className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
