import type { FoodItem, DailyPlan, BudgetData } from "./types";

const STORAGE_KEYS = {
  BUDGET: "food-budget-data",
  FOOD_LIST: "food-list",
  DAILY_HISTORY: "daily-history",
} as const;

// Budget operations
export function getBudget(): BudgetData {
  if (typeof window === "undefined") return { total: 0, remaining: 0 };

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BUDGET);
    return stored ? JSON.parse(stored) : { total: 0, remaining: 0 };
  } catch {
    return { total: 0, remaining: 0 };
  }
}

export function saveBudget(total: number, remaining: number): void {
  if (typeof window === "undefined") return;

  const budgetData: BudgetData = { total, remaining };
  localStorage.setItem(STORAGE_KEYS.BUDGET, JSON.stringify(budgetData));
}

// Food list operations
export function getFoodList(): FoodItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FOOD_LIST);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveFoodList(foodList: FoodItem[]): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEYS.FOOD_LIST, JSON.stringify(foodList));
}

// Daily history operations
export function getDailyHistory(): DailyPlan[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.DAILY_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveDailyPlan(plan: DailyPlan): void {
  if (typeof window === "undefined") return;

  const history = getDailyHistory();
  const today = new Date().toDateString();

  // Remove today's plan if it already exists
  const filteredHistory = history.filter((p) => p.date !== today);

  // Add new plan and keep only last 7 days
  const updatedHistory = [plan, ...filteredHistory].slice(0, 7);

  localStorage.setItem(
    STORAGE_KEYS.DAILY_HISTORY,
    JSON.stringify(updatedHistory),
  );
}

// Clear all data
export function clearAllData(): void {
  if (typeof window === "undefined") return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}
