import type { FoodItem, DailyPlan } from "./types";

export function generateDailyPlan(
  foods: FoodItem[],
  remainingBudget: number,
  history: DailyPlan[],
): { plan: DailyPlan; newBudget: number } | null {
  const today = new Date().toDateString();

  // Filter foods that fit within budget
  const affordableFoods = foods.filter((food) => food.price <= remainingBudget);

  if (affordableFoods.length === 0) {
    return null;
  }

  const maxAttempts = 50;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    // Randomly select three meals
    const breakfast = getRandomFood(affordableFoods);
    const lunch = getRandomFood(affordableFoods);
    const dinner = getRandomFood(affordableFoods);

    const totalCost = breakfast.price + lunch.price + dinner.price;

    // Check if within budget
    if (totalCost > remainingBudget) {
      continue;
    }

    // Create candidate plan
    const candidatePlan: DailyPlan = {
      date: today,
      meals: { breakfast, lunch, dinner },
      totalCost,
    };

    // Check variety against recent history (last 7 days)
    if (isVariedEnough(candidatePlan, history)) {
      return {
        plan: candidatePlan,
        newBudget: remainingBudget - totalCost,
      };
    }
  }

  // If we can't find a varied plan, return the last valid plan anyway
  // This prevents the app from being stuck when food options are limited
  const fallbackBreakfast = getRandomFood(affordableFoods);
  const fallbackLunch = getRandomFood(affordableFoods);
  const fallbackDinner = getRandomFood(affordableFoods);
  const fallbackCost =
    fallbackBreakfast.price + fallbackLunch.price + fallbackDinner.price;

  if (fallbackCost <= remainingBudget) {
    return {
      plan: {
        date: today,
        meals: {
          breakfast: fallbackBreakfast,
          lunch: fallbackLunch,
          dinner: fallbackDinner,
        },
        totalCost: fallbackCost,
      },
      newBudget: remainingBudget - fallbackCost,
    };
  }

  return null;
}

function getRandomFood(foods: FoodItem[]): FoodItem {
  const randomIndex = Math.floor(Math.random() * foods.length);
  return foods[randomIndex];
}

function isVariedEnough(
  candidatePlan: DailyPlan,
  history: DailyPlan[],
): boolean {
  // Check if the exact same combination was used in the last 7 days
  return !history.some((pastPlan) => {
    return (
      pastPlan.meals.breakfast.id === candidatePlan.meals.breakfast.id &&
      pastPlan.meals.lunch.id === candidatePlan.meals.lunch.id &&
      pastPlan.meals.dinner.id === candidatePlan.meals.dinner.id
    );
  });
}
