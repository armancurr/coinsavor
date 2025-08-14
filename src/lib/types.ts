export interface FoodItem {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface DailyPlan {
  date: string;
  meals: {
    breakfast: FoodItem;
    lunch: FoodItem;
    dinner: FoodItem;
  };
  totalCost: number;
}

export interface BudgetData {
  total: number;
  remaining: number;
}
