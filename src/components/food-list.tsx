"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FoodItemForm } from "@/components/food-item-form";
import { Edit2, Trash2, Plus } from "lucide-react";
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
        const newList = foodList.map((food) =>
            food.id === item.id ? item : food,
        );
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
        <div className="flex h-full flex-col">
            {/* Header Section */}
            <div className="mb-4 flex items-center justify-between">
                <h3 className="font-bold text-slate-800">
                    Your Food ({foodList.length})
                </h3>
                {!showForm && !editingItem && (
                    <Button
                        onClick={openFormForNew}
                        size="sm"
                        className="bg-slate-800 text-white hover:bg-slate-900"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                    </Button>
                )}
            </div>

            {/* Form Section for Adding/Editing */}
            {(showForm || editingItem) && (
                <Card className="mb-4 flex-shrink-0 bg-white">
                    <CardContent className="p-4">
                        <FoodItemForm
                            initialItem={editingItem ?? undefined}
                            onSubmit={editingItem ? handleEditItem : handleAddItem}
                            onCancel={closeForms}
                        />
                    </CardContent>
                </Card>
            )}

            {/* Scrollable List Container */}
            <div className="flex-grow space-y-2 overflow-y-auto pr-1">
                {foodList.length === 0 && !showForm && !editingItem ? (
                    <div className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
                        <p className="text-center text-sm text-slate-500">
                            No food items yet.
                            <br />
                            Click 'Add New' to start.
                        </p>
                    </div>
                ) : (
                    foodList.map((item) => (
                        <Card
                            key={item.id}
                            className="bg-white transition-all hover:bg-slate-50"
                        >
                            <CardContent className="flex items-center justify-between p-3">
                                <div>
                                    <h4 className="font-semibold text-slate-800">
                                        {item.name}
                                    </h4>
                                    <p className="text-sm font-medium text-lime-700">
                                        ₹{item.price.toFixed(2)}
                                    </p>
                                </div>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => openFormForEdit(item)}
                                        className="h-8 w-8 text-slate-500 hover:bg-slate-200 hover:text-slate-700"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="h-8 w-8 text-red-500 hover:bg-red-100 hover:text-red-600"
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