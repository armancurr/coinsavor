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

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">
                    Your Food Items ({foodList.length})
                </h3>
                <Button onClick={() => setShowForm(true)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Food
                </Button>
            </div>

            {showForm && (
                <Card>
                    <CardContent className="pt-6">
                        <FoodItemForm
                            onSubmit={handleAddItem}
                            onCancel={() => setShowForm(false)}
                        />
                    </CardContent>
                </Card>
            )}

            {editingItem && (
                <Card>
                    <CardContent className="pt-6">
                        <FoodItemForm
                            initialItem={editingItem}
                            onSubmit={handleEditItem}
                            onCancel={() => setEditingItem(null)}
                        />
                    </CardContent>
                </Card>
            )}

            <div className="space-y-2">
                {foodList.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                        No food items added yet. Add some items to start
                        planning your meals!
                    </p>
                ) : (
                    foodList.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="flex items-center justify-between p-4">
                                <div>
                                    <h4 className="font-medium">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">
                                        ₹{item.price}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setEditingItem(item)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleDeleteItem(item.id)
                                        }
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
